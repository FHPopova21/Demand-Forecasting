"""
Post-processing transformations applied to model outputs.
"""

from __future__ import annotations

import math
from typing import Optional, Union


def clamp(value: float, min_value: float = 0.0, max_value: Optional[float] = None) -> float:
    if max_value is None:
        return max(float(value), float(min_value))
    return min(max(float(value), float(min_value)), float(max_value))


def bias_correct(value: float, bias: float = 0.0, mode: str = "subtract") -> float:
    """
    Bias correction:
    - mode "subtract": value - bias
    - mode "add": value + bias
    - mode "scale": value / (1 + bias)  (if bias expressed relatively)
    """
    if mode == "subtract":
        return float(value) - float(bias)
    if mode == "add":
        return float(value) + float(bias)
    if mode == "scale":
        return float(value) / (1.0 + float(bias))
    raise ValueError("Unknown bias correction mode")


def postprocess(
    prediction: Union[float, list],
    apply_exp_back: bool = False,
    clip_max: Optional[float] = None,
    bias: float = 0.0,
    bias_mode: str = "subtract",
) -> Union[float, list]:
    """
    Apply optional inverse transform (expm1), bias correction, and clipping.
    Works for scalar or list of predictions.
    """

    def _proc(v: float) -> float:
        val = float(v)
        if apply_exp_back:
            val = math.expm1(val)
        if bias != 0.0:
            val = bias_correct(val, bias=bias, mode=bias_mode)
        val = clamp(val, min_value=0.0, max_value=clip_max)
        return float(val)

    if isinstance(prediction, list):
        return [_proc(v) for v in prediction]
    return _proc(prediction)


__all__ = ["postprocess", "clamp", "bias_correct"]

