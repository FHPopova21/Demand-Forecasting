"""
Preprocessing helpers that turn raw request payloads into model-ready tensors.
"""

from __future__ import annotations

from typing import Any, Iterable, Mapping

import numpy as np
import pandas as pd

from ml.model_loader import load_model

UNKNOWN_TOKEN = "UNKNOWN"


def _to_dataframe(data: Any) -> pd.DataFrame:
    if isinstance(data, pd.DataFrame):
        return data.copy()
    if isinstance(data, Mapping):
        return pd.DataFrame([data])
    if isinstance(data, Iterable):
        return pd.DataFrame(list(data))
    raise TypeError(
        "Unsupported payload type. Provide dict, list of dicts, or pandas DataFrame."
    )


def _safe_encode(series: pd.Series, encoder) -> pd.Series:
    values = series.fillna(UNKNOWN_TOKEN).astype(str).tolist()
    classes = set(encoder.classes_)

    transformed = [
        value if value in classes else UNKNOWN_TOKEN
        for value in values
    ]

    if UNKNOWN_TOKEN not in classes:
        encoder.classes_ = np.append(encoder.classes_, UNKNOWN_TOKEN)

    encoded = encoder.transform(transformed)
    return pd.Series(encoded, index=series.index)


def preprocess(payload: Any) -> np.ndarray:
    """
    Convert incoming payload into a scaled numpy array matching training order.
    """
    artifacts = load_model()
    df = _to_dataframe(payload)

    for column, encoder in artifacts.label_encoders.items():
        if column in df.columns:
            df[column] = _safe_encode(df[column], encoder)

    df = df.reindex(columns=artifacts.feature_order, fill_value=0).astype("float32")

    scaler = artifacts.scaler
    scaler_features = getattr(scaler, "feature_names_in_", None)

    if scaler_features is not None:
        scaler_columns = list(scaler_features)
    else:
        expected = getattr(scaler, "n_features_in_", len(df.columns))
        scaler_columns = list(df.columns[:expected])

    missing = [col for col in scaler_columns if col not in df.columns]
    if missing:
        raise KeyError(
            f"Payload is missing columns required by the scaler: {missing}"
        )

    df.loc[:, scaler_columns] = scaler.transform(df[scaler_columns])
    return df.to_numpy(dtype="float32")


__all__ = ["preprocess"]

