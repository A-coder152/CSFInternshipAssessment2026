# Dog Re-Identification Pipeline Report

## Approach
*   **Feature Extractor:** Implemented `DogEmbedder` with support for `color_histogram` (baseline), `ORB` (keypoint-based), and `ResNet-50` (deep learning).
*   **Similarity Metric:** Cosine similarity.
*   **Evaluation:** Implemented Rank-N accuracy (Rank-1, Rank-5) to assess top-N retrieval quality.

## Evaluation Results
Using the sample dataset, the `color_histogram` method shows mixed performance:
*   **Rank-1 Accuracy:** 0
*   **Rank-5 Accuracy:** 1
*   **Observation:** The baseline struggles with color confusion; the system frequently ranks different dogs with similar color distributions above the correct match.

## Failure Modes
1.  **Color Confusion:** As shown in the evaluation, images with similar color profiles (e.g., golden-toned dogs) are ranked higher than the actual identity, even if textures differ.
    *   *Mitigation:* Switch to structural feature descriptors (ORB/SIFT) or deep learned embeddings (ResNet-50) which encode spatial information.
2.  **Lack of Spatial Awareness:** Color histograms discard all spatial/geometric information.
    *   *Mitigation:* Use Convolutional Neural Network (CNN) embeddings, which implicitly learn spatial hierarchies and invariant features.

## Generalisation
If applied to another species (e.g., sheep), the color histogram approach would likely fail even harder due to lack of distinct color variance in coat patterns. We would need to pivot immediately to keypoint-based or deep learned representations that focus on unique biometric features (like facial landmarks or fleece texture variations) rather than global color distributions.