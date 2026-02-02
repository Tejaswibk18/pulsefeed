from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from feed.models import Post, Comment


class Command(BaseCommand):
    help = "Seed demo data for PulseFeed"

    def handle(self, *args, **kwargs):
        if Post.objects.exists():
            self.stdout.write(self.style.WARNING("Demo data already exists."))
            return

        user, _ = User.objects.get_or_create(username="demo_user")
        user.set_password("demo123")
        user.save()

        post = Post.objects.create(
            author=user,
            content="🚀 Welcome to PulseFeed! This is a demo post for threaded comments + karma leaderboard."
        )

        c1 = Comment.objects.create(post=post, author=user, content="This is root comment 1")
        Comment.objects.create(post=post, author=user, parent=c1, content="This is a reply to root comment 1")

        Comment.objects.create(post=post, author=user, content="This is root comment 2")

        self.stdout.write(self.style.SUCCESS("✅ Demo data seeded successfully!"))
