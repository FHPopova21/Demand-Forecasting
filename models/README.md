# 📁 Models Directory Structure

Този документ описва структурата на директорията `models/` и организацията на файловете.

## 📂 Структура на директориите

```
models/
├── notebooks/                    # Jupyter notebooks за обучение и оценка
│   ├── ModelTraining.ipynb       # Notebook за обучение на MLP модел
│   └── ModelEvaluation.ipynb    # Notebook за оценка на модела
│
├── trained_models/               # Обучени модели
│   ├── best_mlp_model.keras     # Най-добрият модел (от ModelCheckpoint)
│   └── mlp_model_final_v3.keras # Финален версия на модела
│
├── preprocessing/                # Preprocessing обекти и метаданни
│   ├── feature_list.pkl         # Списък с features
│   ├── label_encoders.pkl       # Label encoders за категориални променливи
│   ├── preprocessing_objects.pkl # Други preprocessing обекти
│   ├── scaler.pkl               # Scaler за нормализация на данните
│   └── preprocessing_metadata.json # Метаданни за preprocessing
│
├── training/                     # Резултати от обучението
│   ├── training_history.png     # Графики на learning curves
│   └── mlp_model_v3_metadata.json # Метаданни за модела
│
└── evaluation/                   # Резултати от оценката на модела
    ├── metrics/                  # Метрики в CSV формат
    │   ├── evaluation_metrics.csv
    │   └── baseline_comparison.csv
    │
    ├── visualizations/           # Визуализации (PNG)
    │   ├── residuals_analysis.png
    │   ├── stability_analysis.png
    │   └── baseline_comparison.png
    │
    └── reports/                 # Детайлни отчети в JSON
        ├── business_analysis.json
        └── evaluation_summary.json
```

## 📋 Описание на директориите

### `notebooks/`

Съдържа Jupyter notebooks за:

- **ModelTraining.ipynb**: Обучение на MLP модел с различни конфигурации
- **ModelEvaluation.ipynb**: Изчерпателна оценка на модела с метрики, residuals анализ, стабилност и бизнес-интерпретация

### `trained_models/`

Съдържа обучените Keras модели (.keras файлове):

- `best_mlp_model.keras`: Най-добрият модел според validation loss (от ModelCheckpoint callback)
- `mlp_model_final_v3.keras`: Финален версия на модела

### `preprocessing/`

Съдържа всички обекти, необходими за preprocessing на данните:

- **Pickle файлове** (.pkl): Serialized обекти (scalers, encoders, feature lists)
- **JSON файлове**: Метаданни за preprocessing процеса

### `training/`

Съдържа резултати от процеса на обучение:

- **training_history.png**: Графики показващи loss и метриките по време на обучението
- **mlp_model_v3_metadata.json**: Метаданни за архитектурата и параметрите на модела

### `evaluation/`

Съдържа резултати от оценката на модела, организирани в поддиректории:

#### `evaluation/metrics/`

CSV файлове с количествени метрики:

- **evaluation_metrics.csv**: Основни regression метрики (RMSE, MAE, WAPE, WRMSSE)
- **baseline_comparison.csv**: Сравнение с baseline модели (Naive, Linear Regression)

#### `evaluation/visualizations/`

PNG файлове с визуализации:

- **residuals_analysis.png**: Анализ на residuals (histogram, Q-Q plot, scatter plots)
- **stability_analysis.png**: Bootstrap анализ за стабилност на метриките
- **baseline_comparison.png**: Bar charts сравняващи MLP с baseline модели

#### `evaluation/reports/`

JSON файлове с детайлни отчети:

- **business_analysis.json**: Бизнес-интерпретация на резултатите
- **evaluation_summary.json**: Пълно резюме на всички резултати от оценката

## 🔧 Използване

### Зареждане на модел

```python
from pathlib import Path
from keras.models import load_model

MODELS_DIR = Path("models")
TRAINED_MODELS_DIR = MODELS_DIR / "trained_models"

# Зареждане на най-добрия модел
model = load_model(str(TRAINED_MODELS_DIR / "best_mlp_model.keras"))
```

### Зареждане на preprocessing обекти

```python
import pickle

PREPROCESSING_DIR = MODELS_DIR / "preprocessing"

# Зареждане на scaler
with open(PREPROCESSING_DIR / "scaler.pkl", "rb") as f:
    scaler = pickle.load(f)

# Зареждане на label encoders
with open(PREPROCESSING_DIR / "label_encoders.pkl", "rb") as f:
    label_encoders = pickle.load(f)
```

### Четене на evaluation резултати

```python
import pandas as pd
import json

EVALUATION_METRICS_DIR = MODELS_DIR / "evaluation" / "metrics"
EVALUATION_REPORTS_DIR = MODELS_DIR / "evaluation" / "reports"

# Четене на метрики
metrics_df = pd.read_csv(EVALUATION_METRICS_DIR / "evaluation_metrics.csv")

# Четене на бизнес анализ
with open(EVALUATION_REPORTS_DIR / "business_analysis.json", "r") as f:
    business_analysis = json.load(f)
```

## 📝 Забележки

- Всички пътища в notebooks са актуализирани да използват новата структура
- При създаване на нови файлове, моля използвайте съответните поддиректории
- За да запазите нов модел, използвайте `TRAINED_MODELS_DIR`
- За да запазите нови evaluation резултати, използвайте съответните поддиректории в `evaluation/`

## 🔄 Миграция

Ако имате стари файлове в root на `models/`, те вече са преместени в съответните поддиректории. Всички пътища в notebooks са актуализирани автоматично.
