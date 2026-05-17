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

## Deliverables

Submit a link to a git repository containing the following. **Time window: 5–7 days.**

### 1. Working Prototype

A runnable pipeline with a clear entry point (e.g. a script or notebook). It should:
- Accept a reference image and a set of query images
- Return a ranked list or similarity scores indicating which queries match the reference
- Include a `README.md` with setup and usage instructions

You may use any framework (PyTorch, HuggingFace, TensorFlow, OpenCV, etc.).

### 2. Evaluation

Evaluate your pipeline on your chosen dataset. Include:
- The metric(s) you chose and why (e.g. Rank-1 accuracy, mAP, threshold-based precision/recall)
- Results on both positive matches (same dog) and negative matches (different dogs)
- At least **one visualisation** of results — show cases where the system succeeds and where it fails

### 3. Written Report (`REPORT.md`, ~500 words)

Address the following:

- **Approach:** What did you build and why? Walk through your key design decisions (feature extractor, similarity metric, embedding strategy, etc.)
- **Failure modes:** Identify at least **two specific failure modes** you observed. For each, propose a concrete mitigation.
- **Generalisation:** If you were applying this pipeline to a different species with far less publicly available data (e.g. sheep), what would need to change? What assumptions in your current approach would break?

## Dataset

Currently, the pipeline uses a small set of sample dog images downloaded via `src/download_data.py`. For comprehensive evaluation, users are encouraged to source or prepare their own dataset as outlined in `BRIEF.md`.

