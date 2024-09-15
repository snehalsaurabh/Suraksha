import subprocess
import os
import re
import argparse

def resolve_path(relative_path):
    """Resolve a relative path to an absolute path."""
    return os.path.abspath(relative_path)

def main(image_path):
    # Define the virtual environment path and the yolov9 directory
    venv_python_1 = 'venv\\Scripts\\python.exe'
    yolov9_directory_1 = 'yolov9'  # Correct Windows path format

    # Resolve the image path to an absolute path
    absolute_image_path = resolve_path(image_path)
    venv_python = resolve_path(venv_python_1)
    yolov9_directory = resolve_path(yolov9_directory_1)

    # Print the image path and command for debugging
    print(f"Using image path: {absolute_image_path}")

    # Define the command with the custom image path
    findclass_command = [
        venv_python, 'severity.py',  # Use the virtual environment Python executable
        '--imgsz', '1280',
        '--conf-thres', '0.1',
        '--device', 'cpu',
        '--weights', 'runs\\train\\exp3\\weights\\best.pt',  # Use raw string
        '--source', absolute_image_path  # Use the resolved absolute path
    ]

    # Print the command for debugging
    print(f"Running command: {' '.join(findclass_command)}")

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

    # Capture and print stderr for debugging
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

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Run YOLOv9 class detection.")
    parser.add_argument('image_path', type=str, help="Path to the image for detection")
    args = parser.parse_args()

    main(args.image_path)
