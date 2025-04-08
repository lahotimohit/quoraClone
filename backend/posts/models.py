from django.db import models
from authService.models import User
from cloudinary.models import CloudinaryField
from dotenv import load_dotenv
import cloudinary
import os

load_dotenv()

cloudinary.config(
    cloud_name=os.getenv("CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API"),
    api_secret=os.getenv("CLOUDINARY_SECRET")
)

class Question(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='questions')
    title = models.CharField(max_length=255)
    body = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

class Answer(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='answers')
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='answers')
    body = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    likes = models.ManyToManyField(User, related_name='liked_answers', blank=True)

class AnswerImage(models.Model):
    answer = models.ForeignKey('Answer', on_delete=models.CASCADE, related_name='images')
    image = CloudinaryField("answer_images", blank=True)