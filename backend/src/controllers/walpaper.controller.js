const Image = require("../models/images.model");
const { redisClient } = require("../config/redis");

async function invalidateWallpapersCache() {
  try {
    const keys = [];

    for await (const key of redisClient.scanIterator({
      MATCH: "wallpapers:page:*",
      COUNT: 100
    })) {
      if (typeof key === "string") {
        keys.push(key);
      }
    }

    if (keys.length === 0) return;

    await redisClient.del(...keys);

    console.log(`🧹 Deleted ${keys.length} cache keys`);
  } catch (err) {
    console.error("Failed to invalidate wallpapers cache", err);
  }
}

// Upload wallpaper
const uploadImage = async (req, res) => {
  try {
    const imageKit = require("../config/imageKit");

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
    await invalidateWallpapersCache();

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

    const cacheKey = `wallpapers:page:${page}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      return res.status(200).json(parsed);
    }

    const wallpapers = await Image.find()
      .sort({ createdAt: -1 })
      .select("imageUrl downloads createdAt")
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Image.countDocuments();

    const payload = {
      success: true,
      page,
      limit,
      total,
      data: wallpapers
    };
    await redisClient.set(cacheKey, JSON.stringify(payload), {
      EX: 300
    });
    res.status(200).json(payload);

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
      { returnDocument: "after" }
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
