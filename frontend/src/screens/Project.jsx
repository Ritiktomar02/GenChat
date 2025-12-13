import React, { useState, useEffect, useContext } from "react";
import axios from "../config/axios";
import UserContext from "../context/user.context";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";

const Project = () => {
  const location = useLocation();

  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedUserId, setSelectedUserId] = useState([]); 

  const [project, setProject] = useState(location.state.project);
  const [message, setMessage] = useState("");

  const { user } = useContext(UserContext);
  const [users, setUsers] = useState([]);

  function addCollaborators() {
    if (selectedUserId.length === 0) {
      toast.error("Please select at least one user");
      return;
    }

    const alreadyAdded = selectedUserId.filter((id) =>
      project.users.some((u) => u._id === id)
    );

    if (alreadyAdded.length > 0) {
      toast.error("❌ You have already added this user!");
      return;
    }

    axios
      .put("/projects/add-user", {
        projectId: project._id,
        users: selectedUserId,
      })
      .then((res) => {
        toast.success("Collaborators added!");

        setProject(res.data.project); 
        setIsModalOpen(false);
        setSelectedUserId([]);
      })
      .catch((err) => {
        toast.error(err.response?.data?.error || "Something went wrong");
        console.log(err);
      });
  }

  useEffect(() => {
    axios
      .get(`/projects/get-project/${location.state.project._id}`)
      .then((res) => {
        setProject(res.data.project);
      });

    axios
      .get("/users/all")
      .then((res) => setUsers(res.data.users))
      .catch((err) => console.log(err));
  }, []);

  function toggleUser(id) {
    if (selectedUserId.includes(id)) {
      setSelectedUserId(selectedUserId.filter((u) => u !== id));
    } else {
      setSelectedUserId([...selectedUserId, id]);
    }
  }

  return (
    <main className="h-screen w-screen flex bg-linear-to-br from-[#0F172A] via-[#1E293B] to-[#334155]">
      
      <section className="left relative flex flex-col h-screen min-w-96 bg-slate-300">
 
        <header
          className={`flex justify-between items-center p-2 px-4 w-full bg-slate-100 absolute top-0 
  transition-all duration-300
  ${isSidePanelOpen ? "z-0 opacity-0" : "z-10 opacity-100"}`}
        >
          <button className="flex gap-2" onClick={() => setIsModalOpen(true)}>
            <i className="ri-add-fill mr-1"></i>
            <p>Add collaborator</p>
          </button>

          <button onClick={() => setIsSidePanelOpen(true)} className="p-2">
            <i className="ri-group-fill"></i>
          </button>
        </header>

        <div className="conversation-area pt-14 pb-10 grow flex flex-col h-full relative">
          <div className="inputField w-full flex absolute bottom-0">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="p-2 px-4 border-none outline-none grow"
              type="text"
              placeholder="Enter message"
            />
            <button className="px-5 bg-slate-950 text-white">
              <i className="ri-send-plane-fill"></i>
            </button>
          </div>
        </div>

        <div
          className={`sidePanel w-full h-full flex flex-col gap-2 
  absolute top-0 transition-all duration-300 shadow-xl
  ${isSidePanelOpen ? "translate-x-0" : "-translate-x-full"}
  bg-linear-to-b from-slate-100 via-slate-200 to-slate-300`}
        >
          <header
            className="flex justify-between items-center px-4 p-3 
      bg-slate-200"
          >
            <h1 className="font-semibold text-lg tracking-wide">
              Collaborators
            </h1>

            <button
              onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
              className="p-2 hover:bg-white/20 rounded-full"
            >
              <i className="ri-close-fill text-xl"></i>
            </button>
          </header>

          <div className="users flex flex-col gap-2 p-2 overflow-auto">
            {project.users &&
              project.users.map((u) => (
                <div
                  key={u._id}
                  className="user cursor-pointer hover:bg-slate-200 p-3 rounded-lg flex gap-3 items-center bg-white shadow-sm"
                >
                  <div className="w-10 h-10 rounded-full bg-slate-600 flex justify-center items-center text-white">
                    <i className="ri-user-fill text-lg"></i>
                  </div>
                  <h1 className="font-semibold text-lg text-slate-800">
                    {u.email}
                  </h1>
                </div>
              ))}
          </div>
        </div>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative bg-[#111] border border-white/10 text-white rounded-2xl w-104 max-w-full max-h-120 overflow-y-auto p-6">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 p-2 rounded-full bg-white/10"
            >
              <i className="ri-close-line text-xl"></i>
            </button>

            <h2 className="text-xl font-bold text-cyan-300 mb-4 border-b border-cyan-500/30 pb-2">
              👥 Select Collaborators
            </h2>

            <ul className="space-y-3">
              {users.map((u) => {
                const isSelected = selectedUserId.includes(u._id);
                return (
                  <li
                    key={u._id}
                    onClick={() => toggleUser(u._id)}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer ${
                      isSelected
                        ? "bg-cyan-700/50 border border-cyan-300/30"
                        : "bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <div className="h-8 w-8 bg-cyan-600 flex justify-center items-center rounded-full text-white">
                      <i className="ri-user-fill"></i>
                    </div>
                    <span className="text-base font-medium">{u.email}</span>
                  </li>
                );
              })}
            </ul>

            <div className="flex justify-end mt-6">
              <button
                onClick={addCollaborators}
                className="px-6 py-2 rounded-xl bg-cyan-600 text-white font-bold"
              >
                Add Collaborators
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Project;
