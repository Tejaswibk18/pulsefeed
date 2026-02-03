const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export async function fetchPostWithComments(postId) {
  const res = await fetch(`${BASE_URL}/posts/${postId}/`);
  return res.json();
}

export async function likePost(postId) {
  const res = await fetch(`${BASE_URL}/posts/${postId}/like/`, {
    method: "POST",
  });
  return res.json();
}

export async function likeComment(commentId) {
  const res = await fetch(`${BASE_URL}/comments/${commentId}/like/`, {
    method: "POST",
  });
  return res.json();
}

export async function fetchLeaderboard() {
  const res = await fetch(`${BASE_URL}/leaderboard/`);
  return res.json();
}
