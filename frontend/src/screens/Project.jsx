import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "../config/axios";
import UserContext from "../context/user.context";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { getWebContainer } from "../config/webContainer";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import Markdown from "markdown-to-jsx";
import {
  initializeSocket,
  receiveMessage,
  sendMessage,
} from "../config/socket";

function SyntaxHighlightedCode(props) {
  const ref = useRef(null);

  React.useEffect(() => {
    if (ref.current && props.className?.includes("lang-") && window.hljs) {
      window.hljs.highlightElement(ref.current);

      // hljs won't reprocess the element unless this attribute is removed
      ref.current.removeAttribute("data-highlighted");
    }
  }, [props.className, props.children]);

  return <code {...props} ref={ref} />;
}

const Project = () => {
  const location = useLocation();

  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedUserId, setSelectedUserId] = useState([]);

  const [project, setProject] = useState(location.state?.project || null);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messageBox = React.createRef();
  const codeRef = useRef(null);

  const { user } = useContext(UserContext);
  const [users, setUsers] = useState([]);

  const [fileTree, setFileTree] = useState({});

  const [currentFile, setCurrentFile] = useState(null);
  const [openFiles, setOpenFiles] = useState([]);

  const [webContainer, setWebContainer] = useState(null);
  const [iframeUrl, setIframeUrl] = useState(null);

  const [runProcess, setRunProcess] = useState(null);

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

  const send = () => {
    sendMessage("project-message", {
      message,
      sender: user,
    });
    setMessages((prevMessages) => [...prevMessages, { sender: user, message }]);
    setMessage("");
  };

  function WriteAiMessage(message) {
    const messageObject = JSON.parse(message);

    return (
      <div className="overflow-auto bg-slate-950 text-white rounded-sm p-2">
        <Markdown
          children={messageObject.text}
          options={{
            overrides: {
              code: SyntaxHighlightedCode,
            },
          }}
        />
      </div>
    );
  }

  useEffect(() => {
    if (!project?._id) return;
    initializeSocket(project?._id);

    if (!webContainer) {
      getWebContainer().then((container) => {
        setWebContainer(container);
        
      });
    }

    receiveMessage("project-message", (data) => {
      if (data.sender._id == "ai") {
        const message = JSON.parse(data.message);

        webContainer?.mount(message.fileTree);

        if (message.fileTree) {
          setFileTree(message.fileTree || {});
        }
        setMessages((prevMessages) => [...prevMessages, data]);
      } else {
        setMessages((prevMessages) => [...prevMessages, data]);
      }
    });
    axios.get(`/projects/get-project/${project._id}`).then((res) => {
      setProject(res.data.project);
      setFileTree(res.data.project.fileTree || {});
    });

    axios
      .get("/users/all")
      .then((res) => setUsers(res.data.users))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (!codeRef.current) return;

    // Clear previous highlighting
    codeRef.current.removeAttribute("data-highlighted");

    hljs.highlightElement(codeRef.current);
  }, [currentFile]);

  function toggleUser(id) {
    if (selectedUserId.includes(id)) {
      setSelectedUserId(selectedUserId.filter((u) => u !== id));
    } else {
      setSelectedUserId([...selectedUserId, id]);
    }
  }

  function saveFileTree(ft) {
    axios
      .put("/projects/update-file-tree", {
        projectId: project._id,
        fileTree: ft,
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <main className="h-screen w-screen flex ">
      <section className="left relative flex flex-col h-screen min-w-96 bg-slate-300">
        <header
          className={`flex justify-between items-center p-2 px-4 w-full bg-slate-100 z-10 
  transition-all duration-300
  ${isSidePanelOpen ? "z-0 opacity-0" : "z-10 opacity-100"}`}
        >
          <button className="flex gap-2" onClick={() => setIsModalOpen(true)}>
            <i className="ri-add-fill mr-1"></i>
            <p>Add collaborator</p>
          </button>

          <button
            onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
            className="p-2"
          >
            <i className="ri-group-fill"></i>
          </button>
        </header>

        <div className="conversation-area grow flex flex-col overflow-hidden">
          <div
            ref={messageBox}
            className="message-box p-3 grow flex flex-col gap-2 overflow-y-auto"
          >
            {messages.map((msg, index) => {
              const isMe = msg.sender._id === user._id;

              return (
                <div
                  key={index}
                  className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`${
                      msg.sender._id === "ai" ? "max-w-80" : "max-w-52"
                    } message flex flex-col p-2 bg-slate-50 w-fit rounded-md`}
                  >
                    <small className="opacity-65 text-xs">
                      {msg.sender.email}
                    </small>
                    <div className="text-sm">
                      {msg.sender._id === "ai" ? (
                        WriteAiMessage(msg.message)
                      ) : (
                        <p>{msg.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="inputField w-full flex border-t bg-white">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="p-2 px-4 border-none outline-none grow bg-white"
              type="text"
              placeholder="Enter message"
            />
            <button onClick={send} className="px-9 bg-cyan-600 text-white">
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
            {project?.users &&
              project?.users.map((u, index) => (
                <div
                  key={`${u._id}-${index}`}
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

      <section className="right  bg-red-50 grow h-full flex">
        <div className="explorer h-full max-w-64 min-w-52 bg-slate-200">
          <div className="file-tree w-full">
            {Object.keys(fileTree).map((file, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentFile(file);
                  setOpenFiles([...new Set([...openFiles, file])]);
                }}
                className="tree-element cursor-pointer p-2 px-4 flex items-center gap-2 bg-slate-300 w-full"
              >
                <p className="font-semibold text-lg">{file}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="code-editor flex flex-col grow h-full shrink">
          <div className="top flex justify-between w-full">
            <div className="files flex">
              {openFiles.map((file) => (
                <div
                  key={file}
                  className={`flex items-center gap-2 px-3 py-2 cursor-pointer
      ${currentFile === file ? "bg-slate-400" : "bg-slate-300"}
    `}
                  onClick={() => setCurrentFile(file)}
                >
                  <span className="font-semibold">{file}</span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();

                      setOpenFiles((prev) => prev.filter((f) => f !== file));

                      if (currentFile === file) {
                        const remaining = openFiles.filter((f) => f !== file);
                        setCurrentFile(remaining[0] || null);
                      }
                    }}
                    className="text-xs px-1 rounded hover:bg-red-500 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div className="actions flex gap-2">
              <button
                onClick={async () => {
                  await webContainer.mount(fileTree);

                  const installProcess = await webContainer.spawn("npm", [
                    "install",
                  ]);

                  installProcess.output.pipeTo(
                    new WritableStream({
                      write(chunk) {
                        console.log(chunk);
                      },
                    })
                  );

                  if (runProcess) {
                    runProcess.kill();
                  }

                  let tempRunProcess = await webContainer.spawn("npm", [
                    "start",
                  ]);

                  tempRunProcess.output.pipeTo(
                    new WritableStream({
                      write(chunk) {
                        console.log(chunk);
                      },
                    })
                  );

                  setRunProcess(tempRunProcess);

                  webContainer.on("server-ready", (port, url) => {
                    console.log(port, url);
                    setIframeUrl(url);
                  });
                }}
                className="p-2 px-4 bg-slate-300 text-white hover:bg-slate-800"
              >
                run
              </button>
            </div>
          </div>
          <div className="bottom flex grow max-w-full shrink overflow-auto">
            {fileTree[currentFile] && (
              <div className="code-editor-area h-full overflow-auto grow bg-slate-50">
                <pre className="hljs h-full">
                  <code
                    ref={codeRef}
                    className="language-javascript outline-none"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => {
                      const updatedContent = e.target.innerText;
                      const ft = {
                        ...fileTree,
                        [currentFile]: {
                          file: {
                            contents: updatedContent,
                          },
                        },
                      };
                      setFileTree(ft);
                      saveFileTree(ft);
                    }}
                  >
                    {fileTree[currentFile].file.contents}
                  </code>
                </pre>
              </div>
            )}
          </div>
        </div>

        {iframeUrl && webContainer && (
          <div className="flex min-w-96 flex-col h-full">
            <div className="address-bar">
              <input
                type="text"
                onChange={(e) => setIframeUrl(e.target.value)}
                value={iframeUrl}
                className="w-full p-2 px-4 bg-slate-200"
              />
            </div>
            <iframe src={iframeUrl} className="w-full h-full"></iframe>
          </div>
        )}
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
