# 🚀 Flask Backend API

Backend API за Demand Forecasting модела. Предоставя REST endpoints за предсказване на продажби.

---

## 📋 Съдържание

- [Инсталация](#инсталация)
- [Стартиране](#стартиране)
- [API Endpoints](#api-endpoints)
- [Примерни заявки](#примерни-заявки)
- [Тестване](#тестване)

---

## 🛠 Инсталация

### Изисквания

- Python 3.9+ (препоръчително 3.13)
- Всички зависимости от `requirements.txt` в корена на проекта

### Стъпки

1. **Активирай virtual environment**:

   ```bash
   source venv/bin/activate  # Linux/Mac
   # или
   venv\Scripts\activate     # Windows
   ```

2. **Инсталирай зависимости**:

   ```bash
   pip install -r requirements.txt
   ```

   Важно: Трябва да имаш `flask-cors` инсталиран (вече е в requirements.txt)

---

## 🚀 Стартиране

### Development режим

```bash
# От корена на проекта
python backend/app.py
```

Или с Flask CLI:

```bash
export FLASK_APP=backend/app.py
export FLASK_DEBUG=True
flask run --port 5000
```

### Environment променливи

- `PORT` - порт на сървъра (default: 5000)
- `FLASK_DEBUG` - debug режим (default: True)

---

## 📡 API Endpoints

### 1. Health Check

**GET** `/api/health`

Проверява дали API-то работи.

**Response:**

```json
{
  "status": "healthy",
  "service": "demand-forecasting-api",
  "version": "1.0.0"
}
```

---

### 2. Get Features Metadata

**GET** `/api/features`

Връща валидните стойности за категориалните полета. Използва се от React frontend за попълване на dropdown менюта.

**Response:**

```json
{
  "categories": {
    "item_id": ["HOBBIES_1_001", "HOBBIES_1_002", ...],
    "dept_id": ["HOBBIES_1", "HOBBIES_2"],
    ...
  },
  "feature_cols": [...],
  "numeric_cols": [...],
  "categorical_cols": [...]
}
```

---

### 3. Predict

**POST** `/api/predict`

Основен endpoint за предсказвания. Приема JSON с всички 36 features.

**Request Body:**

```json
{
  "item_id": "HOBBIES_1_001",
  "dept_id": "HOBBIES_1",
  "cat_id": "HOBBIES",
  "store_id": "CA_1",
  "state_id": "CA",
  "wm_yr_wk": 11324,
  "wday": 2,
  "month": 11,
  "year": 2025,
  "event_name_1": "Easter",
  "event_type_1": "Religious",
  "snap_CA": 1,
  "snap_TX": 0,
  "snap_WI": 0,
  "sell_price": 5.0,
  "sales_lag1": 6.0,
  "sales_lag7": 5.8,
  "sales_lag14": 5.6,
  "sales_lag28": 5.5,
  "sales_rmean7": 5.7,
  "sales_rstd7": 0.5,
  "sales_rmean14": 5.6,
  "sales_rstd14": 0.6,
  "sales_rmean28": 5.5,
  "sales_rstd28": 0.7,
  "sales_rmean30": 5.4,
  "sales_rstd30": 0.8,
  "is_weekend": 0,
  "quarter": 4,
  "day_of_month": 1,
  "day_of_year": 305,
  "week_of_year": 44,
  "is_holiday": 0,
  "price_change": 0.0,
  "price_rmean7": 5.1,
  "price_vs_avg": 1.0
}
```

**Response (Success):**

```json
{
  "prediction": 5.67,
  "status": "success"
}
```

**Response (Error):**

```json
{
  "error": "Missing required field: item_id",
  "message": "Please ensure all 36 feature fields are provided"
}
```

---

## 📝 Примерни заявки

### cURL пример

```bash
# Health check
curl http://localhost:5000/api/health

# Get features
curl http://localhost:5000/api/features

# Predict
curl -X POST http://localhost:5000/api/predict \
  -H "Content-Type: application/json" \
  -d '{
    "item_id": "HOBBIES_1_001",
    "dept_id": "HOBBIES_1",
    "cat_id": "HOBBIES",
    "store_id": "CA_1",
    "state_id": "CA",
    "wm_yr_wk": 11324,
    "wday": 2,
    "month": 11,
    "year": 2025,
    "event_name_1": "Easter",
    "event_type_1": "Religious",
    "snap_CA": 1,
    "snap_TX": 0,
    "snap_WI": 0,
    "sell_price": 5.0,
    "sales_lag1": 6.0,
    "sales_lag7": 5.8,
    "sales_lag14": 5.6,
    "sales_lag28": 5.5,
    "sales_rmean7": 5.7,
    "sales_rstd7": 0.5,
    "sales_rmean14": 5.6,
    "sales_rstd14": 0.6,
    "sales_rmean28": 5.5,
    "sales_rstd28": 0.7,
    "sales_rmean30": 5.4,
    "sales_rstd30": 0.8,
    "is_weekend": 0,
    "quarter": 4,
    "day_of_month": 1,
    "day_of_year": 305,
    "week_of_year": 44,
    "is_holiday": 0,
    "price_change": 0.0,
    "price_rmean7": 5.1,
    "price_vs_avg": 1.0
  }'
```

### Python пример

```python
import requests

# Health check
response = requests.get("http://localhost:5000/api/health")
print(response.json())

# Predict
payload = {
    "item_id": "HOBBIES_1_001",
    "dept_id": "HOBBIES_1",
    # ... всички 36 полета
}

response = requests.post(
    "http://localhost:5000/api/predict",
    json=payload
)
print(response.json())
```

---

## 🧪 Тестване

### Smoke test

Използвай готовите тестове от `tests/test_inference_examples.py`:

```bash
pytest tests/test_inference_examples.py
```

### Manual тестване

1. Стартирай сървъра:

   ```bash
   python backend/app.py
   ```

2. Тествай endpoints:

   ```bash
   # Health check
   curl http://localhost:5000/api/health

   # Features
   curl http://localhost:5000/api/features

   # Predict (използвай пример от test_inference_examples.py)
   curl -X POST http://localhost:5000/api/predict \
     -H "Content-Type: application/json" \
     -d @tests/test_payload.json  # ако създадеш такъв файл
   ```

---

## 🔧 Конфигурация

### CORS

CORS е конфигуриран за React frontend на порт 8080. За да промениш allowed origins, редактирай `backend/app.py`:

```python
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:8080", "http://127.0.0.1:8080"],
        ...
    }
})
```

---

## 🐛 Troubleshooting

### Проблем: Model not found

**Решение**: Увери се, че `models/trained_models/` съдържа обучени модели.

### Проблем: Import errors

**Решение**: Увери се, че работиш от корена на проекта и че `ml/` модулът е достъпен.

### Проблем: CORS errors от React

**Решение**: Провери дали `flask-cors` е инсталиран и CORS origins са правилно конфигурирани.

---

## 📚 Допълнителна информация

- За информация за features, виж `reports/PredictFormFields.md`
- За детайли за модела, виж `reports/ModelCard.md`
- За ML модулите, виж `ml/` директорията

---

_Последна актуализация: Ноември 2025_
