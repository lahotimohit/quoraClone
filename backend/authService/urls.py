from . import views
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register', views.UserRegistration.as_view()),
    path('verify-otp', views.VerifyOTP.as_view()),
    path('login', views.UserLogin.as_view(), name='success'),
    path('profile', views.UserProfile.as_view()),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('request-reset/', views.RequestPasswordResetView.as_view(), name='request-password-reset'),
    path('reset-password/<uuid:user_id>/<str:token>/', views.ResetPasswordView.as_view(), name='reset-password'),
]
