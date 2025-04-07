from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed 
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.core.mail import send_mail
from .models import User, OTPVerification
from .utils import get_tokens_for_user
import random

class UserRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name','last_name','email','phone','password']

    def create(self, validated_data):
        user = User.objects.create(
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            email=validated_data['email'],
            phone=validated_data['phone'],
            password=validated_data['password'],
            isVerified=False
        )
        otp = str(random.randint(100000, 999999))
        OTPVerification.objects.create(user=user, otp=otp)
        send_mail(
            'Your OTP Code',
            f'Your OTP for verification is {otp}.',
            'noreply@example.com',
            [user.email],
            fail_silently=False,
        )
        return user
    

class OTPVerificationSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)

    def validate(self, data):
        email = data.get('email')
        otp = data.get('otp')
        try:
            user = User.objects.get(email=email)
            otp_record = OTPVerification.objects.get(user=user)
        except User.DoesNotExist:
            raise serializers.ValidationError({'email': 'User not found'})
        except OTPVerification.DoesNotExist:
            raise serializers.ValidationError({'otp': 'OTP not found'})

        if otp_record.is_expired():
            raise serializers.ValidationError({'otp': 'OTP expired'})

        if otp_record.otp != otp:
            raise serializers.ValidationError({'otp': 'Invalid OTP'})

        user.isVerified = True
        user.save()
        otp_record.delete()
        return {'message': 'User verified successfully'}
    
class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        user = authenticate(username=email, password=password)
        if user is None:
            raise AuthenticationFailed("Invalid Credentials")

        token = get_tokens_for_user(user)
        return {
            "msg": "Login Successful...",
            "token": token
        }

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name','last_name','email','phone', 'isVerified',]


class PasswordResetSerializer(serializers.Serializer):
    new_password = serializers.CharField(write_only=True, validators=[validate_password])
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match.")
        return data