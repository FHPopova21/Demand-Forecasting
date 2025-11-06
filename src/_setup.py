# src/_setup.py  (по желание: един ред в началото на всеки notebook/script)
import os, pandas as pd
from src.config import set_all_seeds, DISPLAY_MAX_ROWS, PANDAS_FLOAT_FMT
set_all_seeds()
pd.options.display.max_rows = DISPLAY_MAX_ROWS
pd.options.display.float_format = PANDAS_FLOAT_FMT
