const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
app.use(cors({
  origin: 'https://shibam-dev-2009.github.io' 
}));
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/notes", require("./routes/notes"));
app.use("/uploads", express.static("uploads"));
app.use("/api/admin", require("./routes/admin"));
app.delete("/api/notes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Note.findByIdAndDelete(id);
    res.send("Deleted");
  } catch (error) {
    res.status(500).send(error);
  }
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected", mongoose.connection.name))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});