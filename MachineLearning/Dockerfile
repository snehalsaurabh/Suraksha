# Use the official Python image from the Docker Hub
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container
COPY requirements.txt .

# Create a virtual environment
RUN python -m venv venv

# Upgrade pip
RUN /bin/bash -c "source venv/bin/activate && pip install --upgrade pip"

# Activate the virtual environment, return to the main directory, and install the dependencies with increased timeout and alternative PyPI mirror
RUN /bin/bash -c "source venv/bin/activate && cd /app && pip install --no-cache-dir -r requirements.txt --timeout=500 --index-url https://pypi.org/simple"

# Copy the rest of the application code into the container
COPY . .

# Ensure the virtual environment is activated when running the application
ENV PATH="/app/venv/bin:$PATH"

# Expose the port that the app runs on
EXPOSE 8000

# Command to run the application
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]