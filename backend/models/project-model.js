import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    lowercase: true,
    required: true,
    trim: true,
    unique: [true, "Project name must be unique"],
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  fileTree: {
    type: Object,
    default: {},
  },
});

export default mongoose.model("Project", projectSchema);
