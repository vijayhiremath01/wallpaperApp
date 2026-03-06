const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");

const {
  uploadImage,
  getWallpapers,
  downloadWallpaper
} = require("../controllers/walpaper.controller");


// upload wallpaper
router.post("/upload", upload.single("image"), uploadImage);

// get wallpapers
router.get("/", getWallpapers);

// record download
router.post("/:id/download", downloadWallpaper);

module.exports = router;