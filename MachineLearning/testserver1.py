# Description: A simple FastAPI server that accepts image uploads and runs a custom detection script on them. 

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
import subprocess
import os
import re
from typing import Optional

app = FastAPI()

# Define directories
UPLOADS_DIR = 'uploads'
CUSTOM_AUTO_SCRIPT = 'custom_auto.py'  # Update with your script name

# Ensure uploads directory exists
os.makedirs(UPLOADS_DIR, exist_ok=True)

def run_detection(image_path: str) -> Optional[str]:
    """Run the detection script on the given image and return the detected class."""
    # Define the command
    command = [
        'python', CUSTOM_AUTO_SCRIPT, image_path
    ]

    # Run the command
    process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    detected_class = None

    # Capture stdout and stderr
    for line in process.stdout:
        if 'Detected class:' in line:
            # Extract detected class
            match = re.search(r'Detected class:\s*(\w+)', line)
            if match:
                detected_class = match.group(1)

    # Capture and print stderr for debugging
    for err in process.stderr:
        print(f"ERROR: {err.strip()}")

    # Wait for the process to complete
    process.wait()

    if process.returncode != 0:
        print(f"Process failed with exit code {process.returncode}")
        return None

    return detected_class

@app.post("/upload/")
async def upload_image(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(('.png', '.jpg', '.jpeg')):
        raise HTTPException(status_code=400, detail="Invalid file type. Only images are allowed.")

    file_location = os.path.join(UPLOADS_DIR, file.filename)
    with open(file_location, "wb") as f:
        f.write(file.file.read())

    detected_class = run_detection(file_location)

    if detected_class:
        return JSONResponse(content={"detected_class": detected_class})
    else:
        raise HTTPException(status_code=500, detail="Detection failed.")

@app.get("/")
def read_root():
    return {"message": "Upload an image using POST /upload/"}
