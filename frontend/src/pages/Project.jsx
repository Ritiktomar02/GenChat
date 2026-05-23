import { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { UserPlus, Users, ArrowLeft, MessageSquare, Code2, Copy, Check } from "lucide-react";

import UserContext from "../context/UserContext";
import ProjectContext from "../context/ProjectContext";
import { AUTH } from "../services/api";
import { initializeSocket, disconnectSocket, receiveMessage, sendMessage } from "../services/socket";

import ChatPanel from "../components/project/ChatPanel";
import CollaboratorPanel from "../components/project/CollaboratorPanel";
import CollaboratorModal from "../components/project/CollaboratorModal";
import FileExplorer from "../components/project/FileExplorer";
import CodeEditor from "../components/project/CodeEditor";

const Project = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { user } = useContext(UserContext);
  const { addUserToProject, removeUserFromProject, updateFileTree, getProject } =
    useContext(ProjectContext);

  const [project, setProject] = useState(location.state?.project || null);
  const [allUsers, setAllUsers] = useState([]);

  // UI state
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState("chat"); // "chat" | "code"
  const [copied, setCopied] = useState(false);

  // Chat state
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [aiThinking, setAiThinking] = useState(false);
  const [aiBusy, setAiBusy] = useState(false);

  // Editor state
  const [fileTree, setFileTree] = useState({});
  const [currentFile, setCurrentFile] = useState(null);
  const [openFiles, setOpenFiles] = useState([]);

  // Redirect if no project passed
  useEffect(() => {
    if (!project?._id) {
      navigate("/");
    }
  }, [project, navigate]);

  // Initialize socket and load data
  useEffect(() => {
    if (!project?._id) return;

    initializeSocket(project._id);

    receiveMessage("project-message", (data) => {
      if (data?.sender?._id === "ai") {
        setAiThinking(false);
        try {
          const parsed = JSON.parse(data.message);
          if (parsed.fileTree) {
            setFileTree(parsed.fileTree);
          }
        } catch {
          // not JSON, ignore
        }
      }
      setMessages((prev) => [...prev, data]);
    });

    receiveMessage("ai-busy", (busy) => {
      setAiBusy(Boolean(busy));
    });

    receiveMessage("ai-error", (payload) => {
      setAiThinking(false);
      toast.error(payload?.message || "AI request failed");
    });

    getProject(project._id).then((p) => {
      if (p) {
        setProject(p);
        setFileTree(p.fileTree || {});
      }
    });

    axios
      .get(AUTH.GET_ALL_USERS)
      .then((res) => setAllUsers(res.data.users))
      .catch(() => {});

    return () => {
      disconnectSocket();
    };
  }, []);

  const send = () => {
    if (!message.trim()) return;
    if (message.includes("@ai") && (aiThinking || aiBusy)) {
      toast.error(
        aiThinking
          ? "Wait for the current AI response to finish."
          : "A collaborator is using AI right now."
      );
      return;
    }
    sendMessage("project-message", { message, sender: user });
    setMessages((prev) => [...prev, { sender: user, message }]);
    if (message.includes("@ai")) {
      setAiThinking(true);
      setAiBusy(true);
    }
    setMessage("");
  };

  const adminId =
    typeof project?.createdBy === "object"
      ? project?.createdBy?._id
      : project?.createdBy;
  const isAdmin = adminId && user?._id && adminId === user._id;

  const handleRemoveUser = async (userId) => {
    const updated = await removeUserFromProject(project._id, userId);
    if (updated) setProject(updated);
  };

  const handleAddCollaborators = async (selectedIds) => {
    if (selectedIds.length === 0) {
      toast.error("Please select at least one user");
      return;
    }

    const alreadyAdded = selectedIds.filter((id) =>
      project.users.some((u) => u._id === id)
    );
    if (alreadyAdded.length > 0) {
      toast.error("One or more users are already collaborators");
      return;
    }

    const updated = await addUserToProject(project._id, selectedIds);
    if (updated) {
      setProject(updated);
      setIsModalOpen(false);
    }
  };

  const handleFileChange = (fileName, content) => {
    const ft = {
      ...fileTree,
      [fileName]: { file: { contents: content } },
    };
    setFileTree(ft);
    updateFileTree(project._id, ft);
  };

  const handleCopyAll = () => {
    const allCode = Object.entries(fileTree)
      .map(([name, data]) => `// ===== ${name} =====\n${data?.file?.contents || ""}`)
      .join("\n\n");
    navigator.clipboard.writeText(allCode);
    setCopied(true);
    toast.success("All code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (!project?._id) return null;

  return (
    <main className="h-screen w-screen flex flex-col md:flex-row bg-[#0a0a0f] overflow-hidden">
      {/* Mobile tab bar - only visible on small screens */}
      <div className="flex md:hidden border-b border-white/5 bg-[#0f1117] shrink-0">
        <button
          onClick={() => setMobileTab("chat")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
            mobileTab === "chat"
              ? "text-emerald-400 border-b-2 border-emerald-400"
              : "text-gray-500"
          }`}
        >
          <MessageSquare className="size-4" />
          Chat
        </button>
        <button
          onClick={() => setMobileTab("code")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
            mobileTab === "code"
              ? "text-emerald-400 border-b-2 border-emerald-400"
              : "text-gray-500"
          }`}
        >
          <Code2 className="size-4" />
          Code
        </button>
      </div>

      {/* Left: Chat Panel */}
      <section
        className={`relative flex flex-col min-h-0 grow md:grow-0 w-full md:w-[340px] lg:w-[360px] xl:w-[380px] 2xl:w-[420px] shrink-0 bg-[#0f1117] md:border-r border-white/5 ${
          mobileTab !== "chat" ? "hidden md:flex" : "flex"
        }`}
      >
        {/* Chat header */}
        <div
          className={`flex items-center justify-between px-3 sm:px-4 h-12 border-b border-white/5 shrink-0 transition-all duration-300 ${
            isSidePanelOpen ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              onClick={() => navigate("/")}
              className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors shrink-0"
            >
              <ArrowLeft className="size-4" />
            </button>
            <div className="flex items-center gap-2 min-w-0">
              <MessageSquare className="size-4 text-emerald-400 shrink-0" />
              <h2 className="text-sm font-semibold text-gray-200 truncate">
                {project.name}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {isAdmin && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="p-2 rounded-lg text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                title="Add collaborator"
              >
                <UserPlus className="size-4" />
              </button>
            )}
            <button
              onClick={() => setIsSidePanelOpen(true)}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              title="View collaborators"
            >
              <Users className="size-4" />
            </button>
          </div>
        </div>

        <ChatPanel
          messages={messages}
          message={message}
          setMessage={setMessage}
          send={send}
          userId={user._id}
          aiThinking={aiThinking}
          aiBusy={aiBusy}
        />

        <CollaboratorPanel
          project={project}
          isOpen={isSidePanelOpen}
          onClose={() => setIsSidePanelOpen(false)}
          currentUserId={user?._id}
          onRemoveUser={handleRemoveUser}
        />
      </section>

      {/* Right: Editor workspace */}
      <section
        className={`grow min-h-0 flex flex-col min-w-0 ${
          mobileTab !== "code" ? "hidden md:flex" : "flex"
        }`}
      >
        {/* Toolbar */}
        <div className="flex items-center justify-between px-3 sm:px-4 h-12 bg-[#0d1117] border-b border-white/5 shrink-0">
          <span className="text-xs text-gray-500 truncate">
            {currentFile || "No file selected"}
          </span>
          <button
            onClick={handleCopyAll}
            disabled={Object.keys(fileTree).length === 0}
            className="flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors disabled:opacity-50 shrink-0"
          >
            {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
            <span className="hidden sm:inline">{copied ? "Copied!" : "Copy All Code"}</span>
          </button>
        </div>

        {/* Main editor area */}
        <div className="flex grow min-w-0 min-h-0">
          <FileExplorer
            fileTree={fileTree}
            openFiles={openFiles}
            setOpenFiles={setOpenFiles}
            setCurrentFile={setCurrentFile}
            currentFile={currentFile}
          />

          <CodeEditor
            fileTree={fileTree}
            currentFile={currentFile}
            openFiles={openFiles}
            setCurrentFile={setCurrentFile}
            setOpenFiles={setOpenFiles}
            onFileChange={handleFileChange}
          />
        </div>
      </section>

      {/* Add Collaborator Modal */}
      {isModalOpen && (
        <CollaboratorModal
          users={allUsers.filter(
            (u) =>
              u._id !== user?._id &&
              !project.users?.some((pu) => (pu._id || pu) === u._id)
          )}
          onClose={() => setIsModalOpen(false)}
          onAdd={handleAddCollaborators}
        />
      )}
    </main>
  );
};

export default Project;
