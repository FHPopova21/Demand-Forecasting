"""
Prediction utilities wrapping the trained Keras model.
"""
from __future__ import annotations
from typing import Union
import numpy as np
from ml.model_loader import load_model


def _ensure_2d(arr: np.ndarray) -> np.ndarray:
    arr = np.asarray(arr)
    if arr.ndim == 1:
        return arr.reshape(1, -1)
    return arr


def predict(preprocessed_features: np.ndarray) -> Union[float, list]:
    """
    Run inference and return a scalar (if batch size 1) or list of floats (for batch).
    """
    artifacts = load_model()
    x = _ensure_2d(preprocessed_features).astype("float32")
    preds = artifacts.model.predict(x, verbose=0)
    preds = np.asarray(preds).reshape(-1)
    if preds.size == 1:
        return float(preds[0])
    return preds.tolist()


__all__ = ["predict"]

