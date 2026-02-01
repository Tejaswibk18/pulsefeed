from django.test import TestCase
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta

from .models import KarmaLog


class LeaderboardLast24hTest(TestCase):
    def test_leaderboard_counts_only_last_24_hours(self):
        user1 = User.objects.create_user(username="u1", password="123")
        user2 = User.objects.create_user(username="u2", password="123")

        # Inside 24h
        KarmaLog.objects.create(user=user1, points=5, reason="POST_LIKE")
        KarmaLog.objects.create(user=user1, points=1, reason="COMMENT_LIKE")

        KarmaLog.objects.create(user=user2, points=5, reason="POST_LIKE")

        # Older than 24h (should NOT count)
        old_log = KarmaLog.objects.create(user=user2, points=100, reason="POST_LIKE")
        old_log.created_at = timezone.now() - timedelta(days=2)
        old_log.save(update_fields=["created_at"])

        since = timezone.now() - timedelta(hours=24)

        qs = (
            KarmaLog.objects
            .filter(created_at__gte=since)
            .values("user__username")
        )

        usernames = {x["user__username"] for x in qs}

        self.assertIn("u1", usernames)
        self.assertIn("u2", usernames)

        # Confirm total points inside 24h
        u1_points = sum(
            x.points for x in KarmaLog.objects.filter(user=user1, created_at__gte=since)
        )
        u2_points = sum(
            x.points for x in KarmaLog.objects.filter(user=user2, created_at__gte=since)
        )

        self.assertEqual(u1_points, 6)  # 5 + 1
        self.assertEqual(u2_points, 5)  # old 100 excluded
