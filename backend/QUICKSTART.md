# ⚡ Quick Start Guide - Flask Backend

## Бърз старт за начинаещи

### 1. Инсталирай зависимости

```bash
# Активирай virtual environment
source venv/bin/activate  # Mac/Linux
# или
venv\Scripts\activate     # Windows

# Инсталирай flask-cors (ако не е инсталиран)
pip install flask-cors

# Или инсталирай всичко отново
pip install -r requirements.txt
```

### 2. Стартирай сървъра

**Вариант 1: От корена на проекта (препоръчително)**

```bash
# От корена на проекта
python backend/app.py
```

**Вариант 2: От backend/ директорията**

```bash
# От backend/ директорията
cd backend
python app.py
```

> **Забележка:** Сега можеш да стартираш от всяка директория - Python path е автоматично конфигуриран.

Трябва да видиш:

```
🚀 Starting Flask API server on port 5001
🌐 API Homepage: http://localhost:5001/
📡 Health check: http://localhost:5001/api/health
📊 Features: http://localhost:5001/api/features
🎯 Predict: http://localhost:5001/api/predict
 * Running on http://0.0.0.0:5001
```

> **Забележка:** Порт 5001 се използва по подразбиране за да избегне конфликт с AirPlay на macOS (който използва 5000).

### 3. Тествай API-то

Отвори в браузъра:

- **API Homepage**: http://localhost:5001/ (показва HTML страница с информация)
- Health check: http://localhost:5001/api/health
- Features: http://localhost:5001/api/features

### 4. Свържи с React frontend

React frontend на порт 8080 вече може да комуникира с Flask API на порт **5001**.

В React компонента, използвай:

```typescript
const response = await fetch("http://localhost:5001/api/predict", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(payload),
});
```

---

## ✅ Проверка че всичко работи

### Тест 1: API Homepage

```bash
# Отвори в браузъра - показва HTML страница
open http://localhost:5001/
```

### Тест 2: Health Check

```bash
curl http://localhost:5001/api/health
```

Очакван отговор:

```json
{ "status": "healthy", "service": "demand-forecasting-api", "version": "1.0.0" }
```

### Тест 3: Features

```bash
curl http://localhost:5001/api/features
```

Трябва да видиш JSON с категориалните стойности.

### Тест 4: Predict (проста заявка)

Използвай пример от `tests/test_inference_examples.py` или виж `backend/README.md` за пълен пример.

---

## 🐛 Ако има проблеми

### Грешка: ModuleNotFoundError: No module named 'ml'

**Решение**: Увери се, че стартираш от корена на проекта:

```bash
cd /path/to/2526-12b-feedforwardneuralnetwork-hierarchical-demand-forecasting
python backend/app.py
```

### Грешка: ModuleNotFoundError: No module named 'flask_cors'

**Решение**: Инсталирай flask-cors:

```bash
pip install flask-cors
```

### Грешка: Model not found

**Решение**: Увери се, че имаш обучени модели в `models/trained_models/`

---

## 📚 Следващи стъпки

1. Прочети пълния `backend/README.md` за детайли
2. Виж `reports/PredictFormFields.md` за информация за features
3. Интегрирай с React frontend

---

_Happy coding! 🚀_
