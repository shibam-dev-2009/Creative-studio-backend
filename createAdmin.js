const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const Admin = require("./models/Admin");

mongoose.connect(process.env.MONGO_URI).then(async () => {
  // Optional: Clear existing admins to avoid "Email already exists" errors
  await Admin.deleteMany({});

  const hashed = await bcrypt.hash("admin123", 10);

  await Admin.create({
    email: "ghoshshibam@gmail.com", // Match this to what you type in the login box
    password: hashed
  });

  console.log("Admin account reset successfully!");
  process.exit();
}).catch(err => {
  console.error("Error creating admin:", err);
  process.exit(1);
});