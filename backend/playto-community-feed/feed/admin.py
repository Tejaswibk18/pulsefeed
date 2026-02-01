from django.contrib import admin
from .models import Post, Comment, PostLike, CommentLike, KarmaLog

admin.site.register(Post)
admin.site.register(Comment)
admin.site.register(PostLike)
admin.site.register(CommentLike)
admin.site.register(KarmaLog)
