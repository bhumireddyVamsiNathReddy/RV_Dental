'use server';

import dbConnect from '@/lib/db';
import DaySchedule from '@/models/DaySchedule';

export async function getAllAppointments() {
    await dbConnect();

    // Fetch all schedules with booked slots
    const schedules = await DaySchedule.find({
        "slots.isBooked": true
    }).sort({ date: 1 }).lean();

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
