import bpy
import os
import sys

# Get the SKU from an environment variable
sku = os.getenv('SKU', 'TEST')  # Use 'TEST' as default value if SKU is not set

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
    output_directory = f"/tmp/{sku}/"
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

# Run the script using the environment variable provided SKU
activated_gpus = enable_gpus(default_device_type, sku=sku)
print(f"Activated GPUs: {activated_gpus}")