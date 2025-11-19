# 🔗 React Frontend - Flask Backend Integration

## Обзор

React frontend е свързан с Flask backend за предсказване на продажби. Frontend-ът изпраща POST заявки към Flask API и получава предсказания.

---

## 📁 Структура

### API Service (`src/lib/api.ts`)

- `checkHealth()` - проверява дали API-то работи
- `getFeaturesMetadata()` - зарежда валидните стойности за dropdown-ите
- `predict(payload)` - изпраща заявка за предсказване

### Date Utils (`src/lib/dateUtils.ts`)

- `calculateDateFeatures(date)` - изчислява календарни features от дата
- `calculateWmYrWk(date)` - изчислява year-week ID

### Forecast Page (`src/pages/Forecast.tsx`)

- Основната форма за предсказване
- Зарежда features metadata при mount
- Автоматично попълва календарни полета от дата
- Изпраща POST заявка към `/api/predict`

---

## 🚀 Как работи

### 1. Зареждане на Features Metadata

При mount на Forecast компонента:

```typescript
useEffect(() => {
  const loadFeatures = async () => {
    const metadata = await getFeaturesMetadata();
    // Зарежда валидните стойности за dropdown-ите
  };
  loadFeatures();
}, []);
```

### 2. Автоматично попълване на календарни полета

При избор на дата:

```typescript
const dateFeatures = calculateDateFeatures(date);
// Автоматично изчислява:
// - wm_yr_wk, wday, month, year, quarter
// - day_of_month, day_of_year, week_of_year
// - is_weekend, is_holiday
```

### 3. Изпращане на заявка за предсказване

При submit на формата:

```typescript
const payload: PredictionPayload = {
  // Всички 36 полета
  item_id, dept_id, cat_id, ...
  ...dateFeatures,
  snap_CA, snap_TX, snap_WI,
  sell_price, ...
  sales_lag1, sales_lag7, ...
};

const response = await predict(payload);
setPrediction(response.prediction);
```

---

## 📡 API Endpoints

### `GET /api/health`

Проверява дали API-то работи (не се използва в Forecast компонента, но е наличен).

### `GET /api/features`

Зарежда валидните стойности за категориалните полета.

**Response:**

```json
{
  "categories": {
    "item_id": ["HOBBIES_1_001", ...],
    "dept_id": ["HOBBIES_1", ...],
    ...
  },
  "feature_cols": [...],
  ...
}
```

### `POST /api/predict`

Изпраща заявка за предсказване.

**Request:**

```json
{
  "item_id": "HOBBIES_1_001",
  "dept_id": "HOBBIES_1",
  ...
  "price_vs_avg": 1.0
}
```

**Response:**

```json
{
  "prediction": 5.67,
  "status": "success"
}
```

---

## ⚙️ Конфигурация

### API Base URL

В `src/lib/api.ts`:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";
```

За да промениш API URL, създай `.env` файл:

```bash
VITE_API_URL=http://localhost:5001
```

---

## 🔧 Забележки

### Default стойности

Някои полета (sales*lag*, sales_rmean*, sales_rstd\*, price*\*) се попълват с default стойности. В бъдеще те могат да се извличат автоматично от backend при избор на `item_id`.

### Валидация

Формата проверява:

- Дата е задължителна
- Всички идентификатори (item_id, dept_id, cat_id, store_id, state_id) са задължителни
- Всички останали полета имат default стойности

### Error Handling

При грешка при заявка за предсказване:

- Показва toast съобщение с грешката
- Възстановява формата
- Позволява повторен опит

---

## 🧪 Тестване

### 1. Стартирай Flask backend

```bash
python backend/app.py
```

### 2. Стартирай React frontend

```bash
cd PresentationLayer
npm run dev
```

### 3. Отвори Forecast страницата

http://localhost:8080/forecast

### 4. Тествай формата

1. Избери дата
2. Избери продукт (item_id, dept_id, etc.)
3. Избери събития и SNAP индикатори (опционално)
4. Въведи цена
5. Натисни "Generate Forecast"

---

## 📚 Допълнителна информация

- За детайли за API endpoints, виж `backend/README.md`
- За информация за features, виж `reports/PredictFormFields.md`
- За ML модулите, виж `ml/` директорията

---

_Последна актуализация: Ноември 2025_
