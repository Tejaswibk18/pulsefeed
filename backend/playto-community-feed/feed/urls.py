from django.urls import path
from .views import PostDetailWithCommentsAPI, LikePostAPI, LikeCommentAPI
from .views import LeaderboardAPI


urlpatterns = [
    path("posts/<int:post_id>/", PostDetailWithCommentsAPI.as_view()),
    path("posts/<int:post_id>/like/", LikePostAPI.as_view()),
    path("comments/<int:comment_id>/like/", LikeCommentAPI.as_view()),
    path("leaderboard/", LeaderboardAPI.as_view()),
]
