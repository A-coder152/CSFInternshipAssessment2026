import os
import glob
import argparse
from src.pipeline import run_pipeline

def evaluate_pipeline(reference_image_path, query_dir, method='color_histogram', visualize=False):
    print(f"Starting evaluation using {method}...")
    results = run_pipeline(reference_image_path, query_dir, method)

    print(f"\n--- Evaluation Results for Reference: {os.path.basename(reference_image_path)} ---")
    if results:
        for path, score in results:
            print(f"{os.path.basename(path)}: {score:.4f}")
        
        if visualize:
            from src.pipeline import visualize_results # Import only if needed
            visualize_results(reference_image_path, results)
    else:
        print("No results to display.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Evaluate dog re-identification pipeline.")
    parser.add_argument("--reference_image", type=str, default="track1-cv-dogs/data/raw/dog_a_1.jpg",
                        help="Path to the reference image.")
    parser.add_argument("--query_dir", type=str, default="track1-cv-dogs/data/raw",
                        help="Path to the directory containing query images.")
    parser.add_argument("--method", type=str, default="color_histogram",
                        choices=['resnet50', 'color_histogram', 'orb'],
                        help="Feature extraction method to use.")
    parser.add_argument("--visualize", action="store_true", help="Visualize the results.")
    
    args = parser.parse_args()
    
    evaluate_pipeline(args.reference_image, args.query_dir, args.method, args.visualize)
