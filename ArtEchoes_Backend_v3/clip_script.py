import sys
import torch
from PIL import Image
import pillow_avif  # Import AVIF support
from clip import load, tokenize

def classify_image(image_path):
    device = "cuda" if torch.cuda.is_available() else "cpu"
    model, preprocess = load("ViT-B/32", device=device)

    # Open image with AVIF support
    try:
        image = Image.open(image_path)
        image = preprocess(image).unsqueeze(0).to(device)
    except Exception as e:
        print(f"Error opening image: {e}")
        return None

    # Extended list of art categories
    tokens = tokenize([
        "oil painting", "watercolor", "acrylic painting", "sketch", "digital art", "sculpture",
        "photography", "mixed media", "collage", "abstract art", "impressionism",
        "pop art", "minimalism", "conceptual art", "printmaking", "portrait painting",
        "landscape painting", "modern art", "street art", "realism", "surrealism"
    ]).to(device)

    with torch.no_grad():
        image_features = model.encode_image(image)
        text_features = model.encode_text(tokens)
        logits = (image_features @ text_features.T).softmax(dim=-1)
        probs = logits.cpu().numpy()

    categories = [
        "oil painting", "watercolor", "acrylic painting", "sketch", "digital art", "sculpture",
        "photography", "mixed media", "collage", "abstract art", "impressionism",
        "pop art", "minimalism", "conceptual art", "printmaking", "portrait painting",
        "landscape painting", "modern art", "street art", "realism", "surrealism"
    ]

    return categories[probs.argmax()]

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python script.py <image_path>")
    else:
        print(classify_image(sys.argv[1]))
