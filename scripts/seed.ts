import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import mongoose from 'mongoose';

const DOCTOR_DATA = {
    name: "Dr. Sarah Smith",
    specialization: "Orthodontist",
    bio: "Dr. Smith has over 15 years of experience in creating beautiful smiles. She specializes in Invisalign and cosmetic dentistry.",
    avatarUrl: "/images/doctor.png",
    availability: [
        { day: "Monday", slots: ["09:00", "10:00", "11:00", "14:00", "15:00"] },
        { day: "Tuesday", slots: ["09:00", "10:00", "11:00", "14:00", "15:00"] },
        { day: "Wednesday", slots: ["09:00", "10:00", "11:00", "14:00", "15:00"] },
        { day: "Thursday", slots: ["09:00", "10:00", "11:00", "14:00", "15:00"] },
        { day: "Friday", slots: ["09:00", "10:00", "11:00", "13:00"] },
        { day: "Saturday", slots: ["09:00", "10:00", "11:00", "13:00"] },
        { day: "Sunday", slots: ["09:00", "10:00", "11:00", "13:00"] }
    ]
};

async function seed() {
    try {
        // Dynamic imports to ensure env vars are loaded first
        const dbConnect = (await import('../lib/db')).default;
        const Doctor = (await import('../models/Doctor')).default;
        const DaySchedule = (await import('../models/DaySchedule')).default;

        console.log('Connecting to database...');
        await dbConnect();
        console.log('Connected!');

        console.log('Clearing existing data...');
        await Doctor.deleteMany({});
        await DaySchedule.deleteMany({});

        console.log('Creating Doctor...');
        const doctor = await Doctor.create(DOCTOR_DATA);
        console.log(`Doctor created: ${doctor.name}`);

        console.log('Generating Schedules for the next 30 days...');
        const schedules = [];
        const today = new Date();

        for (let i = 0; i < 30; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);

            const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
            const dateString = date.toISOString().split('T')[0];

            const availability = doctor.availability.find(a => a.day === dayName);

            if (availability) {
                const slots = availability.slots.map(time => ({
                    time,
                    isBooked: false,
                    lockedUntil: undefined,
                    bookedBy: undefined
                }));

                schedules.push({
                    date: dateString,
                    doctorId: doctor._id,
                    slots,
                    version: 0
                });
            }
        }

        await DaySchedule.insertMany(schedules);
        console.log(`Created ${schedules.length} day schedules.`);

        console.log('Seeding complete!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
}

seed();
