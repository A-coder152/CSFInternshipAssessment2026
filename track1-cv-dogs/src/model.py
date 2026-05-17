import numpy as np
import cv2
from PIL import Image

try:
    import torch
    import torch.nn as nn
    import torchvision.models as models
    import torchvision.transforms as transforms
    HAS_TORCH = True
except ImportError:
    HAS_TORCH = False

class DogEmbedder:
    def __init__(self, method='color_histogram'):
        self.method = method
        if method == 'resnet50' and HAS_TORCH:
            base_model = models.resnet50(pretrained=True)
            self.feature_extractor = nn.Sequential(*list(base_model.children())[:-1])
            self.feature_extractor.eval()
            self.preprocess = transforms.Compose([
                transforms.Resize(256),
                transforms.CenterCrop(224),
                transforms.ToTensor(),
                transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
            ])
        elif method == 'color_histogram':
            # No initialization needed for color histogram
            pass
        elif method == 'orb':
            self.orb = cv2.ORB_create(nfeatures=500)
        else:
            if method == 'resnet50' and not HAS_TORCH:
                print("Warning: Torch not found. Falling back to color_histogram.")
                self.method = 'color_histogram'
            else:
                raise ValueError(f"Unsupported method: {method}")

    def extract_embedding(self, image_path):
        image_cv = cv2.imread(image_path)
        if image_cv is None:
            raise ValueError(f"Could not read image at {image_path}")
        
        if self.method == 'resnet50' and HAS_TORCH:
            image_pil = Image.fromarray(cv2.cvtColor(image_cv, cv2.COLOR_BGR2RGB))
            image_tensor = self.preprocess(image_pil).unsqueeze(0)
            with torch.no_grad():
                features = self.feature_extractor(image_tensor)
                features = torch.flatten(features, 1)
            return features.squeeze(0).numpy()
        
        elif self.method == 'color_histogram':
            # Compute a simple 3D color histogram
            hsv = cv2.cvtColor(image_cv, cv2.COLOR_BGR2HSV)
            hist = cv2.calcHist([hsv], [0, 1, 2], None, [8, 8, 8], [0, 180, 0, 256, 0, 256])
            cv2.normalize(hist, hist)
            return hist.flatten()
        
        elif self.method == 'orb':
            # This is a bit more complex as ORB returns multiple descriptors
            # We'll use a Bag of Words approach or just a simple mean for now (very crude)
            keypoints, descriptors = self.orb.detectAndCompute(image_cv, None)
            if descriptors is None:
                return np.zeros((500 * 32,)) # ORB descriptor size is 32
            # For a simple embedding, we'll just take the mean of descriptors
            # In a real system, we'd use a visual vocabulary
            return np.mean(descriptors, axis=0)
        
        return None
