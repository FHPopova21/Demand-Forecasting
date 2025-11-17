"""
Prediction utilities wrapping the trained Keras model.
"""

from __future__ import annotations

import numpy as np

from ml.model_loader import load_model


def predict(preprocessed_features: np.ndarray) -> float:
    """Run inference and return a scalar prediction."""
    artifacts = load_model()
    prediction = artifacts.model.predict(preprocessed_features, verbose=0)
    return float(prediction.flatten()[0])


__all__ = ["predict"]

