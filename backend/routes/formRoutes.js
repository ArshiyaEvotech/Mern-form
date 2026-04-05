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

router.delete('/', async (_req, res) => {
  await Submission.deleteMany({});
  await Form.deleteMany({});
  res.json({ message: 'All forms deleted successfully' });
});

module.exports = router;
