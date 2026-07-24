import Settings from "../models/Settings.js";

// GET /api/settings
// Uses the singleton helper, so the first call ever made auto-creates
// the default settings document.
export const getSettings = async (req, res, next) => {
  try {
    const settings = await Settings.getSingleton();
    res.json(settings);
  } catch (err) {
    next(err);
  }
};

// PUT /api/settings
export const updateSettings = async (req, res, next) => {
  try {
    const settings = await Settings.getSingleton();
    Object.assign(settings, req.body);
    await settings.save({ validateBeforeSave: true });
    res.json(settings);
  } catch (err) {
    next(err);
  }
};