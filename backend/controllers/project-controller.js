import Project from "../models/project-model.js";
import mongoose from "mongoose";
import { formatFileTree } from "../utils/format-code.js";

export const createProject = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Project name is required" });
    }

    const existingProject = await Project.findOne({ name });
    if (existingProject) {
      return res.status(400).json({ message: "Project name already exists" });
    }

    const project = await Project.create({
      name,
      createdBy: req.userId,
      users: [req.userId],
    });

    res.status(201).json({ success: true, message: "Project created successfully", project });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Create project error:", error);
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllProject = async (req, res) => {
  try {
    const projects = await Project.find({ users: req.userId });

    res.status(200).json({ success: true, projects });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Get all projects error:", error);
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const addUserToProject = async (req, res) => {
  try {
    const { projectId, users } = req.body;

    if (!projectId || !users || !Array.isArray(users) || users.length === 0) {
      return res.status(400).json({ message: "Project ID and users array are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    if (users.some((id) => !mongoose.Types.ObjectId.isValid(id))) {
      return res.status(400).json({ message: "Invalid user ID in users array" });
    }

    if (users.some((u) => u.toString() === req.userId.toString())) {
      return res.status(400).json({ message: "You cannot add yourself to the project" });
    }

    const project = await Project.findOne({
      _id: projectId,
      createdBy: req.userId,
    });

    if (!project) {
      return res.status(403).json({ message: "Only the project admin can add collaborators" });
    }

    const updatedProject = await Project.findOneAndUpdate(
      { _id: projectId },
      { $addToSet: { users: { $each: users } } },
      { new: true }
    ).populate("users");

    res.status(200).json({ success: true, message: "Users added successfully", project: updatedProject });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Add user to project error:", error);
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    const project = await Project.findOne({
      _id: projectId,
      users: req.userId,
    }).populate("users");

    if (!project) {
      return res.status(400).json({ message: "Project not found or you don't belong to it" });
    }

    if (project.fileTree && Object.keys(project.fileTree).length > 0) {
      const formatted = await formatFileTree(project.fileTree);
      const original = JSON.stringify(project.fileTree);
      const next = JSON.stringify(formatted);
      if (original !== next) {
        project.fileTree = formatted;
        await Project.findByIdAndUpdate(projectId, { fileTree: formatted });
      }
    }

    res.status(200).json({ success: true, project });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Get project error:", error);
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateFileTree = async (req, res) => {
  try {
    const { projectId, fileTree } = req.body;

    if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    if (!fileTree) {
      return res.status(400).json({ message: "File tree is required" });
    }

    const project = await Project.findOneAndUpdate(
      { _id: projectId, users: req.userId },
      { fileTree },
      { new: true }
    );

    if (!project) {
      return res.status(400).json({ message: "Project not found or you don't belong to it" });
    }

    res.status(200).json({ success: true, project });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Update file tree error:", error);
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { name } = req.body;

    if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    if (!name) {
      return res.status(400).json({ message: "Project name is required" });
    }

    const nameExists = await Project.findOne({ name, _id: { $ne: projectId } });
    if (nameExists) {
      return res.status(400).json({ message: "Project name already exists" });
    }

    const project = await Project.findOneAndUpdate(
      { _id: projectId, createdBy: req.userId },
      { name },
      { new: true }
    );

    if (!project) {
      return res.status(400).json({ message: "Project not found or you are not the owner" });
    }

    res.status(200).json({ success: true, message: "Project updated successfully", project });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Update project error:", error);
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    const project = await Project.findOneAndDelete({
      _id: projectId,
      createdBy: req.userId,
    });

    if (!project) {
      return res.status(400).json({ message: "Project not found or you are not the owner" });
    }

    res.status(200).json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Delete project error:", error);
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const removeUserFromProject = async (req, res) => {
  try {
    const { projectId, userId } = req.body;

    if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const project = await Project.findOne({
      _id: projectId,
      createdBy: req.userId,
    });

    if (!project) {
      return res.status(403).json({ message: "Only the project admin can remove collaborators" });
    }

    if (project.createdBy.toString() === userId.toString()) {
      return res.status(400).json({ message: "Admin cannot be removed from the project" });
    }

    const updatedProject = await Project.findOneAndUpdate(
      { _id: projectId },
      { $pull: { users: userId } },
      { new: true }
    ).populate("users");

    res.status(200).json({ success: true, message: "User removed successfully", project: updatedProject });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Remove user from project error:", error);
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};
