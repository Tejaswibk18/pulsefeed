# EXPLAINER.md

## 1) The Tree (Nested Comments)

### ✅ How I modeled nested comments
I used an adjacency-list model:

- `Comment.post` → FK to Post
- `Comment.parent` → FK to Comment (self-relation, nullable)

This allows unlimited nesting like Reddit.

```py
parent = models.ForeignKey(
    "self",
    on_delete=models.CASCADE,
    null=True,
    blank=True,
    related_name="replies"
)

✅ How I serialized without N+1

To avoid the N+1 nightmare, I fetched all comments for a post in a single query:

comments = (
    Comment.objects
    .filter(post_id=post_id)
    .select_related("author")
    .annotate(like_count=Count("likes"))
    .order_by("created_at")
)


Then I built the nested tree in Python using a parent→children mapping:

initialize prefetched_replies = []

map each comment by id

attach each comment into its parent’s prefetched_replies

root comments = those with parent_id=None

This avoids recursive DB hits and keeps comment-tree rendering efficient even for large threads.

2) The Math (Last 24h Leaderboard)
✅ How leaderboard is computed

I did NOT store daily karma on the User model.

Instead, karma is stored as transaction/activity rows in KarmaLog and leaderboard is calculated dynamically using a SUM() aggregation over the last 24 hours.

✅ QuerySet used (Last 24h)
since = timezone.now() - timedelta(hours=24)

qs = (
    KarmaLog.objects
    .filter(created_at__gte=since)
    .values("user__id", "user__username")
    .annotate(total_karma=Sum("points"))
    .order_by("-total_karma")[:5]
)


Karma Rules:

Post Like = +5 points

Comment Like = +1 point

3) The AI Audit (Bug / Inefficiency I Fixed)
✅ Example issue

AI initially generated a recursive serialization approach where each comment fetched its children using an additional query.

That would cause N+1 queries with deep comment threads (ex: 50 nested comments → 50+ SQL queries).

✅ Fix

I replaced it with:

a single bulk query to fetch all comments for the post

Python-side tree building using parent_id mapping

This reduced the DB calls to a predictable small number of queries and improved performance significantly.
