**Regression Performance on Test Set**

| **Metric** | **Value** |
| ---------- | --------- |
| MSE        | 5.05      |
| RMSE       | 2.25      |
| MAE        | 0.90      |
| WAPE       | 60.29%    |
| WRMSSE     | 233.93%   |
| MAPE       | 61.34%    |

**Residuals Analysis**

- Mean residual: 0.072 → лек положителен bias
- Std: 2.25, Min: -12.64, Max: 73.72 → presence of outliers
- Residuals не следват нормално разпределение

**Stability (Bootstrap, 100 iterations)**

- CV for RMSE: 1.23% → много стабилен
- Метрики показват повторяемост и надеждност

**Comparison with Baselines**

| **Model**         | **RMSE** | **MAE** | **WAPE** |
| ----------------- | -------- | ------- | -------- |
| Naive Forecast    | 2.80     | 1.20    | 72.73%   |
| Linear Regression | 2.78     | 1.17    | 71.63%   |
| MLP               | 2.25     | 0.90    | 60.29%   |

**Interpretation / Business Insight**

- MLP significantly outperforms baselines → по-точни прогнози и по-нисък среден error.
- Стабилен модел, подходящ за оперативни решения.
- Препоръчително: bias correction и clipping на екстремни стойности.

**Conclusion**

- MLP е най-добрият избор за минимизиране на средна абсолютна грешка (MAE) и WAPE.
- Стабилен, но трябва внимание при outliers.

---
