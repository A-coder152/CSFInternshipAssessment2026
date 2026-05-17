import urllib.request
import os

# Sample dog images from Unsplash (public domain)
# I'll use 2 images of "dog1", 2 of "dog2", and 1 of "dog3"
dog_samples = [
    # Dog A (Golden Retriever-like)
    {"url": "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=400", "label": "dog_a", "id": "1"},
    {"url": "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=400", "label": "dog_a", "id": "2"},
    # Dog B (Husky-like)
    {"url": "https://images.unsplash.com/photo-1560743641-3914f2c45636?auto=format&fit=crop&q=80&w=400", "label": "dog_b", "id": "1"},
    {"url": "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=400", "label": "dog_b", "id": "2"},
    # Dog C (Pug)
    {"url": "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=400", "label": "dog_c", "id": "1"},
]

def download_data():
    raw_dir = "track1-cv-dogs/data/raw"
    os.makedirs(raw_dir, exist_ok=True)
    
    for i, sample in enumerate(dog_samples):
        filename = f"{sample['label']}_{sample['id']}.jpg"
        filepath = os.path.join(raw_dir, filename)
        print(f"Downloading {filename}...")
        try:
            urllib.request.urlretrieve(sample['url'], filepath)
        except Exception as e:
            print(f"Failed to download {filename}: {e}")

if __name__ == "__main__":
    download_data()
