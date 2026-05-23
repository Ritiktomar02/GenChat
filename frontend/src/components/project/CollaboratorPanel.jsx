import { X, Users, UserMinus } from "lucide-react";
import { Avatar } from "../Navbar";

const CollaboratorPanel = ({ project, isOpen, onClose, currentUserId, onRemoveUser }) => {
  const adminId =
    typeof project?.createdBy === "object"
      ? project?.createdBy?._id
      : project?.createdBy;
  const isCurrentUserAdmin = adminId && currentUserId && adminId === currentUserId;

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
        {project?.users?.map((u, index) => {
          const isAdmin = u._id === adminId;
          const isSelf = u._id === currentUserId;
          return (
            <div
              key={`${u._id}-${index}`}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/8 transition-colors"
            >
              <Avatar user={u} size="w-9 h-9" textSize="text-sm" />
              <div className="min-w-0 grow">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-gray-200 truncate">
                    {u.username || u.email}
                    {isSelf && <span className="text-gray-500"> (You)</span>}
                  </p>
                  {isAdmin && (
                    <span className="text-[10px] uppercase tracking-wide font-semibold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                      Admin
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 truncate">{u.email}</p>
              </div>
              {isCurrentUserAdmin && !isAdmin && (
                <button
                  onClick={() => onRemoveUser?.(u._id)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors shrink-0"
                  title="Remove collaborator"
                >
                  <UserMinus className="size-4" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CollaboratorPanel;
