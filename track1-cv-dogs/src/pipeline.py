import os
import glob
import numpy as np
import argparse
import matplotlib.pyplot as plt
import cv2
from src.model import DogEmbedder
from src.utils import compute_similarity, rank_results

def visualize_results(reference_image_path, ranked_results, num_display=5):
    plt.figure(figsize=(15, 6))

    # Display reference image
    ref_img = cv2.imread(reference_image_path)
    ref_img = cv2.cvtColor(ref_img, cv2.COLOR_BGR2RGB)
    plt.subplot(1, num_display + 1, 1)
    plt.imshow(ref_img)
    plt.title(f"Reference:\n{os.path.basename(reference_image_path)}")
    plt.axis('off')

    # Display top ranked query images
    for i, (query_path, score) in enumerate(ranked_results[:num_display]):
        query_img = cv2.imread(query_path)
        query_img = cv2.cvtColor(query_img, cv2.COLOR_BGR2RGB)
        plt.subplot(1, num_display + 1, i + 2)
        plt.imshow(query_img)
        plt.title(f"Rank {i+1}: {os.path.basename(query_path)}\nScore: {score:.4f}")
        plt.axis('off')
    
    plt.tight_layout()
    plt.show()

def run_pipeline(reference_image_path, query_dir, method='color_histogram'):
    print(f"Running ReID pipeline using {method}...")
    embedder = DogEmbedder(method=method)
    
    # Extract reference embedding
    ref_embedding = embedder.extract_embedding(reference_image_path)
    
    # Extract query embeddings
    query_paths = glob.glob(os.path.join(query_dir, "*.jpg"))
    # Exclude the reference image if it's in the query dir
    query_paths = [p for p in query_paths if os.path.abspath(p) != os.path.abspath(reference_image_path)]
    
    if not query_paths:
        print("No query images found.")
        return []
    
    query_embeddings = []
    valid_query_paths = []
    for path in query_paths:
        try:
            emb = embedder.extract_embedding(path)
            query_embeddings.append(emb)
            valid_query_paths.append(path)
        except Exception as e:
            print(f"Skipping {path}: {e}")
            
    query_embeddings = np.array(query_embeddings)
    
    # Compute similarities
    similarities = compute_similarity(ref_embedding, query_embeddings, method=method)
    
    # Rank results
    results = rank_results(valid_query_paths, similarities)
    
    return results

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Run dog re-identification pipeline.")
    parser.add_argument("--reference_image", type=str, default="track1-cv-dogs/data/raw/dog_a_1.jpg",
                        help="Path to the reference image.")
    parser.add_argument("--query_dir", type=str, default="track1-cv-dogs/data/raw",
                        help="Path to the directory containing query images.")
    parser.add_argument("--method", type=str, default="color_histogram",
                        choices=['resnet50', 'color_histogram', 'orb', 'ssim'],
                        help="Feature extraction method to use.")
    parser.add_argument("--visualize", action="store_true", help="Visualize the results.")
    
    args = parser.parse_args()
    
    results = run_pipeline(args.reference_image, args.query_dir, args.method)
    
    print(f"\nResults for reference: {os.path.basename(args.reference_image)}")
    if results:
        for path, score in results:
            print(f"{os.path.basename(path)}: {score:.4f}")
        
        if args.visualize:
            visualize_results(args.reference_image, results)
    else:
        print("No results to display.")
