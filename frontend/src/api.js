const BASE_URL = "https://pulsefeed-1-rco2.onrender.com/api";

export async function fetchLatestPost() {
  const res = await fetch(`${BASE_URL}/posts/latest/`);
  return res.json();
}

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
