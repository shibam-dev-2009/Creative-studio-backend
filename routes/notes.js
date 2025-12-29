const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const Note = require("../models/Note");
const auth = require("../middleware/auth");

router.post("/upload", auth, upload.single("pdf"), async (req, res) => {
  try {
    // Check if file exists to prevent a 500 crash
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded. Ensure the field name is 'pdf'" });
    }

    const note = new Note({
      title: req.body.title,
      class: req.body.class,
      subject: req.body.subject,
      type: req.body.type,
      filePath: req.file.path
    });

    await note.save();
    res.json({ message: "Uploaded successfully" });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Server error during upload", error: error.message });
  }
});