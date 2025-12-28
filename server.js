const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// FIX 1: Create 'app' BEFORE using it
const app = express();

// FIX 2: Better CORS configuration
app.use(cors({
  origin: 'https://shibam-dev-2009.github.io',
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// Routes
app.use("/api/notes", require("./routes/notes"));
app.use("/uploads", express.static("uploads"));
app.use("/api/admin", require("./routes/admin"));

// FIX 3: Make sure 'Note' is imported if you use it here
// const Note = require("./models/Note"); 

app.delete("/api/notes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // Ensure the Note model is defined or imported
    await mongoose.model("Note").findByIdAndDelete(id); 
    res.send("Deleted");
  } catch (error) {
    res.status(500).send(error);
  }
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected", mongoose.connection.name))
  .catch((err) => console.log(err));

// FIX 4: Ensure PORT is compatible with Render
const PORT = process.env.PORT || 10000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is actually running on port ${PORT}`);
});