#!/usr/bin/env python3
"""
Icon Processing Script for React Native/Expo App
This script helps convert and resize images for app icons.

Requirements:
- Python 3.6+
- Pillow (PIL): pip install Pillow

Usage:
1. Place your source image in the assets folder
2. Run: python process_icon.py <source_image_name>
3. The script will generate all required icon sizes
"""

import os
import sys
from PIL import Image, ImageOps

def create_icon_variants(source_path, output_dir):
    """Create all required icon variants from source image."""
    
    try:
        # Open and process the source image
        with Image.open(source_path) as img:
            # Convert to RGBA for transparency support
            if img.mode != 'RGBA':
                img = img.convert('RGBA')
            
            # Create square aspect ratio by center cropping
            size = min(img.width, img.height)
            left = (img.width - size) // 2
            top = (img.height - size) // 2
            right = left + size
            bottom = top + size
            img = img.crop((left, top, right, bottom))
            
            # Generate main icon (1024x1024)
            main_icon = img.resize((1024, 1024), Image.Resampling.LANCZOS)
            main_icon.save(os.path.join(output_dir, 'icon.png'), 'PNG', optimize=True)
            
            # Generate adaptive icon (1024x1024)
            adaptive_icon = img.resize((1024, 1024), Image.Resampling.LANCZOS)
            adaptive_icon.save(os.path.join(output_dir, 'adaptive-icon.png'), 'PNG', optimize=True)
            
            # Generate favicon (smaller version)
            favicon = img.resize((256, 256), Image.Resampling.LANCZOS)
            favicon.save(os.path.join(output_dir, 'favicon.png'), 'PNG', optimize=True)
            
            # Generate splash icon (if needed)
            splash_icon = img.resize((512, 512), Image.Resampling.LANCZOS)
            splash_icon.save(os.path.join(output_dir, 'splash-icon.png'), 'PNG', optimize=True)
            
            print("✅ Successfully generated all icon variants!")
            print(f"   - icon.png (1024x1024)")
            print(f"   - adaptive-icon.png (1024x1024)")
            print(f"   - favicon.png (256x256)")
            print(f"   - splash-icon.png (512x512)")
            
    except Exception as e:
        print(f"❌ Error processing image: {e}")
        return False
    
    return True

def main():
    if len(sys.argv) != 2:
        print("Usage: python process_icon.py <source_image_name>")
        print("Example: python process_icon.py my_icon.jpg")
        return
    
    source_name = sys.argv[1]
    assets_dir = "assets"
    source_path = os.path.join(assets_dir, source_name)
    
    if not os.path.exists(source_path):
        print(f"❌ Source image not found: {source_path}")
        print(f"📁 Available files in {assets_dir}:")
        if os.path.exists(assets_dir):
            for file in os.listdir(assets_dir):
                if file.lower().endswith(('.jpg', '.jpeg', '.png', '.bmp', '.tiff')):
                    print(f"   - {file}")
        return
    
    print(f"🔄 Processing icon: {source_name}")
    success = create_icon_variants(source_path, assets_dir)
    
    if success:
        print("\n🎯 Next steps:")
        print("1. Clean the old icon files if needed")
        print("2. Rebuild your app: npm run android")
        print("3. The new icons will be applied!")

if __name__ == "__main__":
    main()
