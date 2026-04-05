const mongoose = require('mongoose');
const SubmissionSchema = new mongoose.Schema({
  formId: { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true },
  responses: { type: Object, required: true }, // Key-value pairs of form data [cite: 11, 12]
  submittedBy: { type: String, required: true }
}, { timestamps: true });
module.exports = mongoose.model('Submission', SubmissionSchema);