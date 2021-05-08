import json
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.http import JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt

from .models import User, Tweet, Follower

def index(request):
    return render(request, "network/index.html")

@csrf_exempt
def tweet(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)
    data = json.loads(request.body)
    body = data.get("body", "")
    tweeted = Tweet(
    user = request.user,
    body = body
    )
    tweeted.save()
    return HttpResponseRedirect(reverse("index"))

def tweet_api(request):
    tweets = Tweet.objects.all()
    tweets = tweets.order_by("-timestamp").all()
    return JsonResponse([tweeted.serialize(request.user) for tweeted in tweets], safe=False)

@csrf_exempt
@login_required
def like_unlike(request):
    if request.method != "PUT":
        return JsonResponse({"error": "PUT request required."}, status=400)

    tweet_id = json.loads(request.body)
    tweet = Tweet.objects.get(id=tweet_id)
    if request.user in tweet.like.all():
            tweet.like.remove(request.user)
            flag="N"
    else:
        tweet.like.add(request.user)
        flag="Y"
    tweet.save()
    return JsonResponse({"likes_num": str(tweet.like.count()), "flag": flag})

@csrf_exempt
@login_required
def edit_tweet(request):
    if request.method != "PUT":
        return JsonResponse({"error": "PUT request required."}, status=400)

    data = json.loads(request.body)
    tweet_id = data.get("tweet_id", "")
    content = data.get("content", "")
    tweet = Tweet.objects.get(id=tweet_id)
    tweet.body = content
    tweet.save()
    return JsonResponse({"content": tweet.body})

@login_required
def following(request):
    followed_users = [followed.following for followed in request.user.following.all()]
    tweets = Tweet.objects.filter(user__in=followed_users).order_by("-timestamp")
    return render(request,"network/following.html",{"tweets":[tweeted.serialize(request.user) for tweeted in tweets]})

@csrf_exempt
def profile(request, username):
    user = User.objects.get(username=username)
    if request.method == 'POST':
        if request.POST.get("tag") == "Follow":
            if not request.user.following.filter(following=user).exists():
                Follower.objects.create(following=user, followers=request.user)
        else:
            if request.user.following.filter(following=user).exists():
                Follower.objects.get(following=user, followers=request.user).delete()
    followed=''
    if request.user.is_authenticated:
        if request.user.following.filter(following=user).exists():
            followed='Y'
        else:
            followed='N'
    tweets = user.tweets.order_by("-timestamp").all()
    return render(request, "network/profile.html",{"p_user":user,"followed":followed,"tweets":[tweeted.serialize(request.user) for tweeted in tweets]})

def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        first_name = request.POST["first_name"]
        last_name = request.POST["last_name"]
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.first_name = first_name
            user.last_name = last_name
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")
