import React, { useEffect, useState } from "react";
import { fetchLatestPost, likePost } from "./api";
import Leaderboard from "./components/Leaderboard";
import CommentTree from "./components/CommentTree";

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const load = async () => {
    setLoading(true);
    const res = await fetchLatestPost();
    setData(res);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const showMessage = (text) => {
    setMsg(text);
    setTimeout(() => setMsg(""), 1500);
  };

  // ✅ Handle "no posts found" gracefully (no white screen)
  if (!loading && data?.detail === "No posts found") {
    return (
      <div className="min-h-screen bg-[#050814] text-white flex items-center justify-center px-6">
        <div className="max-w-lg w-full rounded-3xl bg-[#0B1023] border border-white/10 p-6 text-center shadow-xl">
          <h2 className="text-xl font-bold mb-2">No Posts Found</h2>
          <p className="text-white/70 text-sm">
            Backend has no posts yet. Add demo seed data or create a post from admin.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050814] text-white">
      {/* Background Glow */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute -top-44 -left-40 h-[520px] w-[520px] rounded-full bg-indigo-600/25 blur-3xl" />
        <div className="absolute top-20 -right-44 h-[560px] w-[560px] rounded-full bg-fuchsia-600/20 blur-3xl" />
        <div className="absolute bottom-[-220px] left-1/3 h-[540px] w-[540px] rounded-full bg-cyan-500/20 blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#070B18]/80 border-b border-white/10 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">
              <span className="text-indigo-400">Pulse</span>
              <span className="text-white/90">Feed</span>
            </h1>
            <p className="text-xs text-white/60 mt-1">
              Threaded discussions • Karma • 24h Leaderboard
            </p>
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs">
            <span className="px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-400/30 text-indigo-200">
              ⚡ Post Like = +5
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-200">
              💬 Comment Like = +1
            </span>
          </div>
        </div>
      </header>

      {/* Message Toast */}
      {msg && (
        <div className="max-w-6xl mx-auto px-6 mt-4">
          <div className="rounded-2xl bg-white/10 border border-white/10 px-4 py-2 text-sm shadow">
            ✅ {msg}
          </div>
        </div>
      )}

      {/* Layout */}
      <main className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <section className="lg:col-span-2 space-y-6">
          {/* Post */}
          <div className="rounded-3xl bg-[#0B1023] border border-white/10 shadow-xl p-6">
            {loading || !data?.post ? (
              <div className="animate-pulse space-y-4">
                <div className="h-5 w-52 bg-white/10 rounded" />
                <div className="h-8 w-72 bg-white/10 rounded" />
                <div className="h-24 w-full bg-white/10 rounded-2xl" />
                <div className="h-10 w-44 bg-white/10 rounded-2xl" />
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-fuchsia-600 flex items-center justify-center font-extrabold text-lg shadow">
                      {data.post.author.username[0].toUpperCase()}
                    </div>

                    <div>
                      <p className="text-xs text-white/60">Posted by</p>
                      <p className="text-lg font-bold text-white">
                        @{data.post.author.username}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={async () => {
                      const res = await likePost(data.post.id);
                      showMessage(res.detail || "Done");
                      load();
                    }}
                    className="px-5 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 transition active:scale-95 font-semibold shadow-lg"
                  >
                    👍 Like ({data.post.like_count})
                  </button>
                </div>

                <p className="mt-5 text-white/90 leading-relaxed text-base">
                  {data.post.content}
                </p>

                <div className="mt-6 flex items-center justify-between text-xs text-white/60">
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
                    🔥 Live Karma
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
                    Post #{data.post.id}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Comments */}
          <div className="rounded-3xl bg-[#0B1023] border border-white/10 shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-extrabold text-white">
                💬 Threaded Comments
              </h2>
              <span className="text-xs text-white/60">Nested view</span>
            </div>

            {loading || !data?.comments ? (
              <div className="space-y-3 animate-pulse">
                <div className="h-20 bg-white/10 rounded-2xl" />
                <div className="h-20 bg-white/10 rounded-2xl" />
                <div className="h-20 bg-white/10 rounded-2xl" />
              </div>
            ) : data.comments.length === 0 ? (
              <p className="text-sm text-white/70">No comments yet.</p>
            ) : (
              <CommentTree
                comments={data.comments}
                onRefresh={load}
                onMessage={showMessage}
              />
            )}
          </div>
        </section>

        {/* RIGHT */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <div className="rounded-3xl bg-[#0B1023] border border-white/10 shadow-xl p-5">
              <Leaderboard />
            </div>

            <div className="rounded-3xl bg-[#0B1023] border border-white/10 shadow-xl p-5">
              <h3 className="font-bold text-white mb-2">✅ Built For Scale</h3>
              <ul className="text-sm text-white/70 space-y-2">
                <li>• Efficient comment tree fetch (No N+1)</li>
                <li>• Concurrency-safe likes</li>
                <li>• 24h leaderboard from KarmaLog</li>
              </ul>
            </div>
          </div>
        </aside>
      </main>

      <footer className="text-center text-white/40 text-xs py-6">
        PulseFeed • Community Prototype
      </footer>
    </div>
  );
}
