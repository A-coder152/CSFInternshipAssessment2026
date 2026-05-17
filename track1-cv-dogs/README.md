# Dog Re-Identification (ReID) Pipeline

This project aims to identify individual dogs across different images using fine-grained visual features.

## Approach

1.  **Feature Extraction:** A `DogEmbedder` class is implemented to extract embeddings. It supports:
    *   **ResNet-50:** A pre-trained CNN for robust feature extraction (requires `torch`).
    *   **Color Histogram:** A baseline method using OpenCV for environments without `torch` or for simpler analysis.
    *   **ORB:** An alternative feature detector and descriptor (requires `opencv-python`).
    If `torch` is not available, the system automatically falls back to `color_histogram`.
2.  **Similarity Metric:** Cosine Similarity is used to compare embeddings.
3.  **Ranking:** Query images are ranked based on their similarity to the reference image.

## Setup

1.  **Install dependencies:**
    ```bash
    pip install -r track1-cv-dogs/requirements.txt
    ```
    *Note: If encountering issues with `torch` installation or `externally-managed-environment`, refer to Python's virtual environment documentation or install with `--break-system-packages` as a last resort.*
2.  **Download Sample Data:**
    ```bash
    python3 track1-cv-dogs/src/download_data.py
    ```
    This will populate the `track1-cv-dogs/data/raw/` directory with sample dog images.

## Usage

### Run the Re-Identification Pipeline

To run the re-identification pipeline and see ranked results:

```bash
python3 track1-cv-dogs/src/pipeline.py --reference_image <path_to_ref_img> --query_dir <path_to_query_dir> --method <feature_method> [--visualize]
```
**Example:**
```bash
python3 track1-cv-dogs/src/pipeline.py --reference_image track1-cv-dogs/data/raw/dog_a_1.jpg --query_dir track1-cv-dogs/data/raw --method color_histogram --visualize
```
-   `--reference_image`: Path to the reference image (default: `track1-cv-dogs/data/raw/dog_a_1.jpg`).
-   `--query_dir`: Path to the directory containing query images (default: `track1-cv-dogs/data/raw`).
-   `--method`: Feature extraction method (`resnet50`, `color_histogram`, `orb`). Default is `color_histogram`.
-   `--visualize`: (Optional) Flag to display a visualization of the reference image and top-ranked query images.

### Run the Evaluation Script

The `evaluate.py` script provides a wrapper to run the pipeline and can be extended for metric calculation.

```bash
python3 track1-cv-dogs/src/evaluate.py --reference_image <path_to_ref_img> --query_dir <path_to_query_dir> --method <feature_method> [--visualize]
```
**Example:**
```bash
python3 track1-cv-dogs/src/evaluate.py --reference_image track1-cv-dogs/data/raw/dog_a_1.jpg --query_dir track1-cv-dogs/data/raw --method orb --visualize
```
The arguments are the same as for `pipeline.py`.

## Dataset

Currently, the pipeline uses a small set of sample dog images downloaded via `src/download_data.py`. For comprehensive evaluation, users are encouraged to source or prepare their own dataset as outlined in `BRIEF.md`.

