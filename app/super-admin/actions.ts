'use server';

import dbConnect from '@/lib/db';
import DaySchedule from '@/models/DaySchedule';

export async function getAnalytics() {
    await dbConnect();

    // Aggregate stats
    // We need to look at all DaySchedules and their slots
    const pipeline = [
        { $unwind: "$slots" },
        {
            $match: {
                "slots.isBooked": true
            }
        },
        {
            $group: {
                _id: null,
                totalBooked: { $sum: 1 },
                pending: {
                    $sum: {
                        $cond: [{ $or: [{ $eq: ["$slots.status", "pending"] }, { $eq: ["$slots.status", null] }] }, 1, 0]
                    }
                },
                confirmed: {
                    $sum: {
                        $cond: [{ $eq: ["$slots.status", "confirmed"] }, 1, 0]
                    }
                },
                visited: {
                    $sum: {
                        $cond: [{ $eq: ["$slots.status", "visited"] }, 1, 0]
                    }
                },
                cancelled: {
                    $sum: {
                        $cond: [{ $eq: ["$slots.status", "cancelled"] }, 1, 0]
                    }
                }
            }
        }
    ];

    const result = await DaySchedule.aggregate(pipeline);

    if (result.length > 0) {
        return {
            totalBooked: result[0].totalBooked,
            pending: result[0].pending,
            confirmed: result[0].confirmed,
            visited: result[0].visited,
            cancelled: result[0].cancelled
        };
    } else {
        return {
            totalBooked: 0,
            pending: 0,
            confirmed: 0,
            visited: 0,
            cancelled: 0
        };
    }
}

export async function getAppointmentsByStatus(status: string) {
    await dbConnect();

    // If status is 'pending', we also want to include those with null status (legacy)
    const statusQuery = status === 'pending'
        ? { $in: ['pending', null] }
        : status;

    const schedules = await DaySchedule.find({
        "slots": {
            $elemMatch: {
                isBooked: true,
                status: statusQuery
            }
        }
    }).lean();

    const appointments = schedules.flatMap(schedule =>
        schedule.slots
            .filter((slot: any) =>
                slot.isBooked && (
                    status === 'pending'
                        ? (slot.status === 'pending' || !slot.status)
                        : slot.status === status
                )
            )
            .map((slot: any) => ({
                id: slot._id.toString(),
                date: schedule.date,
                time: slot.time,
                patientName: slot.patientName || "Guest User",
                patientMobile: slot.patientMobile || "N/A",
                status: slot.status || "pending"
            }))
    );

    return appointments;
}
