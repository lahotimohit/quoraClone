from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import QuestionViewSet, AnswerViewSet, AnswerLikeViewSet, get_answers_for_question

router = DefaultRouter()
router.register(r'questions', QuestionViewSet)
router.register(r'answers', AnswerViewSet)
router.register(r'like-answer', AnswerLikeViewSet, basename='like-answer')

urlpatterns = [
    path('', include(router.urls)),
    path('questions/<int:question_id>/answers/', get_answers_for_question, name='question-answers'),
]
