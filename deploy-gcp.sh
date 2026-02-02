#!/bin/bash

# SignCast Google Cloud Run Deployment Script

echo " Deploying SignCast Backend to Google Cloud Run..."

# Set your project ID (replace with your actual project ID)
PROJECT_ID="your-project-id"
SERVICE_NAME="signcast-backend"
REGION="us-central1"

# Set project
gcloud config set project $PROJECT_ID

# Deploy to Cloud Run
gcloud run deploy $SERVICE_NAME \
  --source ./apps/backend \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --port 8080 \
  --memory 2Gi \
  --cpu 1 \
  --max-instances 10 \
  --set-env-vars "DEBUG=false,LOG_LEVEL=INFO,WHISPER_MODEL=base,WHISPER_DEVICE=cpu"

echo "✅ Deployment complete!"
echo "🌐 Your backend URL will be: https://$SERVICE_NAME-xyz-$REGION.run.app"
echo ""
echo " Next steps:"
echo "1. Copy the backend URL from the output above"
echo "2. Update your Vercel frontend environment variables:"
echo "   VITE_BACKEND_URL=https://your-backend-url.run.app"
echo "3. Add your Groq API key in Cloud Run console"