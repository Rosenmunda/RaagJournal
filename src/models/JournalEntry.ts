import { Schema, model, models } from 'mongoose';

const TaskSchema = new Schema({
  taskName: { type: String, required: true },
  isCompleted: { type: Boolean, default: false },
  priority: { 
    type: String, 
    enum: ['High', 'Med', 'Low'], 
    default: 'Med' 
  },
});

const JournalEntrySchema = new Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  date: { 
    type: String, // ISO string (YYYY-MM-DD) for easier querying by date
    required: true,
  },
  headline: { type: String, required: true },
  content: { type: String, default: "" },
  moodColor: { type: String, default: "#C3E5C4" }, // Default to Sage Green
  tags: [{ type: String }],
  tasks: [TaskSchema],
  dailyFocus: { type: String, default: "" },
  gratitude: [{ type: String }],
  thoughtOfTheDay: { type: String, default: "" },
}, {
  timestamps: true,
});

// Compound unique index: one entry per user per date
JournalEntrySchema.index({ userId: 1, date: 1 }, { unique: true });

const JournalEntry = models.JournalEntry || model('JournalEntry', JournalEntrySchema);

export default JournalEntry;
