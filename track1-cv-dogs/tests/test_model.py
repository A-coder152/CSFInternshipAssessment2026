import numpy as np
from src.model import DogEmbedder
import os
import glob
import cv2

def test_model_embeddings():
    print("Testing DogEmbedder with color_histogram...")
    embedder = DogEmbedder(method='color_histogram')
    
    # Use downloaded images
    image_paths = glob.glob("track1-cv-dogs/data/raw/*.jpg")
    if not image_paths:
        print("No images found in track1-cv-dogs/data/raw. Did you run src/download_data.py?")
        return

    for img_path in image_paths:
        embedding = embedder.extract_embedding(img_path)
        print(f"Image: {os.path.basename(img_path)}, Embedding Shape: {embedding.shape}")
        assert embedding.shape == (512,) # 8*8*8 for color histogram
    
    print("Color histogram test passed!")

def test_orb_embedding():
    print("Testing DogEmbedder with ORB...")
    embedder = DogEmbedder(method='orb')

    # Use downloaded images
    image_paths = glob.glob("track1-cv-dogs/data/raw/*.jpg")
    if not image_paths:
        print("No images found in track1-cv-dogs/data/raw. Did you run src/download_data.py?")
        return

    for img_path in image_paths:
        embedding = embedder.extract_embedding(img_path)
        print(f"Image: {os.path.basename(img_path)}, Embedding Shape: {embedding.shape}")
        # ORB descriptors are 32-byte (256-bit) each.
        # We are taking the mean of 500 descriptors (if found) so the shape should be (32,)
        assert embedding.shape == (32,) or embedding.shape == (500*32,), "ORB embedding shape mismatch"
    
    print("ORB embedding test passed!")


if __name__ == "__main__":
    test_model_embeddings()
    test_orb_embedding()
