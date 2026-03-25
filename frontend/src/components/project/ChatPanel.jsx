import React, { useRef, useEffect } from "react";
import Markdown from "markdown-to-jsx";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import { Send, Bot, Sparkles } from "lucide-react";
import { Avatar } from "../Navbar";

function SyntaxHighlightedCode(props) {
  const ref = useRef(null);

  React.useEffect(() => {
    if (ref.current && props.className?.includes("lang-") && hljs) {
      hljs.highlightElement(ref.current);
      ref.current.removeAttribute("data-highlighted");
    }
  }, [props.className, props.children]);

  return <code {...props} ref={ref} />;
}

function renderAiMessage(rawMessage) {
  try {
    const parsed = JSON.parse(rawMessage);
    const text = parsed.text || JSON.stringify(parsed, null, 2);
    return (
      <div className="overflow-auto rounded-lg bg-[#0d1117] text-gray-200 p-2.5 sm:p-3 text-[12px] sm:text-[13px] leading-relaxed border border-white/5">
        <Markdown
          options={{ overrides: { code: SyntaxHighlightedCode } }}
        >
          {text}
        </Markdown>
      </div>
    );
  } catch {
    return <p className="text-gray-200">{rawMessage || "No response from AI"}</p>;
  }
}

const ChatPanel = ({ messages, message, setMessage, send, userId, aiThinking }) => {
  const messageBoxRef = useRef(null);

  useEffect(() => {
    if (messageBoxRef.current) {
      messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col grow overflow-hidden">
      <div
        ref={messageBoxRef}
        className="grow flex flex-col gap-2.5 sm:gap-3 overflow-y-auto p-3 sm:p-4"
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center grow text-center gap-3 py-10">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Sparkles className="size-5 sm:size-6 text-emerald-400" />
            </div>
            <p className="text-gray-500 text-xs sm:text-sm px-4">
              Start a conversation or type <span className="text-emerald-400 font-medium">@ai</span> to ask AI
            </p>
          </div>
        )}

        {messages.map((msg, index) => {
          if (!msg?.sender) return null;
          const senderId = msg.sender._id;
          const isMe = senderId === userId;
          const isAi = senderId === "ai";

          return (
            <div
              key={index}
              className={`flex gap-2 sm:gap-2.5 ${isMe ? "flex-row-reverse" : "flex-row"}`}
            >
              {isAi ? (
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-linear-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="size-3.5 sm:size-4 text-white" />
                </div>
              ) : (
                <div className="mt-0.5">
                  <Avatar user={msg.sender} size="w-6 h-6 sm:w-7 sm:h-7" textSize="text-[10px] sm:text-xs" />
                </div>
              )}

              <div
                className={`flex flex-col gap-0.5 sm:gap-1 ${isAi ? "max-w-[90%] sm:max-w-[85%]" : "max-w-[75%] sm:max-w-[70%]"}`}
              >
                <span className={`text-[10px] sm:text-[11px] font-medium ${isMe ? "text-right" : "text-left"} ${isAi ? "text-emerald-400" : "text-gray-500"}`}>
                  {isAi ? "AI Assistant" : (msg.sender.username || msg.sender.email || "Unknown")}
                </span>
                <div
                  className={`rounded-xl px-3 py-2 sm:px-3.5 sm:py-2.5 text-[13px] sm:text-sm leading-relaxed ${
                    isAi
                      ? "bg-emerald-500/5 border border-emerald-500/10"
                      : isMe
                      ? "bg-emerald-600 text-white"
                      : "bg-white/5 border border-white/10 text-gray-200"
                  }`}
                >
                  {isAi ? renderAiMessage(msg.message) : <p>{msg.message}</p>}
                </div>
              </div>
            </div>
          );
        })}

        {aiThinking && (
          <div className="flex gap-2 sm:gap-2.5">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-linear-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shrink-0 mt-0.5">
              <Bot className="size-3.5 sm:size-4 text-white" />
            </div>
            <div className="flex flex-col gap-0.5 sm:gap-1">
              <span className="text-[10px] sm:text-[11px] font-medium text-emerald-400">AI Assistant</span>
              <div className="rounded-xl px-4 py-3 bg-emerald-500/5 border border-emerald-500/10">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-2.5 sm:p-3 border-t border-white/5">
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl focus-within:border-emerald-500/50 transition-colors">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            className="grow px-3 sm:px-4 py-2.5 sm:py-3 bg-transparent text-sm text-gray-200 placeholder-gray-500 outline-none min-w-0"
            type="text"
            placeholder="Type a message... use @ai for AI"
          />
          <button
            onClick={send}
            disabled={!message.trim()}
            className="mr-1.5 p-2 sm:p-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors disabled:opacity-30 disabled:hover:bg-emerald-600 shrink-0"
          >
            <Send className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
