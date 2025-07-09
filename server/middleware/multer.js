import multer from "multer";

// Multer configuration
const storage = multer.memoryStorage();

export const upload = multer({ storage });
