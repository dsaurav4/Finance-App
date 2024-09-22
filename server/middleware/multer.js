import multer from "multer";

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./public/temp");
  },

  filename: function (req, file, cb) {
    return cb(null, file.originalname);
  },
});

export const upload = multer({ storage });
