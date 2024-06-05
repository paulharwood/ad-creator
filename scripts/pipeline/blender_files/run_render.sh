#!/bin/bash

# Check if SKU and RS_COLOUR are provided as arguments
if [ "$#" -ne 2 ]; then
    echo "Usage: $0 SKU RS_COLOUR"
    exit 1
fi

SKU=$1
RS_COLOUR=$2

# Validate the hex color input
if [[ ! $RS_COLOUR =~ ^#([A-Fa-f0-9]{6})$ ]]; then
    echo "Invalid hex color: $RS_COLOUR"
    echo "Please provide a valid hex color in the format #RRGGBB."
    exit 1
fi

# Set the environment variables
export SKU
export RS_COLOUR

# Print the environment variables for confirmation
echo "SKU: $SKU"
echo "RS_COLOUR: $RS_COLOUR"

# Run Blender with the script
# blender -b your_blend_file.blend -P your_script.py
blender -b pouch_product.v1.blend -P ad-create-render.py
