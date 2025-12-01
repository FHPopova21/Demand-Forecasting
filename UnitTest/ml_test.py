# tests/smoke_test.py
import os
import sys
import traceback
import numpy as np

REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if REPO_ROOT not in sys.path:
    sys.path.insert(0, REPO_ROOT)

from ml import load_model, preprocess, predict, postprocess, run_model_inference

def smoke_imports():
    try:
        print("Imported ml package OK")
        print("Available functions:", load_model, preprocess, predict, postprocess, run_model_inference)
    except Exception:
        traceback.print_exc()
        raise

def smoke_preprocess():
    # example payload - адаптирай към твоите feature имена
    payload = {
        "item_id": "HOUSEHOLD_1_001",
        "store_id": "CA_3",
        "date": "2025-11-17",
        "price": 9.99,
        "promo": 0
    }
    try:
        X = preprocess(payload)
        print("Preprocess output shape:", getattr(X, "shape", type(X)))
    except Exception:
        traceback.print_exc()
        raise

def smoke_model_load_and_predict():
    try:
        artifacts = load_model()
        print("Loaded model artifacts:", type(artifacts), "feature_order len:", len(artifacts.feature_order))
    except Exception:
        traceback.print_exc()
        raise

    # if model file is large and you don't want to run actual predict, you can skip
    try:
        import numpy as np
        X = np.zeros((1, len(artifacts.feature_order)), dtype="float32")
        pred = predict(X)
        print("Predict OK, value:", pred)
    except Exception:
        traceback.print_exc()
        print("Prediction failed — check model and input shape")

if __name__ == "__main__":
    smoke_imports()
    smoke_preprocess()
    smoke_model_load_and_predict()
    print("Smoke tests finished")