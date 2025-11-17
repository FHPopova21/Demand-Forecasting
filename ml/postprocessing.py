"""
Post-processing transformations applied to model outputs.
"""

from __future__ import annotations


def postprocess(prediction: float) -> float:
    """Clamp negative predictions and return the final forecast."""
    return max(float(prediction), 0.0)


__all__ = ["postprocess"]

