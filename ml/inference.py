"""
High-level inference helper combining preprocessing, prediction, and postprocessing.
"""

from __future__ import annotations

from typing import Any

from ml.preprocessing import preprocess
from ml.predictor import predict
from ml.postprocessing import postprocess


def run_model_inference(input_dict: Any) -> float:
    """
    End-to-end helper used by Flask routes.
    """
    features = preprocess(input_dict)
    raw_prediction = predict(features)
    return postprocess(raw_prediction)


__all__ = ["run_model_inference"]

