import { X, Users } from "lucide-react";
import { Avatar } from "../Navbar";

const CollaboratorPanel = ({ project, isOpen, onClose }) => {
  return (
    <div
      className={`absolute inset-0 z-20 flex flex-col transition-all duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        bg-[#0a0a0f]/98 backdrop-blur-xl`}
    >
      <header className="flex justify-between items-center px-5 py-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Users className="size-4 text-emerald-400" />
          <h2 className="font-semibold text-white">Collaborators</h2>
          <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">
            {project?.users?.length || 0}
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
        >
          <X className="size-4" />
        </button>
      </header>

      <div className="flex flex-col gap-1.5 p-3 overflow-auto grow">
        {project?.users?.map((u, index) => (
          <div
            key={`${u._id}-${index}`}
            className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/8 transition-colors"
          >
            <Avatar user={u} size="w-9 h-9" textSize="text-sm" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-200 truncate">
                {u.username || u.email}
              </p>
              <p className="text-xs text-gray-500 truncate">{u.email}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CollaboratorPanel;
