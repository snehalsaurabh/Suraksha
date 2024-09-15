# Combined Functionality of both the models
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
import os
import base64
from io import BytesIO
from PIL import Image
import google.generativeai as genai
import dotenv
import subprocess
import re
from typing import Optional

# Load environment variables
dotenv.load_dotenv()

# Initialize FastAPI app
app = FastAPI()

# Configure Google Gemini API
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# Define directories
UPLOADS_DIR = 'uploads'
CUSTOM_AUTO_SCRIPT = 'custom_auto.py'  # Update with your script name

# Ensure uploads directory exists
os.makedirs(UPLOADS_DIR, exist_ok=True)

# Function to convert image to base64
def get_image_base64(image_raw):
    buffered = BytesIO()
    image_raw.save(buffered, format=image_raw.format)
    img_byte = buffered.getvalue()
    return base64.b64encode(img_byte).decode('utf-8')

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
                break  # No need to read further lines

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

    # Save the uploaded image to the uploads folder
    file_location = os.path.join(UPLOADS_DIR, file.filename)
    with open(file_location, "wb") as f:
        f.write(file.file.read())

    # Run the detection script
    detected_class = run_detection(file_location)

    # Open the image and convert it to base64
    image = Image.open(file_location)
    image_base64 = get_image_base64(image)

    # Predefined question
    question = "What is happening in this image?"

    # Create the message for Google Gemini
    gemini_message = {
        "role": "user",
        "parts": [
            {
                "mime_type": "image/jpeg",  # Assuming the image is in JPEG format
                "data": image_base64
            },
            {
                "text": question
            }
        ]
    }

    # Send the message to Google Gemini and get the response
    model = genai.GenerativeModel(
        model_name="gemini-1.5-pro",
        generation_config={
            "temperature": 0.3,
        }
    )

    response_message = ""
    for chunk in model.generate_content(
        contents=[gemini_message],
        stream=True,
    ):
        chunk_text = chunk.text or ""
        response_message += chunk_text

    # Return the combined response as JSON
    return JSONResponse(content={"detected_class": detected_class, "gemini_response": response_message})

@app.get("/")
def read_root():
    return {"message": "Upload an image using POST /upload/"}