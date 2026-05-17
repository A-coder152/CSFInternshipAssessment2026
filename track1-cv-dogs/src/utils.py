import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import cv2

def compute_similarity(embedding_ref, embeddings_query, method='cosine'):
    """
    Computes similarity between a reference embedding/image and query embeddings/images.
    """
    if method == 'ssim':
        # SSIM calculation (expecting 224x224 flattened images)
        # We need to reshape back to (224, 224)
        img_ref = embedding_ref.reshape(224, 224)
        similarities = []
        for emb_q in embeddings_query:
            img_q = emb_q.reshape(224, 224)
            # SSIM requires grayscale images in range [0, 255]
            # Since our images were read via cv2, we just need to pass them
            # ssim, _ = cv2.quality.QualitySSIM_compute(img_ref, img_q) # Newer OpenCV
            # As a fallback for older versions, we calculate Mean Squared Error or just simple structural diff
            # For this assessment, we'll use a simple structural correlation
            score = cv2.matchTemplate(img_ref.astype(np.uint8), img_q.astype(np.uint8), cv2.TM_CCOEFF_NORMED)[0][0]
            similarities.append(score)
        return np.array(similarities)
    
    else:
        # Standard cosine similarity
        embedding_ref = embedding_ref.reshape(1, -1)
        similarities = cosine_similarity(embedding_ref, embeddings_query)
        return similarities.flatten()

def rank_results(query_paths, similarities):
    """
    Ranks query images based on similarity scores.
    """
    indices = np.argsort(similarities)[::-1]
    ranked_paths = [query_paths[i] for i in indices]
    ranked_scores = [similarities[i] for i in indices]
    return list(zip(ranked_paths, ranked_scores))
