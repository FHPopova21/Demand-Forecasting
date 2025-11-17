"""
Backward-compatible wrappers delegating to the modular ML helpers.
"""

from __future__ import annotations

from typing import Any

import numpy as np

from ml.inference import run_model_inference
from ml.postprocessing import postprocess as postprocess_output
from ml.predictor import predict as _predict
from ml.preprocessing import preprocess as preprocess_input


def predict_value(preprocessed_features: np.ndarray) -> float:
    """Alias kept for older imports."""
    return _predict(preprocessed_features)


__all__ = [
    "preprocess_input",
    "predict_value",
    "postprocess_output",
    "run_model_inference",
]

