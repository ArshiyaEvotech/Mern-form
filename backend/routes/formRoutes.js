// routes/formRoutes.js
const router = require('express').Router();
const Form = require('../models/Form');
const Submission = require('../models/Submission');

router.post('/', async (req, res) => {
  const newForm = new Form(req.body);
  await newForm.save();
  res.json(newForm);
});

router.get('/', async (req, res) => {
  const forms = await Form.find();
  res.json(forms);
});

router.get('/:id', async (req, res) => {
  const form = await Form.findById(req.params.id);

  if (!form) {
    return res.status(404).json({ message: 'Form not found' });
  }

  res.json(form);
});

router.put('/:id', async (req, res) => {
  const { title } = req.body;

  if (!title?.trim()) {
    return res.status(400).json({ message: 'Form title is required' });
  }

  const updatedForm = await Form.findByIdAndUpdate(
    req.params.id,
    { title: title.trim() },
    { new: true }
  );

  if (!updatedForm) {
    return res.status(404).json({ message: 'Form not found' });
  }

  res.json(updatedForm);
});

router.delete('/:id', async (req, res) => {
  const form = await Form.findById(req.params.id);

  if (!form) {
    return res.status(404).json({ message: 'Form not found' });
  }

  await Submission.deleteMany({ formId: req.params.id });
  await Form.findByIdAndDelete(req.params.id);

  res.json({ message: 'Form deleted successfully' });
});

router.delete('/', async (_req, res) => {
  await Submission.deleteMany({});
  await Form.deleteMany({});
  res.json({ message: 'All forms deleted successfully' });
});

module.exports = router;
