const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const Note = require("../models/Note");
const auth = require("../middleware/auth");
const cloudinary = require("cloudinary").v2; // FIX: Added missing import

// 1. GET ALL NOTES
router.get("/", async (req, res) => {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (err) {
    console.error("Fetch error:", err.message);
    res.status(500).json({ message: "Error fetching notes" });
  }
});

// 2. UPLOAD A NOTE
router.post("/upload", auth, upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const note = new Note({
      title: req.body.title,
      class: req.body.class,
      subject: req.body.subject,
      type: req.body.type,
      filePath: req.file.path 
    });

    await note.save();
    res.json({ message: "Uploaded to Cloudinary successfully!" });
  } catch (error) {
    console.error("DETAILED ERROR:", error);
    res.status(500).json({ 
      message: "Server error during upload", 
      error: error.message 
    });
  }
});

// 3. DELETE A NOTE (Combined logic)
router.delete('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Delete from Cloudinary
    // Extract public_id from the URL (notes_uploads/filename)
    const urlParts = note.filePath.split('/');
    const fileNameWithExtension = urlParts[urlParts.length - 1]; // e.g. "12345.pdf"
    const publicId = `notes_uploads/${fileNameWithExtension.split('.')[0]}`;
    
    // For PDFs, use resource_type: 'image' or 'raw' depending on how it was uploaded
    // Usually 'image' works for PDFs in Cloudinary, but 'auto' in upload means we try:
    await cloudinary.uploader.destroy(publicId); 

    // Delete from Database
    await Note.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err.message);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
});

module.exports = router;