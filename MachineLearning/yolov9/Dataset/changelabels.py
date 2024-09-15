import os
import random

def modify_labels(label_dir):
    # List all label files in the labels directory
    label_files = os.listdir(label_dir)

    for label_file in label_files:
        label_path = os.path.join(label_dir, label_file)

        # If the label file is empty, write '0' inside it
        if os.path.getsize(label_path) == 0:
            with open(label_path, 'w') as f:
                f.write('0')
            print(f'Empty file found. Written "0" in {label_file}')
            continue
        
        # Read the label file
        with open(label_path, 'r') as f:
            lines = f.readlines()

        # Modify the first column for each line
        modified_lines = []
        for line in lines:
            parts = line.split()
            if len(parts) > 0:
                # Change the first column based on its value (0 or 1)
                class_label = int(parts[0])
                if class_label == 0:
                    parts[0] = str(random.randint(1, 6))  # Replace 0 with a number between 1 and 6
                elif class_label == 1:
                    parts[0] = str(random.randint(7, 10))  # Replace 1 with a number between 7 and 10
                
                modified_lines.append(' '.join(parts))
        
        # Write the modified lines back to the file
        with open(label_path, 'w') as f:
            f.write('\n'.join(modified_lines))
        print(f'Modified file: {label_file}')

# Set path to the labels directory (replace with your actual path)
label_dir = 'valid/labels/'

# Run the function
modify_labels(label_dir)
