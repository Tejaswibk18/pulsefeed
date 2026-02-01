import React, { useEffect, useState } from "react";
import { fetchLeaderboard } from "../api";

export default function Leaderboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchLeaderboard().then(setUsers);
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-extrabold text-white">🏆 Leaderboard</h2>
        <span className="text-xs text-white/60">Last 24h</span>
      </div>

      {users.length === 0 ? (
        <p className="text-sm text-white/70">No karma activity yet.</p>
      ) : (
        <div className="space-y-2">
          {users.map((u, idx) => (
            <div
              key={u["user__id"]}
              className="flex items-center justify-between rounded-2xl bg-[#10183A] border border-white/10 px-3 py-3 hover:border-indigo-400/40 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center font-extrabold shadow">
                  {idx + 1}
                </div>

                <div>
                  <p className="text-sm font-bold text-white">
                    @{u["user__username"]}
                  </p>
                  <p className="text-xs text-white/60">Top contributor</p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-extrabold text-indigo-300">{u.total_karma}</p>
                <p className="text-xs text-white/60">karma</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
