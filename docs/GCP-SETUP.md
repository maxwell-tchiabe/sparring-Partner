# Google Cloud Platform Setup

This guide provides instructions for deploying the Sparring Partner application to Google Cloud Platform (GCP), specifically using Google Cloud Run for containerized application deployment.

## Prerequisites

1. A Google Cloud Platform account (If you're new to GCP, you'll get free credits upon signing up)
2. Google Cloud SDK installed on your local machine
3. Docker installed on your local machine

## Initial Setup

Open a terminal in the root folder of this repository and follow these steps:

### 1. Authentication and Project Configuration

```bash
# Authenticate with Google Cloud
gcloud auth login

# Set your Google Cloud project
gcloud config set project <PROJECT_ID>
```

### 2. Enable Required Services

```bash
# Enable necessary Google Cloud APIs
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable artifactregistry.googleapis.com
gcloud services enable cloudresourcemanager.googleapis.com
gcloud services enable secretmanager.googleapis.com
```

### 3. Configure Docker Registry

```bash
# Set the compute region
gcloud config set compute/region <LOCATION>

# Configure Docker authentication
gcloud auth configure-docker <LOCATION>-docker.pkg.dev -q
```

Note: Replace `<LOCATION>` with your preferred region (e.g., 'europe-west3')

### 4. Create Docker Repository

```bash
gcloud artifacts repositories create sparring-partner \
    --repository-format=docker \
    --location=<LOCATION> \
    --description="Docker repository for Sparring Partner" \
    --project=<PROJECT_ID>
```

### 5. Set Up Secret Manager

Create the necessary secrets for your application. Use the appropriate commands based on your operating system:

#### For Windows (PowerShell):

```powershell
# AI Model and Speech Configuration
echo -n "your_groq_api_key" | gcloud secrets create GROQ_API_KEY --replication-policy="automatic" --data-file=-

echo -n "your_elevenlabs_api_key" | gcloud secrets create ELEVENLABS_API_KEY --replication-policy="automatic" --data-file=-

echo -n "your_elevenlabs_voice_id" | gcloud secrets create ELEVENLABS_VOICE_ID --replication-policy="automatic" --data-file=-

echo -n "your_together_api_key" | gcloud secrets create TOGETHER_API_KEY --replication-policy="automatic" --data-file=-

# Vector Database Configuration
echo -n "your_qdrant_url" | gcloud secrets create QDRANT_URL --replication-policy="automatic" --data-file=-

echo -n "your_qdrant_api_key" | gcloud secrets create QDRANT_API_KEY --replication-policy="automatic" --data-file=-

# Supabase Configuration
echo -n "your_supabase_url" | gcloud secrets create SUPABASE_URL --replication-policy="automatic" --data-file=-

echo -n "your_supabase_key" | gcloud secrets create SUPABASE_KEY --replication-policy="automatic" --data-file=-

echo -n "your_supabase_jwt_secret" | gcloud secrets create SUPABASE_JWT_SECRET --replication-policy="automatic" --data-file=-
```

#### For Mac/Linux (Bash):

```bash
# AI Model and Speech Configuration
echo -n "your_groq_api_key" |
  gcloud secrets create GROQ_API_KEY \
  --replication-policy="automatic" \
  --data-file=-

echo -n "your_elevenlabs_api_key" |
  gcloud secrets create ELEVENLABS_API_KEY \
  --replication-policy="automatic" \
  --data-file=-

echo -n "your_elevenlabs_voice_id" |
  gcloud secrets create ELEVENLABS_VOICE_ID \
  --replication-policy="automatic" \
  --data-file=-

echo -n "your_together_api_key" |
  gcloud secrets create TOGETHER_API_KEY \
  --replication-policy="automatic" \
  --data-file=-

# Vector Database Configuration
echo -n "your_qdrant_url" |
  gcloud secrets create QDRANT_URL \
  --replication-policy="automatic" \
  --data-file=-

echo -n "your_qdrant_api_key" |
  gcloud secrets create QDRANT_API_KEY \
  --replication-policy="automatic" \
  --data-file=-

# Supabase Configuration
echo -n "your_supabase_url" |
  gcloud secrets create SUPABASE_URL \
  --replication-policy="automatic" \
  --data-file=-

echo -n "your_supabase_key" |
  gcloud secrets create SUPABASE_KEY \
  --replication-policy="automatic" \
  --data-file=-

echo -n "your_supabase_jwt_secret" |
  gcloud secrets create SUPABASE_JWT_SECRET \
  --replication-policy="automatic" \
  --data-file=-
```

### Environment Variables Reference

Here's a reference for all the required environment variables:

| Variable Name         | Description                            |
| --------------------- | -------------------------------------- |
| `GROQ_API_KEY`        | API key for Groq AI services           |
| `ELEVENLABS_API_KEY`  | API key for ElevenLabs voice synthesis |
| `ELEVENLABS_VOICE_ID` | Voice ID for ElevenLabs synthesis      |
| `TOGETHER_API_KEY`    | API key for Together AI services       |
| `QDRANT_URL`          | URL for Qdrant vector database         |
| `QDRANT_API_KEY`      | API key for Qdrant vector database     |
| `SUPABASE_URL`        | URL for Supabase instance              |
| `SUPABASE_KEY`        | API key for Supabase                   |
| `SUPABASE_JWT_SECRET` | JWT secret for Supabase authentication |

### 6. Configure Cloud Run Permissions

Grant the Cloud Run service account access to Secret Manager:

```bash
gcloud projects add-iam-policy-binding <PROJECT_ID> \
  --member="serviceAccount:$(gcloud projects describe $(gcloud config get-value project) --format="value(projectNumber)")-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

## Deployment

To deploy your application using Cloud Build:

```bash
gcloud builds submit --region=<LOCATION>
```

This will use the configuration in your `backend/cloudbuild.yaml` file to build and deploy the application.

## Environment Variables

Ensure all necessary environment variables are properly configured in your Cloud Run service. The following variables should be set:

- `SUPABASE_URL`
- `SUPABASE_KEY`
- `OPENAI_API_KEY`
- `JWT_SECRET`

## Troubleshooting

1. If you encounter permission issues, ensure your Google Cloud user account has the necessary IAM roles:

   - Cloud Build Service Account
   - Cloud Run Admin
   - Secret Manager Admin

2. For deployment failures, check the Cloud Build logs in the Google Cloud Console.

3. Verify that all required APIs are enabled in your GCP project.

## Cost Management

- Monitor your resource usage through the GCP Console
- Set up billing alerts to avoid unexpected charges
- Use the built-in cost calculator to estimate expenses

## Security Best Practices

1. Always use Secret Manager for sensitive information
2. Regularly rotate API keys and secrets
3. Follow the principle of least privilege when assigning IAM roles
4. Enable audit logging for security monitoring

## Local Development

For local development, you can use the Docker Compose setup provided in the `backend/docker-compose.yml` file. This ensures consistency between local and production environments.
