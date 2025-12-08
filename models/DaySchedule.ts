import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISlot {
    time: string;
    isBooked: boolean;
    lockedUntil?: Date;
    bookedBy?: mongoose.Types.ObjectId;
    patientName?: string;
    patientMobile?: string;
    patientEmail?: string;
    reasonForVisit?: string;
    status?: 'pending' | 'confirmed' | 'visited' | 'cancelled' | 'no-show';
    treatmentDate?: Date;
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
    patientEmail: { type: String },
    reasonForVisit: { type: String },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'visited', 'cancelled', 'no-show'],
        default: 'pending'
    },
    treatmentDate: { type: Date }
});

const DayScheduleSchema: Schema = new Schema({
    date: { type: String, required: true, index: true },
    doctorId: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
    slots: [SlotSchema],
    version: { type: Number, default: 0 }
});

// Optimistic concurrency control
DayScheduleSchema.pre('save', function () {
    this.increment();
});

const DaySchedule: Model<IDaySchedule> = mongoose.models.DaySchedule || mongoose.model<IDaySchedule>('DaySchedule', DayScheduleSchema);

export default DaySchedule;
