import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDoctor extends Document {
    name: string;
    specialization: string;
    bio: string;
    avatarUrl: string;
    availability: {
        day: string;
        slots: string[];
    }[];
}

const DoctorSchema: Schema = new Schema({
    name: { type: String, required: true },
    specialization: { type: String, required: true },
    bio: { type: String, required: true },
    avatarUrl: { type: String, required: true },
    availability: [{
        day: { type: String, required: true },
        slots: [{ type: String, required: true }]
    }]
});

const Doctor: Model<IDoctor> = mongoose.models.Doctor || mongoose.model<IDoctor>('Doctor', DoctorSchema);

export default Doctor;
