# RideRecon
The app that identifies any and all cars.

# Dockerize API Calls with GCP
```
docker build -t gcr.io/riderecon/riderecon-api:latest .
```

Run the container locally
```
docker run -d -p 8080:8080 --name riderecon-container gcr.io/riderecon/riderecon-api:latest
```

View logs from the running container
```
docker logs riderecon-container
```

Test the health endpoint
```
curl http://localhost:8080/health
```

Test car identification (replace with path to an actual image)
```
curl -X POST http://localhost:8080/api/identify \
     -H "Content-Type: application/json" \
     -d '{"image": "'$(base64 -w 0 assets/images/GT3RS.jpg)'"}'
```

Stop and remove container when done
```
docker stop riderecon-container
docker rm riderecon-container
```

# Push to GCP and Deploy to Cloud Run
Authenticate with GCP (if not already done)
```
gcloud auth login
gcloud auth configure-docker
```

Push the image to Google Container Registry
```docker push gcr.io/riderecon/riderecon-api:latest```

Deploy to Cloud Run
```
gcloud run deploy riderecon-api \
  --image gcr.io/riderecon/riderecon-api:latest \
  --platform managed \
  --region northamerica-northeast1 \
  --allow-unauthenticated \
  --port 8080 \
  --memory 2Gi \
  --cpu 1
```

# Update After Code Changes
After making code changes, rebuild and push
```
# Rebuild Docker image
docker build -t gcr.io/riderecon/riderecon-api:latest .

# Push to GCR
docker push gcr.io/riderecon/riderecon-api:latest

# Redeploy to Cloud Run
gcloud run deploy riderecon-api \
  --image gcr.io/riderecon/riderecon-api:latest \
  --platform managed \
  --region northamerica-northeast1 \
  --allow-unauthenticated \
  --port 8080 \
  --memory 2Gi \
  --cpu 1
```

Update the Cloud Run service
```
gcloud run services update riderecon-api \
  --image gcr.io/riderecon/riderecon-api:latest \
  --region northamerica-northeast1
```

# Get the API URL
```
gcloud run services describe riderecon-api \
  --platform managed \
  --region northamerica-northeast1 \
  --format="value(status.url)"
```