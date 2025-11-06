# src/pipelines/poc_sample.py
import pandas as pd
from src.config import DATA_RAW, DATA_INTERIM
from src.features.helpers import (
    reduce_memory_usage, create_lag_features, create_rolling_features,
    encode_cyclic_features
)

# 1) Зареждане на meta + избор на малък сэмпъл (1 store + 1 category)
meta_cols = ["id","item_id","dept_id","cat_id","store_id","state_id"]
sales_meta = pd.read_csv(DATA_RAW / "sales_train_evaluation.csv",
                         usecols=meta_cols, dtype="string")

sample_store = "CA_1"
sample_cat = "HOBBIES"       # смени според нуждите
meta_sample = sales_meta.query("store_id == @sample_store and cat_id == @sample_cat").copy()

# 2) Зареждаме само нужните колони от sales wide за този сэмпъл
#    ВНИМАНИЕ: тук все още не четем целия файл — ползваме usecols при нужда.
wide = pd.read_csv(DATA_RAW / "sales_train_evaluation.csv")
wide = wide[wide["id"].isin(meta_sample["id"])]

# 3) Unpivot → long
value_cols = [c for c in wide.columns if c.startswith("d_")]
long = wide.melt(id_vars=meta_cols, value_vars=value_cols,
                 var_name="d", value_name="sales")
long["sales"] = long["sales"].astype("int16")

# 4) Calendar + price merge
calendar = pd.read_csv(DATA_RAW / "calendar.csv",
                       usecols=["date","wm_yr_wk","wday","month","year","event_name_1","event_type_1","snap_CA","snap_TX","snap_WI","d"],
                       parse_dates=["date"])
sell_prices = pd.read_csv(DATA_RAW / "sell_prices.csv",
                          usecols=["store_id","item_id","wm_yr_wk","sell_price"])
sell_prices["sell_price"] = sell_prices["sell_price"].astype("float32")

df = long.merge(calendar[["d","date","wm_yr_wk","wday","month","year",
                          "event_name_1","event_type_1","snap_CA","snap_TX","snap_WI"]],
                on="d", how="left")
df = df.merge(sell_prices, on=["store_id","item_id","wm_yr_wk"], how="left")

# 5) Feature engineering (lag, rolling, cyclic)
df = df.sort_values(["item_id","store_id","date"])
df = create_lag_features(df, target_col="sales", lags=(7,14,28))
df = create_rolling_features(df, target_col="sales", windows=(7,28))
df["is_event"] = df["event_name_1"].notna().astype("int8")
df["is_weekend"] = df["wday"].isin([1,7]).astype("int8")  # ако wday е 1..7

for col,maxv in [("month",12),("wday",7)]:
    df[col] = df[col].astype("int16", errors="ignore")
    df = encode_cyclic_features(df, col, maxv)

# 6) Намаляване на памет
df = reduce_memory_usage(df)

# 7) Drop на първите редове без валидни лаг/ролинг (NaN)
min_w = 28  # най-дълъг прозорец
df = df[df["date"] >= (df["date"].min() + pd.Timedelta(days=min_w))].copy()

# 8) Бърза проверка за NaN/размери
assert not df[["sales_lag7","sales_rmean7"]].isna().any().any(), "Има NaN след lag/rolling!"
print(df.shape, df.isna().mean().sort_values(ascending=False).head(10))

# 9) Запис на sample фичъри
out_path = DATA_INTERIM / "sample_features.parquet"
df.to_parquet(out_path, index=False)
print("Saved:", out_path)
