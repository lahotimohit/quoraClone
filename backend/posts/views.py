from rest_framework import viewsets, permissions, status
from .models import Question, Answer
from .serializers import QuestionSerializer, AnswerSerializer
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def get_answers_for_question(request, question_id):
    try:
        question = Question.objects.get(pk=question_id)
    except Question.DoesNotExist:
        return Response({'detail': 'Question not found'}, status=status.HTTP_404_NOT_FOUND)

    answers = Answer.objects.filter(question=question).order_by('-created_at')
    serializer = AnswerSerializer(answers, many=True, context={'request': request})
    return Response(serializer.data)

class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all().order_by('-created_at')
    serializer_class = QuestionSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class AnswerViewSet(viewsets.ModelViewSet):
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    parser_classes = [MultiPartParser, FormParser]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class AnswerLikeViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):
        answer = Answer.objects.get(pk=pk)
        answer.likes.add(request.user)
        return Response({'status': 'liked'})
