const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "notes_uploads",
    // Use "auto" to let Cloudinary decide if it's an image, video, or raw file (PDF)
    resource_type: "auto", 
    public_id: (req, file) => Date.now() + "-" + file.originalname.split('.')[0],
  },
});

const upload = multer({ storage: storage });

module.exports = upload;