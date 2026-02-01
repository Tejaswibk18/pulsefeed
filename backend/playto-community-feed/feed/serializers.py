from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Post, Comment


class UserMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username"]


class RecursiveCommentSerializer(serializers.ModelSerializer):
    author = UserMiniSerializer(read_only=True)
    replies = serializers.SerializerMethodField()
    like_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Comment
        fields = ["id", "author", "content", "created_at", "like_count", "replies"]

    def get_replies(self, obj):
        # replies will be injected as prefetched data in view for efficiency
        children = getattr(obj, "prefetched_replies", [])
        return RecursiveCommentSerializer(children, many=True).data


class PostSerializer(serializers.ModelSerializer):
    author = UserMiniSerializer(read_only=True)
    like_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Post
        fields = ["id", "author", "content", "created_at", "like_count"]
