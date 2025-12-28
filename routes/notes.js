const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const Note = require("../models/Note");
const auth = require("../middleware/auth");

router.post("/upload", auth, upload.single("pdf"), async (req, res) => {
  const note = new Note({
    title: req.body.title,
    class: req.body.class,
    subject: req.body.subject,
    type: req.body.type,
    filePath: req.file.path
  });

  await note.save();
  res.json({ message: "Uploaded successfully" });
});

router.get("/", async (req, res) => {
  const notes = await Note.find();
  res.json(notes);
});

// PASTE THE DELETE CODE HERE
router.delete('/:id', async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
