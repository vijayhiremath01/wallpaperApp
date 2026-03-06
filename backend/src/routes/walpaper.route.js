const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");

const {
  uploadImage,
  getWallpapers,
  downloadWallpaper
} = require("../controllers/walpaper.controller");

// Placeholder handlers for update/delete to be added
const { updateWallpaper, deleteWallpaper } = require("../controllers/walpaper.update");

// upload wallpaper
router.post("/upload", upload.single("image"), uploadImage);

// get wallpapers
router.get("/", getWallpapers);

// record download
router.post("/:id/download", downloadWallpaper);

// update wallpaper
router.patch("/:id", updateWallpaper);

// delete wallpaper
router.delete("/:id", deleteWallpaper);

module.exports = router;
