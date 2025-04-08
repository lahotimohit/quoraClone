#!/bin/bash

echo "Updating pip..."
python3.12 pip install -U pip

# Install dependencies

echo "Installing project dependencies..."
python3.12 -m pip install -r requirements.txt

#Install whitenoise
echo "Installing white noise..."
python3.12 manage.py whitenoise
# Collect staticfiles
echo "Collect static..."
python3.12 manage.py collectstatic --noinput --clear
