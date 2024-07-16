import bpy
import os
import sys
import csv
import requests

# Set the project root directory
PROJECT_ROOT = '/home/ubuntu/ad-creator-fs-az'

# Function to enable GPUs
def enable_gpus(device_type, use_cpus=False, sku='TEST'):
    preferences = bpy.context.preferences
    cycles_preferences = preferences.addons['cycles'].preferences
    cycles_preferences.refresh_devices()

    # Print the devices list for debugging
    devices_list = cycles_preferences.devices
    print(f"Devices list: {devices_list}")

    # Unpack devices accordingly
    cuda_devices = [dev for dev in devices_list if dev.type == 'CUDA']
    opencl_devices = [dev for dev in devices_list if dev.type == 'OPENCL']
    metal_devices = [dev for dev in devices_list if dev.type == 'METAL']

    if device_type == "CUDA":
        devices = cuda_devices
        print("Setting to use CUDA Devices:")
    elif device_type == "OPENCL":
        devices = opencl_devices
        print("Setting to use OpenCL Devices:")
    elif device_type == "METAL":
        devices = metal_devices
        print("Setting to use Metal Devices:")
    else:
        raise RuntimeError("Unsupported device type")

    if not devices:
        print("No compatible devices found. Exiting.")
        sys.exit(1)

    # Ensure we have at least one GPU device available
    if all(device.type == 'CPU' for device in devices):
        print("Only CPU devices found. Exiting.")
        sys.exit(1)

    # Activation of devices
    activated_gpus = []

    for device in devices:
        if device.type == "CPU":
            device.use = use_cpus
        else:
            device.use = True
            activated_gpus.append(device.name)

    cycles_preferences.compute_device_type = device_type
    bpy.context.scene.cycles.device = "GPU"

    print(f"{len(activated_gpus)} devices activated: {activated_gpus}")

    # Set the target directory based on the SKU and ensure it exists
    output_directory =  os.path.join(PROJECT_ROOT, f"public/renders/{sku}/")
    if not os.path.exists(output_directory):
        os.makedirs(output_directory)
        print(f"Created directory: {output_directory}")

    # Set the render output directory and filename
    bpy.context.scene.render.filepath = os.path.join(output_directory, f"{sku}_")

    # Additional settings (optional, e.g., file format)
    bpy.context.scene.render.image_settings.file_format = 'JPEG'

    return activated_gpus

# Detect available device types and prefer Metal if on Mac
if sys.platform == "darwin":
    default_device_type = "METAL"
else:
    default_device_type = "CUDA"  # Adjust as necessary for other platforms

def hex_to_rgb(hex_color):
    """Convert hex color string to RGB tuple in range [0, 1] with linear conversion."""
    hex_color = hex_color.lstrip('#')
    rgb = tuple(int(hex_color[i:i+2], 16) / 255.0 for i in (0, 2, 4))
    return tuple(c ** 2.2 for c in rgb)  # Convert sRGB to Linear

def download_image(url, save_path):
    """Download an image from a URL and save it locally."""
    response = requests.get(url)
    if response.status_code == 200:
        with open(save_path, 'wb') as f:
            f.write(response.content)
        print(f"Downloaded image from {url} to {save_path}")
    else:
        print(f"Failed to download image from {url}")

def change_texture(mesh_name, texture_url):
    """Change the image texture of a mesh to the image at texture_url."""
    local_texture_path = os.path.join(PROJECT_ROOT, os.path.basename(texture_url))
    download_image(texture_url, local_texture_path)
    mesh = bpy.data.objects.get(mesh_name)
    if mesh is not None and len(mesh.data.materials) > 0:
        for mat in mesh.data.materials:
            for node in mat.node_tree.nodes:
                if node.type == 'TEX_IMAGE':
                    # Load new texture image
                    node.image = bpy.data.images.load(local_texture_path)

def set_output_directory(sku):
    output_path = os.path.join(PROJECT_ROOT, f"public/renders/{sku}/")
    if not os.path.exists(output_path):
        os.makedirs(output_path)
    bpy.context.scene.render.filepath = os.path.join(output_path, f"{sku}_0")

def set_material_color(material_name, hex_color):
    """Set the material color of the specified material."""
    rgb_color = hex_to_rgb(hex_color)
    material = bpy.data.materials.get(material_name)
    if material and material.node_tree:
        bsdf = material.node_tree.nodes.get("Principled BSDF")
        if bsdf:
            bsdf.inputs['Base Color'].default_value = (*rgb_color, 1.0)

# Function to process a single SKU
def process_sku(row):
    sku = row['sku']
    colour = row['colour']

    # Set environment variables
    os.environ['SKU'] = sku
    os.environ['COLOUR'] = colour

    # List of required environment variables
    required_env_vars = ['SKU', 'COLOUR']

    # Check if all required environment variables are set
    for var in required_env_vars:
        if var not in os.environ:
            print(f"Error: Required environment variable '{var}' is not set for SKU '{sku}'. Skipping.")
            return

    # Change the material color for a specified material (e.g., 'capsule_contents.002')
    set_material_color('rough_powder.001', colour)  # Change 'capsule_contents.002' to the actual material name
    set_material_color('smooth_powder.001', colour)  # Change 'capsule_contents.002' to the actual material name

    # Run the script using the environment variable provided SKU
    activated_gpus = enable_gpus(default_device_type, sku=sku)
    print(f"Activated GPUs: {activated_gpus}")

    front_label_image_url = f"https://media.fitnesshealth.co/sku/{sku}/{sku}_label_front.png"
    back_label_image_url = f"https://media.fitnesshealth.co/sku/{sku}/{sku}_label_back.png"

    change_texture('pouch_front', front_label_image_url)
    change_texture('pouch_back', back_label_image_url)

    set_output_directory(sku)

    bpy.ops.wm.save_mainfile()

    # Render the animation
    bpy.ops.render.render(animation=True)

# Read SKU information from CSV
csv_file_path = os.path.join(PROJECT_ROOT, 'public/sku/data/selected_products.fh.powder.csv')
with open(csv_file_path, 'r') as file:
    csv_reader = csv.DictReader(file)
    for row in csv_reader:
        process_sku(row)
