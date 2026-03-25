import { useState } from "react";
import { FileCode2, FolderOpen, ChevronLeft, ChevronRight } from "lucide-react";

const getFileIcon = (fileName) => {
  const ext = fileName.split(".").pop();
  const colors = {
    js: "text-yellow-400",
    jsx: "text-cyan-400",
    ts: "text-blue-400",
    tsx: "text-blue-400",
    json: "text-yellow-300",
    css: "text-pink-400",
    html: "text-orange-400",
    md: "text-gray-400",
  };
  return colors[ext] || "text-gray-400";
};

const FileExplorer = ({ fileTree, openFiles, setOpenFiles, setCurrentFile, currentFile }) => {
  const [collapsed, setCollapsed] = useState(false);

  const openFile = (file) => {
    setCurrentFile(file);
    setOpenFiles([...new Set([...openFiles, file])]);
    // Auto-collapse on mobile after selecting
    if (window.innerWidth < 768) setCollapsed(true);
  };

  const files = Object.keys(fileTree);

  return (
    <div
      className={`flex flex-col h-full shrink-0 bg-[#0d1117] border-r border-white/5 transition-all duration-200 ${
        collapsed ? "w-10" : "w-44 sm:w-48 md:w-52 xl:w-56 2xl:w-60"
      }`}
    >
      <div className="flex items-center justify-between px-2 sm:px-3 h-10 border-b border-white/5 shrink-0">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <FolderOpen className="size-3.5 text-emerald-400" />
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Explorer</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded hover:bg-white/10 text-gray-500 hover:text-gray-300 transition-colors ml-auto"
        >
          {collapsed ? <ChevronRight className="size-3.5" /> : <ChevronLeft className="size-3.5" />}
        </button>
      </div>

      {!collapsed && (
        <div className="overflow-y-auto grow py-1">
          {files.length === 0 ? (
            <p className="text-gray-600 text-xs px-3 py-6 text-center">No files yet</p>
          ) : (
            files.map((file) => (
              <button
                key={file}
                onClick={() => openFile(file)}
                className={`w-full flex items-center gap-2 px-3 py-1.5 text-left transition-colors ${
                  currentFile === file
                    ? "bg-emerald-500/10 text-emerald-300"
                    : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
                }`}
              >
                <FileCode2 className={`size-3.5 shrink-0 ${getFileIcon(file)}`} />
                <span className="text-[13px] truncate">{file}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default FileExplorer;
