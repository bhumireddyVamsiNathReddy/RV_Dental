import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISlot {
    time: string;
    isBooked: boolean;
    lockedUntil?: Date;
    bookedBy?: mongoose.Types.ObjectId;
    patientName?: string;
    patientMobile?: string;
    patientEmail?: string;
}

export interface IDaySchedule extends Document {
    date: string; // ISO Date String YYYY-MM-DD
    doctorId: mongoose.Types.ObjectId;
    slots: ISlot[];
    version: number;
}

const SlotSchema: Schema = new Schema({
    time: { type: String, required: true },
    isBooked: { type: Boolean, default: false },
    lockedUntil: { type: Date },
    bookedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    patientName: { type: String },
    patientMobile: { type: String },
    patientEmail: { type: String }
});

const DayScheduleSchema: Schema = new Schema({
    date: { type: String, required: true, index: true },
    doctorId: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
    slots: [SlotSchema],
    version: { type: Number, default: 0 }
});

// Optimistic concurrency control
/* eslint-disable @typescript-eslint/no-explicit-any */
DayScheduleSchema.pre('save', function (next: any) {
    this.increment();
    next();
});

const DaySchedule: Model<IDaySchedule> = mongoose.models.DaySchedule || mongoose.model<IDaySchedule>('DaySchedule', DayScheduleSchema);

export default DaySchedule;
