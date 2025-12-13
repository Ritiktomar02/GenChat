import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../config/axios";
import toast from "react-hot-toast";

const Home = () => {
  const [ismodalopen, setmodalopen] = useState(false);
  const [projectname, setprojectname] = useState("");
  const [project, setproject] = useState([]);
  const navigate = useNavigate();

  // Create Project
  const creteProject = (e) => {
  e.preventDefault();

  // Frontend validation
  if (!projectname.trim()) {
    toast.error("Project name is required");
    return;
  }

  axios
    .post("/projects/create", { name: projectname })
    .then((res) => {
      toast.success("Project created successfully!");
      
      setmodalopen(false);
      setprojectname("");

      // Append new project to UI instantly
      setproject((prev) => [...prev, res.data]);
    })
    .catch((err) => {
      const data = err.response?.data;

      // Generic server error
      if (!data) {
        toast.error("Something went wrong");
        return;
      }

      // Express-validator errors
      if (data.errors && Array.isArray(data.errors)) {
        data.errors.forEach((error) => toast.error(error.msg));
        return;
      }

      // Duplicate name or custom backend error
      if (typeof data === "string") {
        toast.error(data);
        return;
      }

      if (data.error) {
        toast.error(data.error);
        return;
      }

      toast.error("Failed to create project");
    });
};


  // Get all projects
  useEffect(() => {
    axios
      .get("/projects/all")
      .then((res) => setproject(res.data.projects))
      .catch((err) => console.log(err));
  }, []);

  return (
    <main className="p-8 bg-linear-to-br from-[#0F172A] via-[#1E293B] to-[#334155] min-h-screen text-white relative">

      <div className="relative">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Your Projects</h1>

          <button
            onClick={() => setmodalopen(true)}
            className="px-5 py-2 bg-cyan-600 text-white rounded-lg"
          >
            + New Project
          </button>
        </div>

        {/* Project Cards */}
        <div className="flex flex-wrap gap-6">
          {project.map((project) => (
            <div
              key={project._id}
              onClick={() => navigate("/project", { state: { project } })}
              className="w-60 cursor-pointer rounded-xl p-5 bg-white/10 border border-white/20"
            >
              <h2 className="text-xl font-semibold mb-2">{project.name}</h2>
              <div className="text-sm text-gray-300">
                Contributors: {project.users.length}
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* Modal */}
      {ismodalopen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white/10 border border-white/20 p-6 rounded-xl w-full max-w-md text-white">
            <h2 className="text-2xl font-semibold mb-4">Create Project</h2>

            <form onSubmit={creteProject}>
              <label className="block mb-2 text-sm">Project Name</label>

              <input
                onChange={(e) => setprojectname(e.target.value)}
                value={projectname}
                type="text"
                placeholder="e.g. AI Chatbot"
                className="w-full px-4 py-2 rounded bg-white/10 border border-white/20 mb-4"
                required
              />

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setmodalopen(false)}
                  className="px-4 py-2 bg-gray-600 rounded"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-600 rounded"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </main>
  );
};

export default Home;
