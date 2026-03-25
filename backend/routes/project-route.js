import { Router } from "express";
import {
  createProject,
  getAllProject,
  addUserToProject,
  getProjectById,
  updateFileTree,
  updateProject,
  deleteProject,
  removeUserFromProject,
} from "../controllers/project-controller.js";
import { isUser } from "../middlewares/auth-middleware.js";

const router = Router();

router.post("/create", isUser, createProject);
router.get("/all", isUser, getAllProject);
router.get("/get-project/:projectId", isUser, getProjectById);
router.put("/update/:projectId", isUser, updateProject);
router.delete("/delete/:projectId", isUser, deleteProject);
router.put("/add-user", isUser, addUserToProject);
router.put("/remove-user", isUser, removeUserFromProject);
router.put("/update-file-tree", isUser, updateFileTree);

export default router;
