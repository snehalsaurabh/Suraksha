from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
import os
import base64
from io import BytesIO
from PIL import Image
import requests
import google.generativeai as genai
import dotenv
import logging

# Load environment variables
dotenv.load_dotenv()

# Initialize FastAPI app
app = FastAPI()

# Configure Google Gemini API
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# Define severity classes
severity_classes = [
    "no_accident", "minor", "negligible", "superficial", "low_impact",
    "moderate", "significant", "serious", "critical", "severe", "fatal"
]

# Function to convert image to base64
def get_image_base64(image_raw):
    buffered = BytesIO()
    image_raw.save(buffered, format=image_raw.format)
    img_byte = buffered.getvalue()
    return base64.b64encode(img_byte).decode('utf-8')

# Function to map response to severity class with NLP weighting
def map_response_to_severity(response_text):
    response_text = response_text.lower()
    if "no accident" in response_text:
        return "no_incident"
    elif "minor" in response_text:
        return "minor"
    elif "negligible" in response_text:
        return "negligible"
    elif "superficial" in response_text:
        return "superficial"
    elif "low impact" in response_text:
        return "low_impact"
    elif "moderate" in response_text:
        return "moderate"
    elif "significant" in response_text:
        return "significant"
    elif "serious" in response_text:
        return "serious"
    elif "critical" in response_text:
        return "critical"
    elif "severe" in response_text:
        return "severe"
    elif "fatal" in response_text:
        return "fatal"
    else:
        return "unknown"

# Endpoint to upload image and get responses from Google Gemini
@app.post("/upload/")
async def upload_image(request: Request):
    try:
        # Parse the JSON body
        data = await request.json()
        image_url = data.get("url")

        # Download the image from the URL
        response = requests.get(image_url)
        image = Image.open(BytesIO(response.content))

        # Convert the image to base64
        image_base64 = get_image_base64(image)

        # First predefined question to assess severity
        severity_question = "Based on this image, what is the level of damage or severity to the vehicles, structures, or any other objects involved? Please categorize it as: no_accident, minor, negligible, superficial, low_impact, moderate, significant, serious, critical, severe, or fatal. If there is an injured person in the image, kindly don't ignore it. Categorize it as among critical or fatal because this is a medical emergency application and we are reporting to emergency services. If it is non threatening image or no accident, please categorize it as no_accident."

        # Second question to describe the image in detail
        description_question = "Please describe the physical damage to objects such as vehicles or infrastructure, and note any potential dangers present in the accident scene. Focus on details that could affect the safety of the area. If there is an injured person, kindly don't ignore. Just let us know if they need urgent medical attention or not since this is a medical emergency application and we are reporting to emergency services."

        # Create the messages for Google Gemini
        gemini_message = [
            {
                "role": "user",
                "parts": [
                    {
                        "mime_type": f"image/{image.format.lower()}",  # Detect format dynamically
                        "data": image_base64
                    },
                    {
                        "text": severity_question
                    }
                ]
            },
            {
                "role": "user",
                "parts": [
                    {
                        "mime_type": f"image/{image.format.lower()}",  # Include image for description
                        "data": image_base64
                    },
                    {
                        "text": description_question
                    }
                ]
            }
        ]

        # Send the messages to Google Gemini and get the responses
        model = genai.GenerativeModel(
            model_name="gemini-1.5-pro",
            generation_config={"temperature": 0.2}  # Lower temperature for more deterministic output
        )

        # Response for severity
        severity_response = ""
        for chunk in model.generate_content(contents=[gemini_message[0]], stream=True):
            chunk_text = chunk.text or ""
            severity_response += chunk_text

        # Map the response to a severity class
        severity = map_response_to_severity(severity_response)

        # Response for description
        description_response = ""
        for chunk in model.generate_content(contents=[gemini_message[1]], stream=True):
            chunk_text = chunk.text or ""
            description_response += chunk_text

        # Return the combined response and severity as JSON
        return JSONResponse(content={
            "severity": severity, 
            "response": description_response
        })

    except Exception as e:
        logging.error(f"Error occurred: {e}")
        return JSONResponse(content={"error": "Failed to process image or generate response"}, status_code=500)

# Serve the FastAPI application
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
