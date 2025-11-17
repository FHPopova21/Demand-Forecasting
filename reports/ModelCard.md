# Model Card — Hierarchical Demand Forecasting MLP (v3.0)

_Last updated: 2025-11-17_

This model card summarizes the production-ready feed-forward neural network (MLP) used for daily demand forecasting in the Flask service. It consolidates the architecture, training configuration, evaluation metrics, comparisons across historical versions, and diagnostic analyses required by the serving team.

---

## 1. Architecture & Training Configuration

| Component                  | Details                                                                                                          |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **Input**                  | 36 engineered features (lag, rolling stats, calendar, price, categorical encodings)                              |
| **Hidden stack**           | Dense(128, ReLU) → BN → Dropout 0.30 → Dense(64, ReLU) → BN → Dropout 0.20 → Dense(32, ReLU) → BN → Dropout 0.10 |
| **Output**                 | Dense(1, linear)                                                                                                 |
| **Parameters**             | ≈16k trainable weights                                                                                           |
| **Batch size**             | 1,024                                                                                                            |
| **Optimizer**              | Adam (default betas)                                                                                             |
| **Learning-rate schedule** | ReduceLROnPlateau (factor 0.5, patience 5, min LR 1e-7)                                                          |
| **Regularization**         | Dropout (0.30/0.20/0.10), BatchNorm, EarlyStopping (patience 10, restore best weights)                           |

> **Serving note:** The deployed artifact (`models/trained_models/best_mlp_model.keras`) was trained with the PyTorch backend via Keras 3. The Flask helper `models/flask_pipeline.py` enforces the same backend and loads the associated scaler, encoders, and feature order.

---

## 2. Metrics on Test Set (Model 3.0)

| Metric | Value                                         |
| ------ | --------------------------------------------- |
| RMSE   | **2.2472**                                    |
| MAE    | **0.9015**                                    |
| MSE    | 5.0499                                        |
| WAPE   | 60.29%                                        |
| WRMSSE | 233.93%                                       |
| MAPE   | 61.34% (not reliable due to zero-demand rows) |

---

## 3. Version Comparison (1.0 → 3.0)

| Metric (Test)           | Model 1.0 | Model 2.0 | Model 3.0 (current) | Δ vs 1.0    |
| ----------------------- | --------- | --------- | ------------------- | ----------- |
| **RMSE**                | 2.2612    | 2.2798    | **2.2472**          | **↓ 0.014** |
| **MAE**                 | 0.9345    | 1.0184    | **0.9015**          | **↓ 0.033** |
| **MSE**                 | 5.1130    | 5.1977    | **5.0499**          | **↓ 0.063** |
| **Validation MSE**      | 4.9767    | 5.9893    | **4.8226**          | **↓ 0.154** |
| **Epochs (ES trigger)** | 24        | 13        | 18                  | —           |

**Summary:**

- Model 2.0 underperformed due to aggressive cosine LR decay and smaller LR.
- Model 3.0 reverts to ReduceLROnPlateau, retains larger batch size, and re-tunes dropout, yielding the best balance of MAE/RMSE.

---

## 4. Error Analysis & Diagnostics

### 4.1 Residual Statistics (Test Set)

| Statistic       | Value            |
| --------------- | ---------------- |
| Mean residual   | **0.0717**       |
| Median residual | -0.1356          |
| Std. dev.       | 2.2461           |
| Min / Max       | -12.64 / 73.72   |
| IQR (Q25–Q75)   | -0.4193 – 0.1423 |

- **Bias check:** Mean residual < 0.08 → negligible systematic bias overall.
- **Distribution:** Not Gaussian (D’Agostino p-value < 1e-6); heavy-tailed due to promo spikes.

### 4.2 Segment-Level Errors

- **MAE by quantiles:**
  - Q0–0.25: dominated by zeros → low absolute errors.
  - Q0.75–1.0: MAE 1.68, RMSE 3.59 (large spikes).
- **Top 5% absolute errors:** 8,108 samples, average abs error 7.14 units.
- **Directionality:** 26.7% underestimation vs 73.3% overestimation; mean over-estimation error 0.57, mean under-estimation error 1.82.

### 4.3 Bias & Residual Insights

- Mild positive mean residual signals small over-prediction bias overall.
- Underestimation cases show larger magnitude errors (1.82) than overestimation (0.57), indicating risk of stockouts when demand surges.
- Residuals vs predicted/actual charts reveal funnel shape → higher variance at high demand → consider segment-specific calibration.

---

## 5. Bootstrap Stability

Bootstrap analysis (100 resamples) on test predictions:

| Metric | Mean   | Std    | 95% CI         | CV        |
| ------ | ------ | ------ | -------------- | --------- |
| MSE    | 5.0712 | 0.1254 | [4.839, 5.324] | 2.47%     |
| MAE    | 0.9019 | 0.0048 | [0.893, 0.912] | 0.54%     |
| RMSE   | 2.2518 | 0.0278 | [2.200, 2.307] | **1.23%** |
| WAPE   | 60.30% | 0.20%  | [59.93, 60.68] | 0.33%     |

**Interpretation:** CV(RMSE) = 1.23% ⇒ model predictions are highly stable across resampled datasets; suitable for production serving.

---

## 6. Baseline Comparison

| Model                          | RMSE       | MAE        | WAPE       | Δ RMSE vs MLP |
| ------------------------------ | ---------- | ---------- | ---------- | ------------- |
| Naive Forecast (mean of train) | 2.7956     | 1.1954     | 72.73%     | +19.6%        |
| Linear Regression              | 2.7809     | 1.1681     | 71.63%     | +19.2%        |
| **MLP (current)**              | **2.2472** | **0.9015** | **60.29%** | —             |

The MLP reduces RMSE by ~19% and MAE by ~24% versus simple baselines, confirming its added value for deployment.

---

## 7. Flask Integration Checklist

- [x] Model artifact saved as `models/trained_models/best_mlp_model.keras`
- [x] Preprocessing assets: scaler, label encoders, feature order (see `models/preprocessing/`)
- [x] Serving helper: `models/flask_pipeline.py` exposes `preprocess_input`, `predict_value`, `postprocess_output`
- [x] Custom metric (`root_mean_squared_error`) registered for model loading
- [x] README updated with integration snippet

> **Next steps for the Flask teammate:** Import the helper functions, wire them into the `/predict` endpoint, and ensure incoming payloads map to the expected feature names. The helper already handles unseen categories (mapped to “UNKNOWN”) and clamps negative outputs to zero.

---

## 8. Known Limitations & Recommendations

1. **High relative errors for zero/low demand items**
   - Continue ignoring MAPE; consider SMAPE or quantile loss for sparse series.
2. **Underestimation on spikes**
   - Explore post-processing uplift on promo days or blend with heuristics.
3. **Operational bias**
   - Monitor inventory-sensitive SKUs where underestimation penalty is high.
4. **Future experiments**
   - Residual connections or Transformers for hierarchical coherence.
   - Feature expansion (promo calendars, price elasticity, store-level weather).

---

_For questions: reach out to the forecasting team. The artifacts above are production-ready and aligned with the Flask serving pipeline._
