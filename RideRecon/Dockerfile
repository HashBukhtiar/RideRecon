FROM python:3.10-slim

WORKDIR /app

# Copy requirements first to leverage Docker caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Make sure Python can find your modules
ENV PYTHONPATH=/app

# Set environment variables
ENV PORT=8080
ENV PYTHONUNBUFFERED=1

# Command to run the server - fix the path
CMD ["python", "services/app.py"]