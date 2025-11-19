"""
Model loader for the demand-forecasting MLP.

This module centralizes loading of the trained Keras model and the
preprocessing assets (scaler, label encoders, feature order).
"""

from __future__ import annotations

import os
import pickle
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path
from typing import Any, Dict, Iterable
from keras import ops  # noqa: E402
from keras.models import load_model as keras_load_model  # noqa: E402


PROJECT_ROOT = Path(__file__).resolve().parents[1]
MODELS_DIR = PROJECT_ROOT / "models"
TRAINED_MODELS_DIR = MODELS_DIR / "trained_models"
PREPROCESSING_DIR = MODELS_DIR / "preprocessing"

MODEL_PATH = TRAINED_MODELS_DIR / "best_mlp_model.keras"
SCALER_PATH = PREPROCESSING_DIR / "scaler.pkl"
ENCODERS_PATH = PREPROCESSING_DIR / "label_encoders.pkl"
FEATURES_PATH = PREPROCESSING_DIR / "feature_list.pkl"


def root_mean_squared_error(y_true, y_pred):
    """Custom metric required to deserialize the saved model."""
    return ops.sqrt(ops.mean(ops.square(y_pred - y_true)))


@dataclass(frozen=True)
class ModelArtifacts:
    model: Any
    scaler: Any
    label_encoders: Dict[str, Any]
    feature_order: Iterable[str]


@lru_cache(maxsize=1)
def load_model_assets() -> ModelArtifacts:
    """Load model and preprocessing assets once and cache them."""
    with open(SCALER_PATH, "rb") as f:
        scaler = pickle.load(f)

    with open(ENCODERS_PATH, "rb") as f:
        label_encoders: Dict[str, Any] = pickle.load(f)

    with open(FEATURES_PATH, "rb") as f:
        feature_data = pickle.load(f)
        if isinstance(feature_data, dict):
            feature_order = feature_data.get("feature_cols") or feature_data.get("all_features") or []
        else:
            feature_order = feature_data

        if not feature_order:
            raise ValueError("Feature list is empty or missing in feature_list.pkl")

        feature_order = list(feature_order)

    model = keras_load_model(
        MODEL_PATH,
        custom_objects={"root_mean_squared_error": root_mean_squared_error},
        compile=False,
    )

    return ModelArtifacts(
        model=model,
        scaler=scaler,
        label_encoders=label_encoders,
        feature_order=feature_order,
    )


def load_model_wrapper() -> ModelArtifacts:
    """Public wrapper to match the expected import name."""
    return load_model_assets()


# Backwards-compatible name expected by Flask integration sample
def load_model():
    return load_model_wrapper()

__all__ = ["ModelArtifacts", "load_model", "load_model_assets"]

