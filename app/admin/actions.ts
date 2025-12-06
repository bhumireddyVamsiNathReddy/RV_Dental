'use server';

import dbConnect from '@/lib/db';
import DaySchedule from '@/models/DaySchedule';

export async function getAllAppointments() {
    await dbConnect();

    // Fetch all schedules with booked slots
    const schedules = await DaySchedule.find({
        "slots.isBooked": true
    }).sort({ date: -1 }).lean();

    // Flatten and format
    const appointments = schedules.flatMap(schedule =>
        schedule.slots
            .filter((slot: any) => slot.isBooked)
            .map((slot: any) => ({
                id: slot._id.toString(),
                date: schedule.date,
                time: slot.time,
                patientName: slot.patientName || "Guest User",
                patientMobile: slot.patientMobile || "N/A",
                patientEmail: slot.patientEmail || "",
                reasonForVisit: slot.reasonForVisit || "",
                status: "Confirmed"
            }))
    );

    return appointments;
}

export async function getDoctorAvailability() {
    await dbConnect();
    const Doctor = (await import('@/models/Doctor')).default;
    const doctor = await Doctor.findOne().lean();

    if (!doctor) {
        return [];
    }

    return doctor.availability.map((a: any) => ({
        day: a.day,
        slots: a.slots
    }));
}

export async function updateDoctorAvailability(availability: { day: string; slots: string[] }[]) {
    await dbConnect();
    const Doctor = (await import('@/models/Doctor')).default;

    // Update the first doctor found (assuming single doctor for now)
    const doctor = await Doctor.findOne();

    if (!doctor) {
        throw new Error("Doctor not found");
    }

    doctor.availability = availability;
    await doctor.save();

    // Delete future schedules that have NO bookings so they can be regenerated with new availability
    const DaySchedule = (await import('@/models/DaySchedule')).default;
    const today = new Date().toISOString().split('T')[0];

    await DaySchedule.deleteMany({
        date: { $gte: today },
        "slots.isBooked": { $ne: true } // Only delete if NO slots are booked
    });

    return { success: true };
}
