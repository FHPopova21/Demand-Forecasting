import math

from ml import run_model_inference, postprocess

EXAMPLES = [
    {
        "item_id": "HOBBIES_1_001",
        "dept_id": "HOBBIES_1",
        "cat_id": "HOBBIES",
        "store_id": "CA_1",
        "state_id": "CA",
        "wm_yr_wk": 11324,
        "wday": 2,
        "month": 11,
        "year": 2025,
        "event_name_1": "Easter",
        "event_type_1": "Religious",
        "snap_CA": 1,
        "snap_TX": 0,
        "snap_WI": 0,
        "sell_price": 5.0,
        "sales_lag1": 6.0,
        "sales_lag7": 5.8,
        "sales_lag14": 5.6,
        "sales_lag28": 5.5,
        "sales_rmean7": 5.7,
        "sales_rstd7": 0.5,
        "sales_rmean14": 5.6,
        "sales_rstd14": 0.6,
        "sales_rmean28": 5.5,
        "sales_rstd28": 0.7,
        "sales_rmean30": 5.4,
        "sales_rstd30": 0.8,
        "is_weekend": 0,
        "quarter": 4,
        "day_of_month": 1,
        "day_of_year": 305,
        "week_of_year": 44,
        "is_holiday": 0,
        "price_change": 0.0,
        "price_rmean7": 5.1,
        "price_vs_avg": 1.00,
    },
    {
        "item_id": "HOBBIES_1_002",
        "dept_id": "HOBBIES_1",
        "cat_id": "HOBBIES",
        "store_id": "CA_1",
        "state_id": "CA",
        "wm_yr_wk": 11325,
        "wday": 5,
        "month": 11,
        "year": 2025,
        "event_name_1": "Halloween",
        "event_type_1": "Cultural",
        "snap_CA": 1,
        "snap_TX": 0,
        "snap_WI": 0,
        "sell_price": 12.5,
        "sales_lag1": 8.0,
        "sales_lag7": 7.8,
        "sales_lag14": 7.6,
        "sales_lag28": 7.5,
        "sales_rmean7": 7.7,
        "sales_rstd7": 0.6,
        "sales_rmean14": 7.6,
        "sales_rstd14": 0.7,
        "sales_rmean28": 7.5,
        "sales_rstd28": 0.8,
        "sales_rmean30": 7.4,
        "sales_rstd30": 0.9,
        "is_weekend": 0,
        "quarter": 4,
        "day_of_month": 7,
        "day_of_year": 311,
        "week_of_year": 45,
        "is_holiday": 0,
        "price_change": 0.2,
        "price_rmean7": 12.0,
        "price_vs_avg": 1.04,
    },
    {
        "item_id": "HOBBIES_1_003",
        "dept_id": "HOBBIES_1",
        "cat_id": "HOBBIES",
        "store_id": "CA_1",
        "state_id": "CA",
        "wm_yr_wk": 11326,
        "wday": 1,
        "month": 11,
        "year": 2025,
        "event_name_1": "Christmas",
        "event_type_1": "Religious",
        "snap_CA": 1,
        "snap_TX": 0,
        "snap_WI": 0,
        "sell_price": 3.0,
        "sales_lag1": 4.0,
        "sales_lag7": 3.8,
        "sales_lag14": 3.6,
        "sales_lag28": 3.5,
        "sales_rmean7": 3.7,
        "sales_rstd7": 0.4,
        "sales_rmean14": 3.6,
        "sales_rstd14": 0.5,
        "sales_rmean28": 3.5,
        "sales_rstd28": 0.6,
        "sales_rmean30": 3.4,
        "sales_rstd30": 0.7,
        "is_weekend": 0,
        "quarter": 4,
        "day_of_month": 10,
        "day_of_year": 319,
        "week_of_year": 46,
        "is_holiday": 0,
        "price_change": -0.1,
        "price_rmean7": 3.1,
        "price_vs_avg": 0.98,
    },
]

REASONABLE_MAX = 1000.0

def test_examples_return_reasonable_values():
    for payload in EXAMPLES:
        pred = run_model_inference(payload)
        assert isinstance(pred, (float, int))
        assert pred >= 0.0
        assert pred <= REASONABLE_MAX

def test_postprocess_expm1_and_clamp():
    log_val = math.log1p(10.0)
    out = postprocess(log_val, apply_exp_back=True, clip_max=None)
    assert abs(out - 10.0) < 1e-6

    out2 = postprocess(-5.0, apply_exp_back=False)
    assert out2 == 0.0

