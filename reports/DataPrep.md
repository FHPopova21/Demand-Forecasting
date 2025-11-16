================================================================================
ДОКУМЕНТАЦИЯ ЗА NOTEBOOKS - HIERARCHICAL DEMAND FORECASTING M5 WALMART
================================================================================

Проект: Feedforward Neural Network за Hierarchical Demand Forecasting
Автор: [Вашето име]
Дата: 2024

================================================================================
ОБЩО ПРЕГЛЕД
================================================================================

Този проект включва два основни notebook-а за подготовка и обработка на данни
за задача за йерархично прогнозиране на търсене (M5 Walmart competition):

1. DataPreparation.ipynb - Първичен преглед и анализ на данните
2. DataProcessing.ipynb - Преобразуване на данните за машинно обучение

================================================================================

1. # DATAPREPARATION.IPYNB

## ЦЕЛ:

Първичен преглед и изследване на структурата на данните от M5 Walmart
competition. Notebook-ът анализира трите основни dataset-а (sales, calendar,
prices) и идентифицира ключови характеристики, проблеми и възможности за
feature engineering.

## СТРУКТУРА И СЪДЪРЖАНИЕ:

1️⃣ Преглед на файловете

- Зареждане на CSV файловете
- Преглед на първите редове
- Анализ на размерите и структурата

Изход:

- Sales: (30490, 1947) - 30490 продукта × 1941 дни продажби
- Calendar: (1969, 14) - 1969 дни с календарна информация
- Prices: (6841121, 4) - над 6.8M ценови записи

2️⃣ Проучване на типовете данни

- Анализ на типовете данни (numeric, categorical, datetime)
- Уникални стойности за категориални колони
- Структура на данните

Открития:

- Уникални продукти: 3049
- Уникални магазини: 10
- Уникални категории: 3
- Уникални отдели: 7
- Уникални щати: 3

3️⃣ Fixing Data Issues

- Конвертиране на date колона към datetime
- Проверка за missing values
- Анализ на проблеми с данните

Открития:

- Event полетата (event_name_1, event_type_1) имат много missing values
- Основните колони (sales, prices) нямат missing values

4️⃣ Data Transformation for Time Series Analysis

- Преобразуване от wide към long формат
- Работа със sample данни (за избягване на memory issues)
- Обработка на дневни продажби

⚠️ ВАЖНО: Работи със SAMPLE данни поради големия обем (~59M реда след
преобразуване)

5️⃣ Merge Data for Complete Analysis

- Приготвяне за merge операции
- Препоръки за chunked processing
- Стратегии за работа с големи данни

6️⃣ Анализ на разпределението на продажбите

- Визуализация на дневни продажби
- Разпределение на продажбите
- Анализ по категории, отдели и магазини
- Boxplots за разпределения

7️⃣ Йерархична структура

- Анализ на йерархията: Product → Category → Department → Store → State
- Агрегиране на продажби на различни нива
- Визуализация на йерархичната структура

8️⃣ Календарни ефекти и сезонност

- Анализ на сезонност по дни от седмицата
- Месечна сезонност
- SNAP дни и тяхното влияние
- Събития и празници

9️⃣ Feature Engineering Препоръки

- Анализ на колоните и техните типове
- Препоръки за encoding стратегии
- Предложения за нови features

Препоръчани features:

- Lag features: sales_lag_1, sales_lag_7, sales_lag_30
- Rolling statistics: rolling_7_mean, rolling_30_mean, rolling_7_std
- Calendar features: is_weekend, is_holiday, is_snap_day
- Cyclical encoding: month_sin, month_cos, wday_sin, wday_cos

🔟 Обобщение и следващи стъпки

- Ключови открития
- Следващи стъпки за MLP модела
- Препоръчани библиотеки

## КЛЮЧОВИ ОТКРИТИЯ:

1. Данните са качествени - няма missing values в основните колони
2. Йерархична структура е ясно дефинирана
3. Сезонност е налична в данните
4. Календарни ефекти са важни (SNAP дни, празници, събития)
5. Ценови ефекти могат да се използват като features

## ИЗПОЛЗВАНИ БИБЛИОТЕКИ:

- pandas - за data manipulation
- numpy - за числени операции
- matplotlib/seaborn - за визуализация

## РЕЗУЛТАТИ:

- Пълно разбиране на структурата на данните
- Идентифицирани ключови features за модела
- Препоръки за feature engineering
- Анализ на проблеми и ограничения

================================================================================ 2. DATAPROCESSING.IPYNB
================================================================================

## ЦЕЛ:

Производствено готов pipeline за подготовка на данните за MLP модел.
Notebook-ът трансформира суровите данни във формат, подходящ за машинно
обучение, като включва feature engineering, scaling, encoding и train/val/test
splits.

## СТРУКТУРА И СЪДЪРЖАНИЕ:

0. Setup

   - Импортиране на библиотеки
   - Настройка на пътища (DATA_RAW, DATA_INTERIM, DATA_PROCESSED, MODELS_DIR)
   - Seed за възпроизводимост (GLOBAL_SEED = 42)
   - Pandas display настройки

1. Load Meta Data

   - Зареждане на calendar.csv с date features и SNAP дни
   - Зареждане на sell_prices.csv
   - Зареждане на sales metadata (ID нива без d\_\* колоните)
   - Schema информация и статистики

   Изход:

   - calendar_cols: 14 колони
   - n_items: 3049
   - n_stores: 10

2. Helper Functions

   - reduce_memory_usage() - оптимизация на паметта
   - create_lag_features() - създаване на lag features (7, 14, 28 дни)
   - create_rolling_features() - rolling statistics (mean, std)
   - encode_cyclic_features() - cyclical encoding (sin/cos)
   - time_based_split() - train/val/test split по време

3. Processing Strategy

   - Обяснение на workflow-а
   - Стратегия за chunk processing
   - Работа със sample данни за тестване

4. Transform sample (Proof-of-concept)
   Цел: Демонстрация върху малък dataset

   Стъпки:

   - Избиране на 1 store (CA_1) + 1 category (HOBBIES)
   - Зареждане на wide sales данни chunk-by-chunk
   - Преобразуване от wide към long формат
   - Merge с calendar и prices
   - Създаване на lag и rolling features
   - Проверки за NaN и размери

   Резултати:

   - ~565 продукта обработени
   - ~1M+ редове след transformation
   - 26 features създадени

5. Full processing (optional – за мощна машина)
   Цел: Обработка на целия dataset (опционално)

   Особености:

   - Chunk обработка (100K реда на парче)
   - Запис като .parquet файлове
   - Изисква 32GB+ RAM
   - По подразбиране е DISABLED (RUN_FULL_PROCESSING = False)

   ⚠️ ВНИМАНИЕ: Това изисква значителна RAM и време!

6. Create X,y splits (time-aware)
   Цел: Преобразуване към supervised learning формат

   Стъпки:

   - y = future sales (прогноза за 1 ден напред) - shift(-1)
   - Time-aware train/valid/test split:
     - Train: ~70% от началните дати
     - Valid: ~15% (следващи дати)
     - Test: ~15% (най-новите дати)
   - Създаване на X (features) и y (target) за всеки split
   - Автоматично идентифициране на feature колоните

   Резултати:

   - X_train, y_train, X_val, y_val, X_test, y_test
   - ~755K train редове, ~162K val и test редове
   - 22 features

7. Scaling & Encoding
   Цел: Подготовка за MLP

   Стъпки:

   - Идентификация на числови и категориални колони
   - MinMaxScaler за числови данни (fit само върху train!)
   - LabelEncoder за категориални данни (fit само върху train!)
   - Обработка на NaN стойности:
     - Числени: попълване с медиана от train
     - Категориални: попълване с "Unknown"
   - Запазване на preprocessing обекти

   ⚠️ ВАЖНО: Fit scaler и encoders само върху train данните!

   Резултати:

   - X_train_scaled, X_val_scaled, X_test_scaled
   - 12 числени features (скалирани в [0, 1])
   - 7 категориални features (label encoded)

8. Save pipeline objects
   Цел: Запазване на preprocessing обекти за inference

   Файлове:

   - scaler.pkl - MinMaxScaler
   - label_encoders.pkl - речник с LabelEncoder обекти
   - feature_list.pkl - метаданни (numeric_cols, categorical_cols, feature_cols)
   - preprocessing_metadata.json - четими метаданни

   Локация: /models/

9. Sanity checks
   Цел: Проверка, че всичко е наред

   Проверки:
   ✅ Няма NaN стойности
   ✅ Нормализирани стойности (train в [0, 1])
   ✅ Коректни shapes (X и y съответстват)
   ✅ Няма data leakage (scaler/encoders fit-нати само върху train)

   Финален отчет показва дали всички checks преминават успешно

## ИЗПОЛЗВАНИ БИБЛИОТЕКИ:

- pandas - за data manipulation
- numpy - за числени операции
- sklearn.preprocessing - MinMaxScaler, LabelEncoder
- pickle - за запазване на preprocessing обекти
- pathlib - за работа с пътища

## FEATURES СЪЗДАДЕНИ:

Lag Features:

- sales_lag7, sales_lag14, sales_lag28

Rolling Features:

- sales_rmean7, sales_rmean28 (rolling mean)
- sales_rstd7, sales_rstd28 (rolling std)

Календарни Features:

- wday, month, year (числени)
- event_name_1, event_type_1 (категориални)
- snap_CA, snap_TX, snap_WI (binary)

Metadata Features:

- item_id, dept_id, cat_id, store_id, state_id (категориални)

Ценови Features:

- sell_price (числен)

## РЕЗУЛТАТИ:

- X_train_scaled, y_train - готови за обучение
- X_val_scaled, y_val - готови за валидация
- X_test_scaled, y_test - готови за тестване
- Preprocessing обекти запазени в /models/
- Данните са готови за MLP модел

================================================================================
ВЗАИМОВРЪЗКА МЕЖДУ NOTEBOOKS
================================================================================

DataPreparation.ipynb → DataProcessing.ipynb

DataPreparation.ipynb:

- Анализира суровите данни
- Идентифицира проблеми и възможности
- Дава препоръки за feature engineering

DataProcessing.ipynb:

- Имплементира препоръките от DataPreparation
- Трансформира данните за ML модел
- Създава финалните features и splits

## WORKFLOW:

1. Изпълнете DataPreparation.ipynb за първичен анализ
2. Прегледайте откритията и препоръките
3. Изпълнете DataProcessing.ipynb за подготовка на данните
4. Използвайте резултатите (X_train_scaled, y_train, etc.) за обучение на модел

================================================================================
ВАЖНИ ЗАБЕЛЕЖКИ
================================================================================

1. ПАМЕТ:

   - Full dataset създава ~59M реда след transformation
   - Използвайте sample данни за тестване
   - Full processing изисква 32GB+ RAM

2. DATA LEAKAGE:

   - Scaler и encoders трябва да се fit-ват САМО върху train данните
   - Валидацията на data leakage е включена в секция 9

3. ВРЕМЕВА СТРУКТУРА:

   - Split-овете са time-aware (train < val < test по време)
   - НЕ използвайте random split за time series данни

4. REPRODUCIBILITY:

   - GLOBAL_SEED = 42 е зададен за възпроизводимост
   - Seed-овете се прилагат за numpy, random и torch (ако се използва)

5. FEATURE ENGINEERING:
   - Lag и rolling features се създават по групи (item_id, store_id)
   - Първите 28 дни се премахват поради липса на lag/rolling данни
