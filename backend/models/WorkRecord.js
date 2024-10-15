const mongoose = require('mongoose');

const WorkRecordSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Referencia al usuario
    required: true,
  },
  checkInTime: {
    type: Date,
    required: true,
  },
  checkOutTime: {
    type: Date,
  },
  location: {
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
  },
  isRemote: {
    type: Boolean,
    default: false,
  }
});

module.exports = mongoose.model('WorkRecord', WorkRecordSchema);
