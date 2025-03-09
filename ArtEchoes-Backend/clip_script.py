import sys
import torch
from PIL import Image
from clip import load, tokenize

def classify_image(image_path):
    device = "cuda" if torch.cuda.is_available() else "cpu"
    model, preprocess = load("ViT-B/32", device=device)
    
    image = preprocess(Image.open(image_path)).unsqueeze(0).to(device)
    text = tokenize(["oil painting",
    "watercolor",
    "sketch",
    "digital art",
    "sculpture",
    "photography",
    "mixed media",
    "collage",
    "abstract art",
    "impressionism",
    "pop art",
    "minimalism",
    "conceptual art",
    "printmaking"]).to(device)
    
    with torch.no_grad():
        image_features = model.encode_image(image)
        text_features = model.encode_text(text)
        
        logits = (image_features @ text_features.T).softmax(dim=-1)
        probs = logits.cpu().numpy()
    
    return ["oil painting",
    "watercolor",
    "sketch",
    "digital art",
    "sculpture",
    "photography",
    "mixed media",
    "collage",
    "abstract art",
    "impressionism",
    "pop art",
    "minimalism",
    "conceptual art",
    "printmaking"][probs.argmax()]

if __name__ == "__main__":
    print(classify_image(sys.argv[1]))