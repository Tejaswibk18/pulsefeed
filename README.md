# PulseFeed (Community Feed Prototype)

A community feed prototype with:
- Text posts + likes
- Reddit-style threaded comments (nested)
- Karma gamification
- Top 5 leaderboard based on karma earned in the last 24 hours

---

## ✅ Tech Stack
- Backend: Django + Django REST Framework
- Frontend: React (Vite) + Tailwind CSS
- Database: SQLite (default)

---

## ✅ Features
### Feed
- Displays posts with author + like count

### Threaded Comments
- Users can comment on a post and reply to other comments (nested threads)

### Likes + Karma
- Like a Post → +5 karma
- Like a Comment → +1 karma
- Prevents double-like using DB uniqueness constraints + atomic transactions

### Leaderboard (Last 24 Hours Only)
- Shows top 5 users based on karma earned in the last 24h
- Calculated dynamically from `KarmaLog` (not stored as a daily integer field)

---

## ✅ Backend Setup (Django)
### 1) Create virtualenv

python -m venv venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate


##2) Install dependencies
pip install -r requirements.txt


If you don't have requirements.txt, install manually:

pip install django djangorestframework django-cors-headers

##3) Run migrations
python manage.py makemigrations
python manage.py migrate

##4) Create admin user
python manage.py createsuperuser

##5) Run backend
python manage.py runserver


Backend runs at:

http://127.0.0.1:8000/

Admin panel:

http://127.0.0.1:8000/admin/

✅ Frontend Setup (React + Vite)

Go into frontend folder:

cd frontend
npm install
npm run dev


Frontend runs at:

http://localhost:5173/

✅ API Endpoints
Post + Nested Comment Tree

GET:

/api/posts/<post_id>/

Like a Post

POST:

/api/posts/<post_id>/like/

Like a Comment

POST:

/api/comments/<comment_id>/like/

Leaderboard (last 24h)

GET:

/api/leaderboard/
