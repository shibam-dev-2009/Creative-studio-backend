const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// Configure Cloudinary with your .env credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "notes_uploads", // Name of the folder in Cloudinary
    resource_type: "auto",   // Important for PDFs and non-image files
    format: async (req, file) => 'pdf', // Force format to pdf
    public_id: (req, file) => Date.now() + "-" + file.originalname.split('.')[0],
  },
});

const upload = multer({ storage: storage });

module.exports = upload;