import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import ProjectContext from "./ProjectContext";
import { PROJECT } from "../services/api";

const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);

  const fetchProjects = async () => {
    setLoadingProjects(true);
    try {
      const res = await axios.get(PROJECT.GET_ALL);
      setProjects(res.data.projects);
    } catch {
      toast.error("Failed to load projects");
    } finally {
      setLoadingProjects(false);
    }
  };

  const createProject = async (name) => {
    try {
      const res = await axios.post(PROJECT.CREATE, { name });
      setProjects((prev) => [...prev, res.data.project]);
      toast.success("Project created successfully!");
      return res.data.project;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create project");
      return null;
    }
  };

  const deleteProject = async (projectId) => {
    try {
      await axios.delete(PROJECT.DELETE(projectId));
      setProjects((prev) => prev.filter((p) => p._id !== projectId));
      toast.success("Project deleted");
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete project");
      return false;
    }
  };

  const addUserToProject = async (projectId, userIds) => {
    try {
      const res = await axios.put(PROJECT.ADD_USER, {
        projectId,
        users: userIds,
      });
      toast.success("Collaborators added!");
      return res.data.project;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add collaborators");
      return null;
    }
  };

  const updateFileTree = async (projectId, fileTree) => {
    try {
      await axios.put(PROJECT.UPDATE_FILE_TREE, { projectId, fileTree });
    } catch (err) {
      console.error("Failed to save file tree:", err);
    }
  };

  const getProject = async (projectId) => {
    try {
      const res = await axios.get(PROJECT.GET_PROJECT(projectId));
      return res.data.project;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load project");
      return null;
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        loadingProjects,
        fetchProjects,
        createProject,
        deleteProject,
        addUserToProject,
        updateFileTree,
        getProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export default ProjectProvider;
