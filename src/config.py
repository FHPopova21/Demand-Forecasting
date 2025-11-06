# src/config.py
from pathlib import Path
import os
import numpy as np
import random

# ---- Paths
PROJ_ROOT = Path(__file__).resolve().parents[1]
DATA_RAW = PROJ_ROOT / "data" / "raw"
DATA_INTERIM = PROJ_ROOT / "data" / "interim"
DATA_PROCESSED = PROJ_ROOT / "data" / "processed"
MODELS_DIR = PROJ_ROOT / "models"
REPORTS = PROJ_ROOT / "reports"

for p in [DATA_RAW, DATA_INTERIM, DATA_PROCESSED, MODELS_DIR, REPORTS]:
    p.mkdir(parents=True, exist_ok=True)

# ---- Seeds (reproducibility)
GLOBAL_SEED = 42
def set_all_seeds(seed: int = GLOBAL_SEED):
    np.random.seed(seed)
    random.seed(seed)
    try:
        import torch
        torch.manual_seed(seed); torch.cuda.manual_seed_all(seed)
        torch.backends.cudnn.deterministic = True
        torch.backends.cudnn.benchmark = False
    except Exception:
        pass

# ---- Plot / memory prefs (optional)
PANDAS_FLOAT_FMT = "{:,.4f}".format
DISPLAY_MAX_ROWS = 200
