import { useRef, useEffect, useState } from "react";
import { X, FileCode2, Copy, Check } from "lucide-react";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import toast from "react-hot-toast";

const CodeEditor = ({
  fileTree,
  currentFile,
  openFiles,
  setCurrentFile,
  setOpenFiles,
  onFileChange,
}) => {
  const codeRef = useRef(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!codeRef.current) return;
    codeRef.current.removeAttribute("data-highlighted");
    hljs.highlightElement(codeRef.current);
  }, [currentFile]);

  const closeFile = (e, file) => {
    e.stopPropagation();
    const remaining = openFiles.filter((f) => f !== file);
    setOpenFiles(remaining);
    if (currentFile === file) {
      setCurrentFile(remaining[0] || null);
    }
  };

  const copyCurrentFile = () => {
    const content = fileTree[currentFile]?.file?.contents;
    if (content) {
      navigator.clipboard.writeText(content);
      setCopied(true);
      toast.success(`${currentFile} copied!`);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const fileContent = currentFile && fileTree[currentFile]?.file?.contents;

  return (
    <div className="flex flex-col grow h-full min-w-0">
      {/* Tab bar */}
      <div className="flex items-center h-10 bg-[#0d1117] border-b border-white/5 shrink-0">
        <div className="flex overflow-x-auto grow">
          {openFiles.map((file) => (
            <button
              key={file}
              className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 h-10 text-[12px] sm:text-[13px] whitespace-nowrap border-r border-white/5 transition-colors shrink-0 ${
                currentFile === file
                  ? "bg-[#161b22] text-gray-200 border-b-2 border-b-emerald-500"
                  : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
              }`}
              onClick={() => setCurrentFile(file)}
            >
              <FileCode2 className="size-3 sm:size-3.5 shrink-0" />
              <span className="max-w-[80px] sm:max-w-none truncate">{file}</span>
              <span
                onClick={(e) => closeFile(e, file)}
                className="ml-0.5 p-0.5 rounded hover:bg-white/10 hover:text-red-400 transition-colors"
              >
                <X className="size-3" />
              </span>
            </button>
          ))}
        </div>

        {currentFile && (
          <button
            onClick={copyCurrentFile}
            className="p-2 mr-1 text-gray-500 hover:text-emerald-400 hover:bg-white/5 rounded transition-colors shrink-0"
            title="Copy file"
          >
            {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          </button>
        )}
      </div>

      {/* Editor area */}
      <div className="grow overflow-auto bg-[#0d1117] min-w-0">
        {fileContent !== undefined ? (
          <pre className="hljs h-full m-0 p-0 whitespace-pre-wrap break-words">
            <code
              ref={codeRef}
              className="language-javascript outline-none block p-3 sm:p-4 text-[12px] sm:text-[13px] leading-5 sm:leading-6 min-h-full whitespace-pre-wrap break-words"
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => onFileChange(currentFile, e.target.innerText)}
            >
              {fileContent}
            </code>
          </pre>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-3 px-4">
            <FileCode2 className="size-8 sm:size-10 text-gray-700" />
            <p className="text-gray-600 text-xs sm:text-sm text-center">Select a file to start editing</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeEditor;
