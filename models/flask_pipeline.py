"""
Utility helpers for serving the trained MLP model via a Flask application.

This module loads:
    - The trained Keras model (`best_mlp_model.keras`)
    - The preprocessing pipeline components (scaler, encoders, feature order)

It exposes three functions that can be imported inside a Flask route:
    preprocess_input(data) -> np.ndarray
    predict_value(scaled_features) -> float
    postprocess_output(raw_prediction) -> float
"""

from __future__ import annotations

import os
from pathlib import Path
from typing import Any, Dict, Iterable, Mapping

import numpy as np
import pandas as pd
import pickle

# Force Keras to use the PyTorch backend (the model was trained with it)
os.environ.setdefault("KERAS_BACKEND", "torch")
from keras import ops  # noqa: E402
from keras.models import load_model  # noqa: E402


# ---- Paths -----------------------------------------------------------------
PROJECT_ROOT = Path(__file__).resolve().parents[1]
MODELS_DIR = PROJECT_ROOT / "models"
TRAINED_MODELS_DIR = MODELS_DIR / "trained_models"
PREPROCESSING_DIR = MODELS_DIR / "preprocessing"

MODEL_PATH = TRAINED_MODELS_DIR / "best_mlp_model.keras"
SCALER_PATH = PREPROCESSING_DIR / "scaler.pkl"
ENCODERS_PATH = PREPROCESSING_DIR / "label_encoders.pkl"
FEATURE_LIST_PATH = PREPROCESSING_DIR / "feature_list.pkl"


# ---- Load assets once (module import) --------------------------------------
with open(SCALER_PATH, "rb") as f:
    _SCALER = pickle.load(f)

with open(ENCODERS_PATH, "rb") as f:
    _LABEL_ENCODERS: Dict[str, Any] = pickle.load(f)

with open(FEATURE_LIST_PATH, "rb") as f:
    _FEATURE_ORDER: Iterable[str] = pickle.load(f)


def root_mean_squared_error(y_true, y_pred):
    """Custom RMSE metric used during training (needed for deserialization)."""
    return ops.sqrt(ops.mean(ops.square(y_pred - y_true)))


_MODEL = load_model(
    MODEL_PATH,
    custom_objects={"root_mean_squared_error": root_mean_squared_error},
    compile=False,
)


# ---- Helper functions ------------------------------------------------------
def _to_dataframe(data: Any) -> pd.DataFrame:
    """Convert supported input types to a single-row DataFrame."""
    if isinstance(data, pd.DataFrame):
        return data.copy()
    if isinstance(data, Mapping):
        return pd.DataFrame([data])
    if isinstance(data, Iterable):
        return pd.DataFrame(list(data))
    raise TypeError(
        "Unsupported data type for preprocessing. "
        "Provide a dict, list of dicts, or pandas DataFrame."
    )


def _safe_encode(column: str, series: pd.Series) -> pd.Series:
    """Encode categorical columns with graceful handling of unknown labels."""
    encoder = _LABEL_ENCODERS.get(column)
    if encoder is None:
        return series

    # Ensure string dtype for consistency with fitted encoder
    values = series.fillna("UNKNOWN").astype(str).tolist()
    known_classes = set(encoder.classes_)

    # Replace unseen labels with a fallback token
    mapped = [
        value if value in known_classes else "UNKNOWN"
        for value in values
    ]

    # If UNKNOWN class was not present during training, extend encoder safely
    if "UNKNOWN" not in known_classes:
        encoder.classes_ = np.append(encoder.classes_, "UNKNOWN")

    encoded = encoder.transform(mapped)
    return pd.Series(encoded, index=series.index)


# ---- Public API ------------------------------------------------------------
def preprocess_input(data: Any) -> np.ndarray:
    """
    Apply preprocessing pipeline:
        1. Convert payload to DataFrame
        2. Apply label encoders
        3. Reindex columns to match training feature order
        4. Scale numeric values

    Returns:
        np.ndarray with shape (n_samples, n_features)
    """
    df = _to_dataframe(data)

    # Apply label encoders column-wise
    for column in set(df.columns).intersection(_LABEL_ENCODERS.keys()):
        df[column] = _safe_encode(column, df[column])

    # Ensure all expected features exist and in correct order
    df = df.reindex(columns=_FEATURE_ORDER, fill_value=0)

    scaled = _SCALER.transform(df.values)
    return scaled.astype("float32")


def predict_value(preprocessed_features: np.ndarray) -> float:
    """
    Run inference with the trained MLP model.

    Args:
        preprocessed_features: Output of `preprocess_input`.

    Returns:
        Raw float prediction (still in model's target scale).
    """
    prediction = _MODEL.predict(preprocessed_features, verbose=0)
    return float(prediction.flatten()[0])


def postprocess_output(prediction: float) -> float:
    """
    Apply any inverse transformations to the raw prediction.

    The current training pipeline predicts directly in the original sales scale,
    so no additional transforms are necessary. This function keeps the contract
    explicit and clamps negative values to zero.
    """
    return max(float(prediction), 0.0)


__all__ = [
    "preprocess_input",
    "predict_value",
    "postprocess_output",
    "MODEL_PATH",
    "SCALER_PATH",
    "ENCODERS_PATH",
    "FEATURE_LIST_PATH",
]

