import os
import glob
import numpy as np
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
    # Example usage
    ref_img = "track1-cv-dogs/data/raw/dog_a_1.jpg"
    q_dir = "track1-cv-dogs/data/raw"
    
    results = run_pipeline(ref_img, q_dir)
    
    print(f"\nResults for reference: {os.path.basename(ref_img)}")
    for path, score in results:
        print(f"{os.path.basename(path)}: {score:.4f}")
