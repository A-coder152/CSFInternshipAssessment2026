import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

def compute_similarity(embedding_ref, embeddings_query):
    """
    Computes cosine similarity between a reference embedding and a list of query embeddings.
    
    Args:
        embedding_ref: 1D numpy array (embedding_size,)
        embeddings_query: 2D numpy array (num_queries, embedding_size)
        
    Returns:
        Similarities: 1D numpy array (num_queries,)
    """
    # Ensure embedding_ref is 2D for cosine_similarity
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
