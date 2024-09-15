import subprocess
import os
import re

# Define the virtual environment path and the yolov9 directory
venv_python = 'D:\\MachineLearning\\Suraksha\\AccidentDetection\\venv\\Scripts\\python.exe'
yolov9_directory = 'D:\\MachineLearning\\Suraksha\\AccidentDetection\\yolov9'  # Correct Windows path format

# Define the command
findclass_command = [
    venv_python, 'severity.py',  # Use the virtual environment Python executable
    '--imgsz', '1280',
    '--conf-thres', '0.1',
    '--device', 'cpu',
    '--weights', 'runs\\train\\exp3\\weights\\best.pt',  # Use raw string
    '--source', '..\\assets\\crash.jpeg'  # Use raw string
]

# Change the directory to yolov9
os.chdir(yolov9_directory)

# Run the findclass.py script
process = subprocess.Popen(findclass_command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, env=os.environ.copy())

detected_class = None

# Capture stdout and stderr
for line in process.stdout:
    if 'Detected class:' in line:
        # Extract detected class
        match = re.search(r'Detected class:\s*(\w+)', line)
        if match:
            detected_class = match.group(1)

# Capture and print stderr for debugging (optional, remove if not needed)
for err in process.stderr:
    print(f"ERROR: {err.strip()}")  # Print any errors to help with debugging

# Wait for the process to complete
process.wait()

# Check exit code for success
if process.returncode != 0:
    print(f"Process failed with exit code {process.returncode}")
else:
    # Print the detected class if found
    if detected_class:
        print(f"Detected class: {detected_class}")
    else:
        print("No class detected.")
