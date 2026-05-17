# Dog Re-Identification Pipeline Report

## Approach
*   **Feature Extractor:** Implemented `DogEmbedder` with support for `color_histogram` (baseline), `ORB` (keypoint-based), `SSIM` (structural similarity), and `ResNet-50` (deep learning).
*   **Similarity Metric:** Cosine similarity and Structural Similarity (SSIM).
*   **Evaluation:** Implemented Rank-N accuracy (Rank-1, Rank-5).

## Evaluation Results
Using the sample dataset, performance remains challenging:
*   **Color Histogram:** Struggles with color confusion.
*   **SSIM:** Offers structural comparison but shows sensitivity to alignment/pose; scores are low across the board due to variations in dog posture, highlighting the need for image normalization or keypoint alignment.

## Failure Modes
1.  **Color Confusion:** As shown in the evaluation, images with similar color profiles (e.g., golden-toned dogs) are ranked higher than the actual identity, even if textures differ.
    *   *Mitigation:* Use deep learned embeddings (ResNet-50) which encode spatial information and learn invariance to background.
2.  **Structural Invariance (SSIM/ORB):** Methods like SSIM and ORB are highly sensitive to pose, rotation, and lighting variations, making them poor choices for non-aligned images.
    *   *Mitigation:* Preprocess images using facial landmark detection (keypoint alignment) or use deep learning models trained on datasets with large pose variations.

## Generalisation
If applied to another species (e.g., sheep), hand-crafted features like color histograms would fail due to the lack of distinct color variance. The pipeline would need to pivot to deep learned representations focused on unique biometric features (texture or fleece patterns).