import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system',
    },
    defaultView: {
      type: String,
      enum: ['dashboard', 'calendar', 'projects', 'settings'],
      default: 'dashboard',
    },
    weekStartsOn: {
      type: String,
      enum: ['sunday', 'monday'],
      default: 'monday',
    },
    workingHours: {
      start: { type: String, default: '09:00' }, // 24h "HH:mm" format
      end: { type: String, default: '17:00' },
    },
  },
  {
    timestamps: true,
  }
);

// Since this is a single-user local app, there is only ever one Settings
// document. This static method fetches it, or creates it with defaults
// on first run — so callers never have to worry about a missing doc.
settingsSchema.statics.getSingleton = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

const Settings = mongoose.model("Settings", settingsSchema)

export default Settings