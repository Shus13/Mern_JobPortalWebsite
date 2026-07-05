// middlewares/uploadMiddleware.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const PHOTO_DIR = path.join(__dirname, "..", "uploads", "profile-photos");
const RESUME_DIR = path.join(__dirname, "..", "uploads", "resumes");
[PHOTO_DIR, RESUME_DIR].forEach((dir) => fs.mkdirSync(dir, { recursive: true }));

const makeStorage = (dir) =>
  multer.diskStorage({
    destination: (req, file, cb) => cb(null, dir),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${req.user.id}-${Date.now()}${ext}`);
    },
  });

const photoFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp"];
  if (!allowed.includes(file.mimetype)) {
    return cb(new Error("Only JPG, PNG, or WEBP images are allowed"));
  }
  cb(null, true);
};

const resumeFilter = (req, file, cb) => {
  const allowed = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  if (!allowed.includes(file.mimetype)) {
    return cb(new Error("Only PDF or Word documents are allowed"));
  }
  cb(null, true);
};

const uploadPhoto = multer({
  storage: makeStorage(PHOTO_DIR),
  fileFilter: photoFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

const uploadResume = multer({
  storage: makeStorage(RESUME_DIR),
  fileFilter: resumeFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

module.exports = { uploadPhoto, uploadResume };