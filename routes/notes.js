const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const Note = require("../models/Note");
const auth = require("../middleware/auth");

// 1. GET ALL NOTES
router.get("/", async (req, res) => {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ message: "Error fetching notes" });
  }
});

// 2. UPLOAD A NOTE
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

// 3. DELETE A NOTE
// Add 'auth' to protect this route
router.delete('/:id', auth, async (req, res) => {
  try {
    const deletedNote = await Note.findByIdAndDelete(req.params.id);
    
    if (!deletedNote) {
      return res.status(404).json({ message: "Note not found" });
    }
    
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
});
// CRITICAL: This must be at the very end
module.exports = router;