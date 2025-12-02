'use server';

import dbConnect from '@/lib/db';
import DaySchedule from '@/models/DaySchedule';
import mongoose from 'mongoose';

export async function getAvailableSlots(date: string) {
    await dbConnect();

    // First, try to find existing schedule
    let schedule = await DaySchedule.findOne({ date }).lean();

    // If schedule doesn't exist, auto-generate it
    if (!schedule) {
        const requestedDate = new Date(date);
        const dayName = requestedDate.toLocaleDateString('en-US', { weekday: 'long' });

        // Get doctor's availability for this day
        const DoctorModule = await import('@/models/Doctor');
        const Doctor = DoctorModule.default;
        const doctor = await Doctor.findOne().lean().exec();

        if (!doctor) {
            console.warn('No doctor found in database');
            return [];
        }

        // Find availability for this specific day of the week
        const availability = doctor.availability.find((a: any) => a.day === dayName);

        if (!availability || !availability.slots || availability.slots.length === 0) {
            // No slots available for this day of the week
            return [];
        }

        // Create new schedule for this date
        const newSchedule = {
            date: date,
            doctorId: doctor._id,
            slots: availability.slots.map((time: string) => ({
                time,
                isBooked: false,
                lockedUntil: undefined,
                bookedBy: undefined
            })),
            version: 0
        };

        try {
            const created = await DaySchedule.create(newSchedule);
            schedule = created.toObject();
            console.log(`Auto-generated schedule for ${date} (${dayName})`);
        } catch (error) {
            console.error('Failed to auto-generate schedule:', error);
            return [];
        }
    }

    // Return only necessary data and convert ObjectIds to strings if needed
    return JSON.parse(JSON.stringify(schedule.slots));
}

export async function bookSlot(
    date: string,
    time: string,
    patientDetails: { name: string; mobile: string; email?: string; reasonForVisit?: string }
) {
    await dbConnect();
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // 1. Check for duplicate booking by mobile number on the same day
        const existingBooking = await DaySchedule.findOne({
            date: date,
            "slots": {
                $elemMatch: {
                    isBooked: true,
                    patientMobile: patientDetails.mobile
                }
            }
        }).session(session);

        if (existingBooking) {
            throw new Error("You already have an appointment booked for this date.");
        }

        // 2. Atomic update to book the slot
        const result = await DaySchedule.findOneAndUpdate(
            {
                date: date,
                "slots.time": time,
                "slots.isBooked": false
            },
            {
                $set: {
                    "slots.$.isBooked": true,
                    "slots.$.bookedBy": new mongoose.Types.ObjectId(), // In a real app, this would be the user ID
                    "slots.$.patientName": patientDetails.name,
                    "slots.$.patientMobile": patientDetails.mobile,
                    "slots.$.patientEmail": patientDetails.email,
                    "slots.$.reasonForVisit": patientDetails.reasonForVisit
                }
            },
            { session, new: true }
        );

        if (!result) {
            throw new Error("Slot already taken or not found");
        }

        await session.commitTransaction();

        // Send WhatsApp confirmation after successful booking
        try {
            const { sendWhatsAppConfirmation } = await import('@/lib/whatsapp');
            const formattedDate = new Date(date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            await sendWhatsAppConfirmation(patientDetails.mobile, {
                patientName: patientDetails.name,
                date: formattedDate,
                time: time
            });
        } catch (whatsappError) {
            // Log error but don't fail the booking
            console.error('WhatsApp notification failed:', whatsappError);
        }

        return { success: true };
    } catch (error: any) {
        await session.abortTransaction();
        console.error("Booking failed:", error);
        return { success: false, error: error.message || "Booking failed. Slot might be taken." };
    } finally {
        session.endSession();
    }
}
