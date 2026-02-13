from PIL import Image
import os

def resize_icon():
    input_path = "assets/images/logo.png"
    output_path = "assets/images/adaptive-icon.png"
    
    # Standard Adaptive Icon size (1024x1024)
    canvas_size = (1024, 1024)
    
    # We want the logo to be about 60% of the canvas to be safe
    # 1024 * 0.6 = ~614px
    target_logo_size = (614, 614)
    
    try:
        # Open the logo
        img = Image.open(input_path).convert("RGBA")
        
        # Calculate aspect ratio to keep it valid
        img.thumbnail(target_logo_size, Image.Resampling.LANCZOS)
        
        # Create a new blank (black) canvas
        # You can change (0, 0, 0, 255) to (0,0,0,0) for transparent if you prefer
        # But generally adaptive icons have a background layer color defined in app.json
        # Let's use transparent so the background color in app.json (#000000) shows through
        canvas = Image.new("RGBA", canvas_size, (0, 0, 0, 0))
        
        # Paste logo in the center
        x = (canvas_size[0] - img.width) // 2
        y = (canvas_size[1] - img.height) // 2
        
        canvas.paste(img, (x, y), img)
        
        # Save
        canvas.save(output_path)
        print(f"Successfully created {output_path}")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    resize_icon()
