from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    pass

class Follower(models.Model):
    followers = models.ForeignKey("User", on_delete=models.CASCADE, related_name="following")
    following = models.ForeignKey("User", on_delete=models.CASCADE, related_name="followers")

class Tweet(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="tweets")
    body = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    like = models.ManyToManyField(User,related_name="likes_count")

    def serialize(self, current_user):
        if current_user in self.like.all():
            flag="Y"
        else:
            flag="N"

        if self.user == current_user:
            edit="Y"
        else:
            edit="N"

        return {
            "id": self.id,
            "user": self.user.username,
            "first_name": self.user.first_name,
            "last_name": self.user.last_name,
            "body": self.body,
            "timestamp": self.timestamp.strftime("%A, %d %B %Y at %I:%M %p"),
            "like": self.like.count(),
            "flag": flag,
            "edit":edit
        }
