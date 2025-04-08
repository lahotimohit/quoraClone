from django.contrib import admin
from posts import models

admin.site.register(models.Question)
admin.site.register(models.Answer)
admin.site.register(models.AnswerImage)