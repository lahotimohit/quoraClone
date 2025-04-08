from rest_framework import serializers
from authService.serializers import UserProfileSerializer
from .models import Question, Answer, AnswerImage

class AnswerImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnswerImage
        fields = ['id', 'image']

class AnswerSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer(read_only=True)
    likes_count = serializers.SerializerMethodField()
    images = AnswerImageSerializer(many=True, read_only=True)
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(),
        write_only=True,
        required=False
    )

    class Meta:
        model = Answer
        fields = ['id', 'question', 'user', 'body', 'created_at', 'likes_count', 'uploaded_images', 'images']

    def get_likes_count(self, obj):
        return obj.likes.count()

    def create(self, validated_data):
        uploaded_images = validated_data.pop('uploaded_images', [])
        answer = Answer.objects.create(**validated_data)
        for image in uploaded_images:
            AnswerImage.objects.create(answer=answer, image=image)
        return answer

class QuestionSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer(read_only=True)
    answers = AnswerSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ['id', 'user', 'title', 'body', 'created_at', 'answers']
