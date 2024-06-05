import os

# Set the project root directory
PROJECT_ROOT = '/Users/paulh/Projects/_wallets/code/ad-creator/ad-creator/'

# Color mapping dictionary
color_mapping = {
    'maintenance': '#2ca2cc',
    'performance': '#e20613',
    'recovery': '#ffaa00'
}

def check_file_exists(file_path):
    if not os.path.exists(file_path):
        print(f"Missing file: {file_path}")
        return False
    return True

def preflight_check():
    # Path to skus.txt
    skus_file_path = os.path.join(PROJECT_ROOT, 'scripts/pipeline/blender_files/skus.txt')

    # Check if skus.txt file exists
    if not check_file_exists(skus_file_path):
        print(f"Error: '{skus_file_path}' does not exist.")
        return False

    # Read SKUs and environment variables from skus.txt
    with open(skus_file_path, 'r') as file:
        lines = file.readlines()

    all_files_exist = True

    # Check each SKU line
    for line in lines:
        parts = line.strip().split(',')
        if len(parts) >= 2:
            sku = parts[0].upper()
            rs_colour_key = parts[1].lower()

            # Check if rs_colour_key is valid
            if rs_colour_key not in color_mapping:
                print(f"Error: Invalid RS_COLOUR '{rs_colour_key}' for SKU '{sku}'.")
                all_files_exist = False
                continue

            # Paths to front and back label images
            front_label_image = os.path.join(PROJECT_ROOT, f"public/sku/{sku}/{sku}_label_front.png")
            back_label_image = os.path.join(PROJECT_ROOT, f"public/sku/{sku}/{sku}_label_back.png")

            # Check if the label image files exist
            if not check_file_exists(front_label_image):
                all_files_exist = False
            if not check_file_exists(back_label_image):
                all_files_exist = False
        else:
            print(f"Error: Invalid line format '{line.strip()}'. Skipping.")
            all_files_exist = False

    return all_files_exist

# Run preflight check
if preflight_check():
    print("All necessary files are present. Ready to start the render pipeline.")
else:
    print("Preflight check failed. Please ensure all required files are in place.")
