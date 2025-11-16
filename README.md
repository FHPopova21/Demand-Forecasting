# Hierarchical Demand Forecasting using MLP Neural Networks

[![Python](https://img.shields.io/badge/Python-3.13-blue.svg)](https://www.python.org/)
[![Keras](https://img.shields.io/badge/Keras-3.0+-red.svg)](https://keras.io/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 📋 Описание на проекта

Този проект имплементира **Multi-Layer Perceptron (MLP)** невронна мрежа за йерархично прогнозиране на търсене на продажби в retail среда. Целта е да се предскажат бъдещи продажби на различни нива на агрегация (продукт, категория, магазин) използвайки исторически данни за продажби.

Проектът е базиран на **M5 Forecasting - Accuracy** dataset от Kaggle и използва модерни техники за feature engineering, времеви серии и deep learning за постигане на висококачествени прогнози.

### 🎯 Основни цели

- ✅ Изграждане на robust MLP модел за прогнозиране на продажби 1 ден напред
- ✅ Използване на lag features, rolling statistics и календарни характеристики
- ✅ Изчерпателна оценка на модела с множествено метрики
- ✅ Сравнение с baseline модели за валидация на подхода
- ✅ Бизнес-интерпретация на резултатите

---

## ✨ Основни функционалности

- 🧠 **MLP Neural Network** с архитектура 128→64→32 неврона
- 📊 **Feature Engineering**: Lag features, rolling statistics, calendar features
- 🔄 **Preprocessing Pipeline**: Автоматизирана обработка на данни с encoding и scaling
- 📈 **Изчерпателна оценка**:
  - Regression метрики: RMSE, MAE, WAPE, WRMSSE, MAPE
  - Residuals анализ за bias detection
  - Bootstrap анализ за стабилност
  - Сравнение с baseline модели (Naive Forecast, Linear Regression)
- 📉 **Визуализации**: Learning curves, residuals plots, stability distributions
- 💼 **Бизнес-интерпретация**: Анализ на практическата приложимост

---

## 📁 Структура на проекта

```
hierarchical-demand-forecasting/
├── data/                          # Dataset и обработени данни
│   ├── sales_train_evaluation.csv # Training данни
│   ├── sales_train_validation.csv # Validation данни
│   ├── calendar.csv               # Календарни данни
│   ├── sell_prices.csv           # Цени на продуктите
│   ├── processed_data.pkl        # Обработени данни (train/val/test split)
│   ├── DataPreparation.ipynb     # Подготовка на данните
│   └── DataProcessing.ipynb     # Preprocessing pipeline
│
├── models/                        # Модели и резултати
│   ├── notebooks/                 # Jupyter notebooks
│   │   ├── ModelTraining.ipynb   # Обучение на MLP модел
│   │   └── ModelEvaluation.ipynb # Оценка на модела
│   │
│   ├── trained_models/            # Обучени модели
│   │   ├── best_mlp_model.keras  # Най-добрият модел
│   │   └── mlp_model_final_v3.keras
│   │
│   ├── preprocessing/             # Preprocessing обекти
│   │   ├── scaler.pkl
│   │   ├── label_encoders.pkl
│   │   ├── feature_list.pkl
│   │   └── preprocessing_metadata.json
│   │
│   ├── training/                   # Резултати от обучение
│   │   ├── training_history.png
│   │   └── mlp_model_v3_metadata.json
│   │
│   └── evaluation/                 # Резултати от оценка
│       ├── metrics/               # CSV метрики
│       ├── visualizations/        # PNG графики
│       └── reports/               # JSON отчети
│
├── src/                           # Source code
│   ├── config.py                  # Конфигурация
│   ├── features/                   # Feature engineering
│   ├── pipelines/                 # Data pipelines
│   └── eda/                       # Exploratory data analysis
│
├── reports/                       # Генерирани отчети
│   ├── ModelEvaluation.md
│   ├── DataPrep.md
│   └── ...
│
├── requirements.txt               # Python зависимости
└── README.md                      # Този файл
```

---

## 🚀 Инсталация

### Изисквания

- Python 3.9+ (препоръчително 3.13)
- pip или conda

### Стъпки за инсталация

1. **Клониране на repository**

```bash
git clone <repository_url>
cd hierarchical-demand-forecasting
```

2. **Създаване на virtual environment**

```bash
# С venv
python -m venv venv
source venv/bin/activate  # Linux/Mac
# или
venv\Scripts\activate     # Windows

# С conda (алтернативно)
conda create -n demand_forecasting python=3.13
conda activate demand_forecasting
```

3. **Инсталиране на зависимости**

```bash
pip install -r requirements.txt
```

### Ключови зависимости

- **Keras 3.0+** с PyTorch backend за невронни мрежи
- **pandas 2.1+** за работа с данни
- **scikit-learn 1.3+** за preprocessing и baseline модели
- **matplotlib & seaborn** за визуализации
- **scipy** за статистически анализи

---

## 💻 Използване

### 1. Подготовка на данните

Изпълнете `DataProcessing.ipynb` за да обработите суровите данни:

```bash
jupyter notebook data/DataProcessing.ipynb
```

Това ще създаде `processed_data.pkl` с train/validation/test splits.

### 2. Обучение на модела

Отворете и изпълнете `ModelTraining.ipynb`:

```bash
jupyter notebook models/notebooks/ModelTraining.ipynb
```

Моделът ще бъде запазен в `models/trained_models/best_mlp_model.keras`.

**Параметри на модела:**

- Архитектура: 128 → 64 → 32 неврона
- Activation: ReLU с Batch Normalization
- Dropout: 0.3, 0.2, 0.1
- Optimizer: Adam
- Loss: MSE
- Batch size: 1024
- Early stopping: patience=10

### 3. Оценка на модела

Изпълнете `ModelEvaluation.ipynb` за пълна оценка:

```bash
jupyter notebook models/notebooks/ModelEvaluation.ipynb
```

Това ще генерира:

- Метрики в `models/evaluation/metrics/`
- Визуализации в `models/evaluation/visualizations/`
- Отчети в `models/evaluation/reports/`

---

## 📊 Резултати

### Основни метрики на test set

| Метрика    | Стойност |
| ---------- | -------- |
| **RMSE**   | 2.2472   |
| **MAE**    | 0.9015   |
| **MSE**    | 5.0499   |
| **WAPE**   | 60.29%   |
| **WRMSSE** | 233.93%  |
| **MAPE**   | 61.34%   |

### Сравнение с baseline модели

| Модел                 | RMSE       | MAE        | WAPE       |
| --------------------- | ---------- | ---------- | ---------- |
| **Naive Forecast**    | 2.7956     | 1.1954     | 72.73%     |
| **Linear Regression** | 2.7809     | 1.1681     | 71.63%     |
| **MLP (наш модел)**   | **2.2472** | **0.9015** | **60.29%** |

**Подобрение:**

- ✅ **19.62%** намаление на RMSE спрямо Naive Forecast
- ✅ **19.19%** намаление на RMSE спрямо Linear Regression

### Стабилност

- **Coefficient of Variation (CV)**: 1.23%
- ✅ Моделът е **много стабилен** (CV < 5%)

### Residuals анализ

- **Mean residual**: 0.0717 (минимален bias)
- **Standard deviation**: 2.2461
- ⚠️ Residuals не следват нормално разпределение (p < 0.05)

### Бизнес-интерпретация

- **MAE като % от средната продажба**: 93.84%
- **Подценяване**: 26.70% от прогнозите
- **Надценяване**: 73.30% от прогнозите
- **Големи грешки (top 5%)**: 8,108 случая (5.00%)

---

## 🔍 Детайли на модела

### Архитектура

```
Input Layer (36 features)
    ↓
Dense(128) + BatchNorm + Dropout(0.3)
    ↓
Dense(64) + BatchNorm + Dropout(0.2)
    ↓
Dense(32) + BatchNorm + Dropout(0.1)
    ↓
Output Layer (1 neuron, linear activation)
```

**Общо параметри**: ~16,000 trainable параметра

### Features

Моделът използва 36 features, включително:

- **Lag features**: Продажби от предишни дни (lag 1, 7, 14, 28)
- **Rolling statistics**: Moving averages и стандартни отклонения
- **Calendar features**: Ден от седмицата, месец, празници
- **Price features**: Нормализирани цени
- **Category features**: Encoded категории на продуктите

### Training процес

- **Epochs**: До 100 (с early stopping)
- **Validation split**: Отделен validation set
- **Callbacks**:
  - EarlyStopping (patience=10)
  - ModelCheckpoint (save best)
  - ReduceLROnPlateau (factor=0.5)

---

## 📈 Визуализации

Всички визуализации се намират в `models/evaluation/visualizations/`:

- **residuals_analysis.png**: Distribution, Q-Q plot, scatter plots
- **stability_analysis.png**: Bootstrap distributions на метриките
- **baseline_comparison.png**: Bar charts сравняващи моделите
- **training_history.png**: Learning curves (loss и метрики)

---

## 🔧 Конфигурация

Основната конфигурация се намира в `src/config.py`:

```python
GLOBAL_SEED = 42
BATCH_SIZE = 1024
EPOCHS = 100
EARLY_STOPPING_PATIENCE = 10
```

---

## 🚧 Препоръки за подобрения

### Краткосрочни подобрения

1. **Обработка на outliers**

   - Идентифициране и обработка на екстремни стойности
   - Robust scaling методи

2. **Bias correction**

   - Калибрация на прогнозите за намаляване на систематичен bias
   - Post-processing техники

3. **Feature engineering**
   - Експерименти с допълнителни lag features
   - Сезонни patterns и trends

### Дългосрочни подобрения

1. **Архитектурни подобрения**

   - Residual connections
   - Attention mechanisms
   - Ensemble от множество модели

2. **Advanced техники**

   - Transformer архитектури за времеви серии
   - Hierarchical modeling за различни нива на агрегация
   - Transfer learning от други datasets

3. **Production готовност**
   - Model versioning
   - Automated retraining pipeline
   - A/B testing framework

---

## 🙏 Благодарности

- Kaggle за предоставяне на M5 Forecasting dataset
- Keras team за отличната библиотека
- Всички contributors на open-source библиотеките, използвани в проекта

---

## 📚 Референции

- [M5 Forecasting Competition](https://www.kaggle.com/c/m5-forecasting-accuracy)
- [Keras Documentation](https://keras.io/)
- [Time Series Forecasting Best Practices](https://otexts.com/fpp3/)

**Последна актуализация**: 2025
