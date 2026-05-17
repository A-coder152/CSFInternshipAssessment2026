import os
import glob
import argparse
import numpy as np
from src.pipeline import run_pipeline

# Ground truth mapping: file_name -> label
GROUND_TRUTH = {
    "dog_a_1.jpg": "dog_a", "dog_a_2.jpg": "dog_a",
    "dog_b_1.jpg": "dog_b", "dog_b_2.jpg": "dog_b",
    "dog_c_1.jpg": "dog_c"
}

def calculate_rank_n(ranked_results, reference_label, n=1):
    top_n = ranked_results[:n]
    for path, _ in top_n:
        filename = os.path.basename(path)
        if GROUND_TRUTH.get(filename) == reference_label:
            return 1
    return 0

def evaluate_pipeline(reference_image_path, query_dir, method='color_histogram', visualize=False):
    print(f"Starting evaluation using {method}...")
    
    # Run pipeline
    results = run_pipeline(reference_image_path, query_dir, method)
    
    ref_filename = os.path.basename(reference_image_path)
    ref_label = GROUND_TRUTH.get(ref_filename)
    
    print(f"\n--- Evaluation Results for Reference: {ref_filename} (Label: {ref_label}) ---")
    
    if results:
        # Calculate Ranks
        rank1 = calculate_rank_n(results, ref_label, n=1)
        rank5 = calculate_rank_n(results, ref_label, n=5)
        
        print(f"Rank-1 Accuracy: {rank1}")
        print(f"Rank-5 Accuracy: {rank5}")
        
        for i, (path, score) in enumerate(results[:5]):
            print(f"Rank {i+1}: {os.path.basename(path)} (Score: {score:.4f})")
        
        if visualize:
            from src.pipeline import visualize_results
            visualize_results(reference_image_path, results)
            
        return {"rank1": rank1, "rank5": rank5}
    else:
        print("No results to display.")
        return None

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Evaluate dog re-identification pipeline.")
    parser.add_argument("--reference_image", type=str, default="track1-cv-dogs/data/raw/dog_a_1.jpg",
                        help="Path to the reference image.")
    parser.add_argument("--query_dir", type=str, default="track1-cv-dogs/data/raw",
                        help="Path to the directory containing query images.")
    parser.add_argument("--method", type=str, default="color_histogram",
                        choices=['resnet50', 'color_histogram', 'orb', 'ssim'],
                        help="Feature extraction method to use.")
    parser.add_argument("--visualize", action="store_true", help="Visualize the results.")
    
    args = parser.parse_args()
    
    evaluate_pipeline(args.reference_image, args.query_dir, args.method, args.visualize)
