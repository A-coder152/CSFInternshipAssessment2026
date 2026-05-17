# Dog Re-Identification Pipeline Report

## Approach

*   **Feature Extractor:** Currently implemented `DogEmbedder` with `color_histogram` and `orb` baselines. `resnet50` is also integrated but requires `torch` installation.
    *   **color_histogram:** Provides a simple, robust baseline by quantifying pixel color distribution.
    *   **ORB:** Detects distinctive keypoints and generates descriptors, suitable for identifying distinct textures and shapes.
    *   **ResNet-50:** A deep learning model for advanced feature extraction, expected to perform better with sufficient data.
*   **Similarity Metric:** Cosine similarity for comparing feature embeddings.
*   **Ranking:** Query images are ranked by similarity score to the reference image.

## Failure Modes

(To be identified and mitigated through experimentation)

## Generalisation

(To be considered after initial experimentation and evaluation)