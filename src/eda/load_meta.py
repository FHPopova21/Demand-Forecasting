# src/eda/load_meta.py
import pandas as pd
from src.config import DATA_RAW

# -- calendar.csv
cal_usecols = ["date","wm_yr_wk","weekday","wday","month","year",
               "event_name_1","event_type_1","event_name_2","event_type_2",
               "snap_CA","snap_TX","snap_WI","d"]
calendar = pd.read_csv(DATA_RAW / "calendar.csv", usecols=cal_usecols, parse_dates=["date"])

# -- sell_prices.csv (само schema/диапазони)
sp_usecols = ["store_id","item_id","wm_yr_wk","sell_price"]
sell_prices_head = pd.read_csv(DATA_RAW / "sell_prices.csv", usecols=sp_usecols, nrows=50)
sell_prices_types = {c:str for c in ["store_id","item_id"]}
sell_prices_types["wm_yr_wk"] = "int32"
sell_prices_types["sell_price"] = "float32"

# -- sales_train_evaluation.csv: само мета колони (ID нива), без d_*
meta_cols = ["id","item_id","dept_id","cat_id","store_id","state_id"]
sales_meta = pd.read_csv(DATA_RAW / "sales_train_evaluation.csv",
                         usecols=meta_cols, dtype="string")

# Бърз „schema card“
schema_info = {
    "calendar_cols": list(calendar.columns),
    "sell_prices_cols": sp_usecols,
    "sales_meta_cols": meta_cols,
    "n_items": sales_meta["item_id"].nunique(),
    "n_stores": sales_meta["store_id"].nunique(),
}
print(schema_info)
