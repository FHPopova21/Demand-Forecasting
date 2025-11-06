# src/features/helpers.py
import numpy as np
import pandas as pd

def reduce_memory_usage(df: pd.DataFrame, verbose: bool=True) -> pd.DataFrame:
    start_mem = df.memory_usage(deep=True).sum() / 1024**2
    for col in df.columns:
        col_type = df[col].dtype
        if str(col_type)[:3] == 'int':
            df[col] = pd.to_numeric(df[col], downcast='integer')
        elif str(col_type)[:5] == 'float':
            df[col] = pd.to_numeric(df[col], downcast='float')
        elif col_type == 'object':
            # малки card. → category
            if df[col].nunique(dropna=False) / len(df[col]) < 0.5:
                df[col] = df[col].astype('category')
    end_mem = df.memory_usage(deep=True).sum() / 1024**2
    if verbose:
        print(f"Mem: {start_mem:0.2f} → {end_mem:0.2f} MB ({100*(start_mem-end_mem)/start_mem:0.1f}% saved)")
    return df

def create_lag_features(df: pd.DataFrame, target_col: str, lags=(7,14,28)):
    for L in lags:
        df[f"{target_col}_lag{L}"] = df.groupby(["item_id","store_id"])[target_col].shift(L)
    return df

def create_rolling_features(df: pd.DataFrame, target_col: str, windows=(7,28)):
    for W in windows:
        grp = df.groupby(["item_id","store_id"])[target_col]
        df[f"{target_col}_rmean{W}"] = grp.shift(1).rolling(W).mean()
        df[f"{target_col}_rstd{W}"]  = grp.shift(1).rolling(W).std()
    return df

def encode_cyclic_features(df: pd.DataFrame, col: str, max_val: int):
    # sin/cos кодиране: избягва изкуствена дистанция между 1 и max
    df[f"{col}_sin"] = np.sin(2*np.pi*df[col]/max_val)
    df[f"{col}_cos"] = np.cos(2*np.pi*df[col]/max_val)
    return df

def time_based_split(df: pd.DataFrame, date_col: str, val_start: str, test_start: str):
    tr = df[df[date_col] < val_start]
    va = df[(df[date_col] >= val_start) & (df[date_col] < test_start)]
    te = df[df[date_col] >= test_start]
    return tr, va, te

