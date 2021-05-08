
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),

    path("tweet", views.tweet, name="tweet"),
    path("tweet_api",views.tweet_api, name="tweet_api"),
    path("like_unlike",views.like_unlike,name="like_unlike"),
    path("edit_tweet",views.edit_tweet,name="edit_tweet"),
    path("following",views.following,name="following"),
    path("user/<str:username>", views.profile, name="profile")
]
