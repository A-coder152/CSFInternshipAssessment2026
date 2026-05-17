# Dog Re-Identification (ReID) Pipeline

This project aims to identify individual dogs across different images using fine-grained visual features.

## Approach

1.  **Feature Extraction:** Use a pre-trained CNN (e.g., ResNet-50) or Vision Transformer (ViT) to extract embeddings from dog images.
2.  **Similarity Metric:** Use Cosine Similarity to compare embeddings.
3.  **Ranking:** Rank query images based on their similarity to the reference image.

## Setup

```bash
pip install -r requirements.txt
```

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

To run the re-identification pipeline:

```bash
python3 track1-cv-dogs/src/pipeline.py
```
This script will use `dog_a_1.jpg` as a reference image and search for similar dogs in `track1-cv-dogs/data/raw/`. The results will be printed to the console, showing ranked query images and their similarity scores.

You can modify the `ref_img` and `q_dir` variables in `track1-cv-dogs/src/pipeline.py` to test with different images and directories. To use a different embedding method, you can pass it to the `run_pipeline` function (e.g., `run_pipeline(ref_img, q_dir, method='orb')`).

## Dataset

Currently, the pipeline uses a small set of sample dog images downloaded via `src/download_data.py`. For comprehensive evaluation, users are encouraged to source or prepare their own dataset as outlined in `BRIEF.md`.
