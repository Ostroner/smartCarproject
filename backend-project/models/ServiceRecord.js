const mongoose = require('mongoose');

const serviceRecordSchema = new mongoose.Schema({
  carId: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
  serviceId: { type: Number, required: true },
  description: { type: String, default: '' },
  cost: { type: Number, required: true },
  date: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ServiceRecord', serviceRecordSchema);
