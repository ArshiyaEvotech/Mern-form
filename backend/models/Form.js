const mongoose = require('mongoose');
const FormSchema = new mongoose.Schema({
  title: { type: String, required: true },
  fields: { type: Array, required: true }, // Stores labels, types, and order [cite: 7, 8, 9]
  createdBy: { type: String, default: 'admin@evotech.global' }
}, { timestamps: true });
module.exports = mongoose.model('Form', FormSchema);