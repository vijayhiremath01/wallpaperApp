const imageKit = require("../config/imageKit");
const Image = require("../models/images.model");


// Upload wallpaper
const uploadImage = async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded"
      });
    }

    const file = req.file;

    const uploadResponse = await imageKit.upload({
      file: file.buffer.toString("base64"),
      fileName: file.originalname,
      folder: "/wallpapers"
    });

    const newImage = await Image.create({
      imageUrl: uploadResponse.url
    });

    res.status(201).json({
      success: true,
      message: "Image uploaded successfully",
      data: newImage
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Image upload failed",
      error: error.message
    });

  }
};


// Get wallpapers (with pagination)
const getWallpapers = async (req, res) => {
  try {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const skip = (page - 1) * limit;

    const wallpapers = await Image.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Image.countDocuments();

    res.status(200).json({
      success: true,
      page,
      limit,
      total,
      data: wallpapers
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to fetch wallpapers",
      error: error.message
    });

  }
};


// Record download
const downloadWallpaper = async (req, res) => {
  try {

    const { id } = req.params;

    const wallpaper = await Image.findByIdAndUpdate(
      id,
      { $inc: { downloads: 1 } },
      { new: true }
    );

    if (!wallpaper) {
      return res.status(404).json({
        success: false,
        message: "Wallpaper not found"
      });
    }

    res.status(200).json({
      success: true,
      imageUrl: wallpaper.imageUrl
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Download tracking failed",
      error: error.message
    });

  }
};

module.exports = {
  uploadImage,
  getWallpapers,
  downloadWallpaper
};