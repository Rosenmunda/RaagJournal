import mongoose, { Schema, Document } from 'mongoose';

export interface IImportantDate extends Document {
  date: Date;
  label: string;
  createdAt: Date;
}

const ImportantDateSchema: Schema = new Schema({
  userId: { type: String, required: true, index: true },
  date: { type: Date, required: true },
  label: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});


// Auto-delete after 24 hours of the target date passing could be done via TTL
// but MongoDB TTL is relative to a field. 
// We want to delete when NOW > date.
// A common trick is to have an 'expireAt' field and set it to the target date.
// But we want to keep it until the day passes.

export default mongoose.models.ImportantDate || mongoose.model<IImportantDate>('ImportantDate', ImportantDateSchema);
