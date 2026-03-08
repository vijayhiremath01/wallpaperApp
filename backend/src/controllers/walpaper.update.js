const mongoose = require("mongoose");
const Image = require("../models/images.model");
const { redisClient } = require("../config/redis");

async function invalidateWallpapersCache() {
  try {
    const iter = redisClient.scanIterator({ MATCH: "wallpapers:*" });
     // Optimzing --> Collect keys and delete once 
     const keysToDelete = [];
     for await (const key of iter){
      keysToDelete.push(key);
     }
     await redisClient.del(...keysToDelete);
     console.log(`Deleted ${keysToDelete.length} cache keys`);
  } catch (e) {
    console.error("Failed to invalidate wallpapers cache", e);
  }
}

const updateWallpaper = async (req, res) => {
  try {
    const { id } = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
      return res.status(400).json({
        success : false ,
        message : "Invalid wallpaper ID"
      })
    }
    const updates = {};
    if (typeof req.body.imageUrl === "string" && req.body.imageUrl.trim().length > 0) {
      updates.imageUrl = req.body.imageUrl.trim();
    }
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, message: "No valid fields to update" });
    }
    const updated = await Image.findByIdAndUpdate(id, { $set: updates }, {new : true}).lean();
    if (!updated) {
      return res.status(404).json({ success: false, message: "Wallpaper not found" });
    }
    await invalidateWallpapersCache();
    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Update failed", error: error.message });
  }
};

const deleteWallpaper = async (req, res) => {
  try {
    const { id } = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
      return res.status(400).json({
        success : false ,
        message : "Invalid ID format"
      })
    }
    const deleted = await Image.findByIdAndDelete(id).lean();
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Wallpaper not found" });
    }
    await invalidateWallpapersCache();
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Delete failed", error: error.message });
  }
};

module.exports = { updateWallpaper, deleteWallpaper };
