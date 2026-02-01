from django.db import models
from django.contrib.auth.models import User


class Post(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posts")
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Post({self.id}) by {self.author.username}"


class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="comments")
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comments")
    content = models.TextField()

    # threaded/nested comments
    parent = models.ForeignKey(
        "self",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="replies"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment({self.id}) on Post({self.post_id})"


class PostLike(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="post_likes")
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="likes")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "post")  # prevents double-like

    def __str__(self):
        return f"{self.user.username} liked Post({self.post_id})"


class CommentLike(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comment_likes")
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE, related_name="likes")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "comment")  # prevents double-like

    def __str__(self):
        return f"{self.user.username} liked Comment({self.comment_id})"


class KarmaLog(models.Model):
    """
    This is the transaction/activity history used for last-24h leaderboard.
    We do NOT store daily karma on User directly.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="karma_logs")
    points = models.IntegerField()
    reason = models.CharField(max_length=100)  # ex: "POST_LIKE", "COMMENT_LIKE"
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Karma({self.points}) for {self.user.username}"
