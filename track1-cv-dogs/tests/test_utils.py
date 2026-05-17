import numpy as np
from src.utils import compute_similarity, rank_results

def test_compute_similarity():
    print("Testing compute_similarity...")
    # Test case 1: Identical embeddings
    emb_ref_1 = np.array([1.0, 0.0, 0.0])
    emb_query_1 = np.array([[1.0, 0.0, 0.0], [0.0, 1.0, 0.0]])
    sims_1 = compute_similarity(emb_ref_1, emb_query_1)
    assert np.allclose(sims_1, [1.0, 0.0]), f"Test Case 1 Failed: {sims_1}"
    print("Test Case 1 Passed.")

    # Test case 2: Orthogonal embeddings
    emb_ref_2 = np.array([1.0, 0.0])
    emb_query_2 = np.array([[0.0, 1.0]])
    sims_2 = compute_similarity(emb_ref_2, emb_query_2)
    assert np.allclose(sims_2, [0.0]), f"Test Case 2 Failed: {sims_2}"
    print("Test Case 2 Passed.")

    # Test case 3: Mixed similarities
    emb_ref_3 = np.array([1.0, 1.0])
    emb_query_3 = np.array([[1.0, 1.0], [-1.0, -1.0], [1.0, 0.0]])
    sims_3 = compute_similarity(emb_ref_3, emb_query_3)
    # Cosine similarity for [1,1] with [-1,-1] is -1. For [1,0] is 0.707
    expected_3 = [1.0, -1.0, 0.70710678]
    assert np.allclose(sims_3, expected_3), f"Test Case 3 Failed: {sims_3}"
    print("Test Case 3 Passed.")

def test_rank_results():
    print("\nTesting rank_results...")
    query_paths = ["img_a.jpg", "img_b.jpg", "img_c.jpg"]
    similarities = np.array([0.7, 0.9, 0.5])
    ranked = rank_results(query_paths, similarities)
    expected_ranked = [("img_b.jpg", 0.9), ("img_a.jpg", 0.7), ("img_c.jpg", 0.5)]
    assert ranked == expected_ranked, f"Ranking Test Failed: {ranked}"
    print("Ranking Test Passed.")

if __name__ == "__main__":
    test_compute_similarity()
    test_rank_results()
