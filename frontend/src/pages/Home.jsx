import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Users, Folder, Trash2, X } from "lucide-react";
import UserContext from "../context/UserContext";
import ProjectContext from "../context/ProjectContext";

const Home = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  const { user } = useContext(UserContext);
  const { projects, loadingProjects, fetchProjects, createProject, deleteProject } =
    useContext(ProjectContext);

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!projectName.trim()) return;

    setCreating(true);
    const project = await createProject(projectName.trim());
    setCreating(false);

    if (project) {
      setModalOpen(false);
      setProjectName("");
    }
  };

  const handleDelete = async (e, projectId) => {
    e.stopPropagation();
    await deleteProject(projectId);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 sm:mb-10"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Your Projects</h1>
          <p className="text-gray-400 mt-1 text-sm sm:text-base">
            Welcome back, {user?.username || "User"}
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors text-sm sm:text-base w-full sm:w-auto justify-center"
        >
          <Plus className="size-5" />
          New Project
        </motion.button>
      </motion.div>

      {loadingProjects ? (
        <div className="text-center py-20">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : projects.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 sm:py-20"
        >
          <Folder className="size-12 sm:size-16 mx-auto text-gray-600 mb-4" />
          <p className="text-gray-400 text-base sm:text-lg">No projects yet</p>
          <p className="text-gray-500 text-sm mt-1">
            Create your first project to get started
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
        >
          {projects.map((project, index) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02, y: -2 }}
              onClick={() => navigate("/project", { state: { project } })}
              className="group cursor-pointer rounded-xl p-4 sm:p-5 bg-white/5 border border-white/10 hover:border-emerald-500/40 hover:bg-white/10 transition-all duration-200"
            >
              <div className="flex justify-between items-start mb-3">
                <h2 className="text-base sm:text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors truncate mr-2">
                  {project.name}
                </h2>
                {project.createdBy === user?._id && (
                  <button
                    onClick={(e) => handleDelete(e, project._id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-all shrink-0"
                  >
                    <Trash2 className="size-4" />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-sm text-gray-400">
                <Users className="size-4" />
                <span>
                  {project.users?.length || 0} contributor
                  {project.users?.length !== 1 ? "s" : ""}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 border border-white/10 p-5 sm:p-6 rounded-2xl w-full max-w-md text-white"
            >
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-lg sm:text-xl font-bold">Create Project</h2>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1 rounded-lg hover:bg-white/10 transition"
                >
                  <X className="size-5" />
                </button>
              </div>

              <form onSubmit={handleCreate}>
                <label className="block mb-2 text-sm text-gray-400">
                  Project Name
                </label>
                <input
                  onChange={(e) => setProjectName(e.target.value)}
                  value={projectName}
                  type="text"
                  placeholder="e.g. AI Chatbot"
                  className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 mb-5 transition"
                  autoFocus
                />

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={creating}
                    className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 font-medium transition disabled:opacity-50"
                  >
                    {creating ? "Creating..." : "Create"}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
