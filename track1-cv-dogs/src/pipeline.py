import os
import glob
import numpy as np
import argparse
from src.model import DogEmbedder
from src.utils import compute_similarity, rank_results

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
    similarities = compute_similarity(ref_embedding, query_embeddings)
    
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
                        choices=['resnet50', 'color_histogram', 'orb'],
                        help="Feature extraction method to use.")
    
    args = parser.parse_args()
    
    results = run_pipeline(args.reference_image, args.query_dir, args.method)
    
    print(f"\nResults for reference: {os.path.basename(args.reference_image)}")
    if results:
        for path, score in results:
            print(f"{os.path.basename(path)}: {score:.4f}")
    else:
        print("No results to display.")
