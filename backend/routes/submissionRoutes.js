// routes/submissionRoutes.js
const router = require('express').Router();
const Submission = require('../models/Submission');

// User submits form [cite: 11, 24]
router.post('/', async (req, res) => {
  const submission = new Submission({
    formId: req.body.formId,
    submittedBy: req.body.submittedBy,
    responses: req.body.data,
  });
  await submission.save();
  res.json({ message: "Submitted successfully" });
});

// Admin views all submissions for a specific form [cite: 18]
router.get('/:formId', async (req, res) => {
  const results = await Submission.find({ formId: req.params.formId });
  res.json(results);
});

module.exports = router;
