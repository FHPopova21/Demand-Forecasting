from ml import load_model, preprocess, predict

def test_imports_and_shapes():
    artifacts = load_model()
    assert hasattr(artifacts, "feature_order")
    payload = {
        "item_id": "HOBBIES_1_001",
        "dept_id": "HOBBIES_1",
        "cat_id": "HOBBIES",
        "store_id": "CA_1",
        "state_id": "CA",
        "wm_yr_wk": 11325,
        "wday": 1,
        "month": 11,
        "year": 2025,
        "event_name_1": "Easter",
        "event_type_1": "Religious",
        "snap_CA": 1,
        "snap_TX": 0,
        "snap_WI": 0,
        "sell_price": 9.99,
        "sales_lag1": 7.0,
        "sales_lag7": 6.5,
        "sales_lag14": 7.2,
        "sales_lag28": 6.8,
        "sales_rmean7": 6.9,
        "sales_rstd7": 0.5,
        "sales_rmean14": 6.8,
        "sales_rstd14": 0.6,
        "sales_rmean28": 6.7,
        "sales_rstd28": 0.7,
        "sales_rmean30": 6.6,
        "sales_rstd30": 0.8,
        "is_weekend": 0,
        "quarter": 4,
        "day_of_month": 17,
        "day_of_year": 321,
        "week_of_year": 46,
        "is_holiday": 0,
        "price_change": 0.0,
        "price_rmean7": 9.8,
        "price_vs_avg": 1.02,
    }
    X = preprocess(payload)
    assert X.shape[1] == len(artifacts.feature_order)
    p = predict(X)
    assert isinstance(p, (float, int, list))


