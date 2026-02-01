from django.db.models import Count
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction, IntegrityError
from django.utils import timezone

from .models import Post, Comment
from .serializers import PostSerializer, RecursiveCommentSerializer


from django.db.models import Sum
from django.utils import timezone
from datetime import timedelta



def build_comment_tree(comments):
    """
    Build nested comments in Python using parent_id mapping.
    This avoids recursive DB calls (N+1).
    """
    by_id = {}
    roots = []

    # init nodes
    for c in comments:
        c.prefetched_replies = []
        by_id[c.id] = c

    # link children to parents
    for c in comments:
        if c.parent_id:
            parent = by_id.get(c.parent_id)
            if parent:
                parent.prefetched_replies.append(c)
        else:
            roots.append(c)

    return roots


class PostDetailWithCommentsAPI(APIView):
    """
    GET /api/posts/<id>/
    Returns post + comment tree in efficient way.
    """

    def get(self, request, post_id):
        try:
            post = (
                Post.objects
                .select_related("author")
                .annotate(like_count=Count("likes"))
                .get(id=post_id)
            )
        except Post.DoesNotExist:
            return Response({"detail": "Post not found"}, status=status.HTTP_404_NOT_FOUND)

        # Fetch all comments for this post in ONE query
        comments = (
            Comment.objects
            .filter(post_id=post_id)
            .select_related("author")
            .annotate(like_count=Count("likes"))
            .order_by("created_at")
        )

        tree = build_comment_tree(list(comments))

        return Response({
            "post": PostSerializer(post).data,
            "comments": RecursiveCommentSerializer(tree, many=True).data
        })




from django.contrib.auth.models import User
from django.db import transaction, IntegrityError
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


from .models import PostLike, CommentLike, KarmaLog


class LikePostAPI(APIView):
    """
    POST /api/posts/<id>/like/
    TEMP MODE: Uses first user from DB for testing.
    """

    def post(self, request, post_id):
        # TEMP: always use first user for testing
        user = User.objects.first()

        if not user:
            return Response({"detail": "No users found. Create a user first."},
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            with transaction.atomic():
                like, created = PostLike.objects.get_or_create(
                    user=user,
                    post_id=post_id
                )

                if not created:
                    return Response({"detail": "Already liked", "liked": False}, status=status.HTTP_200_OK)


                # Karma for liking a post = 5
                KarmaLog.objects.create(
                    user=user,
                    points=5,
                    reason="POST_LIKE"
                )

        except IntegrityError:
            return Response({"detail": "Already liked", "liked": False}, status=status.HTTP_200_OK)


        return Response({"detail": "Post liked", "liked": True}, status=status.HTTP_201_CREATED)



class LikeCommentAPI(APIView):
    """
    POST /api/comments/<id>/like/
    TEMP MODE: Uses first user from DB for testing.
    """

    def post(self, request, comment_id):
        # TEMP: always use first user for testing
        user = User.objects.first()

        if not user:
            return Response({"detail": "No users found. Create a user first."},
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            with transaction.atomic():
                like, created = CommentLike.objects.get_or_create(
                    user=user,
                    comment_id=comment_id
                )

                if not created:
                    return Response({"detail": "Already liked", "liked": False}, status=status.HTTP_200_OK)


                # Karma for liking a comment = 1
                KarmaLog.objects.create(
                    user=user,
                    points=1,
                    reason="COMMENT_LIKE"
                )

        except IntegrityError:
            return Response({"detail": "Already liked", "liked": False}, status=status.HTTP_200_OK)


        return Response({"detail": "Comment liked"}, status=status.HTTP_201_CREATED)



class LeaderboardAPI(APIView):
    """
    GET /api/leaderboard/
    Top 5 users by karma earned in last 24 hours.
    """

    def get(self, request):
        since = timezone.now() - timedelta(hours=24)

        qs = (
            KarmaLog.objects
            .filter(created_at__gte=since)
            .values("user__id", "user__username")
            .annotate(total_karma=Sum("points"))
            .order_by("-total_karma")[:5]
        )

        return Response(list(qs), status=status.HTTP_200_OK)
