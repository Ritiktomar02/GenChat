import { useState } from "react";
import { X, UserPlus, Check } from "lucide-react";
import { Avatar } from "../Navbar";
import { motion, AnimatePresence } from "framer-motion";

const CollaboratorModal = ({ users, onClose, onAdd }) => {
  const [selectedIds, setSelectedIds] = useState([]);

  const toggle = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id]
    );
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="relative bg-[#111827] border border-white/10 text-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md max-h-[80vh] sm:max-h-[70vh] flex flex-col overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/5">
            <div className="flex items-center gap-2">
              <UserPlus className="size-5 text-emerald-400" />
              <h2 className="text-base sm:text-lg font-semibold">Add Collaborators</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="overflow-y-auto grow p-3 sm:p-4">
            {users.length === 0 ? (
              <p className="text-gray-500 text-sm py-8 text-center">
                No other users found
              </p>
            ) : (
              <div className="space-y-2">
                {users.map((u) => {
                  const isSelected = selectedIds.includes(u._id);
                  return (
                    <button
                      key={u._id}
                      onClick={() => toggle(u._id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                        isSelected
                          ? "bg-emerald-500/10 border border-emerald-500/30 ring-1 ring-emerald-500/20"
                          : "bg-white/5 border border-transparent hover:bg-white/8"
                      }`}
                    >
                      <Avatar user={u} />
                      <span className="text-sm font-medium truncate grow text-left text-gray-200">
                        {u.username || u.email}
                      </span>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                          <Check className="size-3 text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-t border-white/5 bg-white/2">
            <span className="text-sm text-gray-500">
              {selectedIds.length} selected
            </span>
            <button
              onClick={() => { onAdd(selectedIds); setSelectedIds([]); }}
              disabled={selectedIds.length === 0}
              className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-emerald-600"
            >
              Add Collaborators
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CollaboratorModal;
