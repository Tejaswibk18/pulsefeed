import React from "react";
import { likeComment } from "../api";

export default function CommentTree({
  comments = [],
  level = 0,
  onRefresh,
  onMessage,
}) {
  return (
    <div className="space-y-3">
      {comments.map((c) => (
        <div
          key={c.id}
          className="rounded-3xl bg-[#10183A] border border-white/10 p-4 hover:border-indigo-400/40 transition"
          style={{ marginLeft: level * 14 }}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center font-extrabold shadow">
                {c.author.username[0].toUpperCase()}
              </div>

              <div>
                <p className="text-sm font-bold text-white">
                  @{c.author.username}
                </p>
                <p className="text-xs text-white/60">
                  {new Date(c.created_at).toLocaleString()}
                </p>
              </div>
            </div>

            <button
              onClick={async () => {
                const res = await likeComment(c.id);
                if (onMessage) onMessage(res.detail || "Done");
                onRefresh();
              }}
              className="px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 transition active:scale-95 text-sm font-semibold shadow-lg"
            >
              👍 {c.like_count}
            </button>
          </div>

          <p className="mt-3 text-white/90 leading-relaxed">{c.content}</p>

          {c.replies && c.replies.length > 0 && (
            <div className="mt-4 pl-3 border-l border-white/10">
              <CommentTree
                comments={c.replies}
                level={level + 1}
                onRefresh={onRefresh}
                onMessage={onMessage}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
