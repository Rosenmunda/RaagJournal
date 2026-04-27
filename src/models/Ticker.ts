import { Schema, model, models } from 'mongoose';

const TickerSchema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  lines: {
    type: [String],
    required: true,
    default: ["", "", ""]
  }
}, {

  timestamps: true,
});

const Ticker = models.Ticker || model('Ticker', TickerSchema);

export default Ticker;
