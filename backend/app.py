"""
Flask Backend API за Demand Forecasting Model
"""

import sys
from pathlib import Path

# Добавя родителската директория към Python path, за да може да се импортира ml модула
PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os

from ml.inference import run_model_inference

# Инициализация на Flask app
app = Flask(__name__)

# CORS setup - позволява React frontend да комуникира с API-то
# Опростена конфигурация - разрешава всички origins за development
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:8080", "http://127.0.0.1:8080", "http://localhost:5173"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization", "Accept"],
        "supports_credentials": False
    }
})

# Път към preprocessing метаданни
PROJECT_ROOT = Path(__file__).resolve().parents[1]
METADATA_PATH = PROJECT_ROOT / "models" / "preprocessing" / "preprocessing_metadata.json"


@app.route("/", methods=["GET"])
def index():
    """
    Root endpoint - показва информация за API-то
    """
    return """
    <!DOCTYPE html>
    <html lang="bg">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Demand Forecasting API</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                max-width: 800px;
                margin: 50px auto;
                padding: 20px;
                background: #f5f5f5;
            }
            .container {
                background: white;
                padding: 30px;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            h1 {
                color: #2563eb;
                margin-top: 0;
            }
            .endpoint {
                background: #f8f9fa;
                padding: 15px;
                margin: 10px 0;
                border-radius: 5px;
                border-left: 4px solid #2563eb;
            }
            .method {
                display: inline-block;
                padding: 3px 8px;
                border-radius: 3px;
                font-weight: bold;
                font-size: 12px;
                margin-right: 10px;
            }
            .get { background: #10b981; color: white; }
            .post { background: #f59e0b; color: white; }
            code {
                background: #e5e7eb;
                padding: 2px 6px;
                border-radius: 3px;
                font-family: 'Monaco', 'Courier New', monospace;
            }
            a {
                color: #2563eb;
                text-decoration: none;
            }
            a:hover {
                text-decoration: underline;
            }
            .status {
                display: inline-block;
                padding: 5px 10px;
                background: #10b981;
                color: white;
                border-radius: 15px;
                font-size: 14px;
                margin-bottom: 20px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <span class="status">✓ API is running</span>
            <h1>🚀 Demand Forecasting API</h1>
            <p>REST API за предсказване на продажби използвайки ML модел.</p>
            
            <h2>📡 Available Endpoints</h2>
            
            <div class="endpoint">
                <span class="method get">GET</span>
                <strong>/api/health</strong>
                <p>Проверява дали API-то работи</p>
                <a href="/api/health">Test →</a>
            </div>
            
            <div class="endpoint">
                <span class="method get">GET</span>
                <strong>/api/features</strong>
                <p>Връща валидните стойности за категориалните полета</p>
                <a href="/api/features">View →</a>
            </div>
            
            <div class="endpoint">
                <span class="method post">POST</span>
                <strong>/api/predict</strong>
                <p>Изпраща заявка за предсказване. Използвай <code>Content-Type: application/json</code></p>
                <p><small>Трябва да изпратиш JSON с 36 полета (виж документацията)</small></p>
            </div>
            
            <h2>📚 Documentation</h2>
            <p>За повече информация, виж <code>backend/README.md</code></p>
            
            <h2>🔗 Frontend</h2>
            <p>React frontend е на <a href="http://localhost:8080" target="_blank">http://localhost:8080</a></p>
        </div>
    </body>
    </html>
    """, 200


@app.route("/api/health", methods=["GET", "OPTIONS"])
def health_check():
    """
    Health check endpoint - проверява дали API-то работи
    """
    # Handle CORS preflight
    if request.method == "OPTIONS":
        response = jsonify({"status": "ok"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type")
        response.headers.add("Access-Control-Allow-Methods", "GET, OPTIONS")
        return response, 200
    
    response = jsonify({
        "status": "healthy",
        "service": "demand-forecasting-api",
        "version": "1.0.0"
    })
    
    # Добавя CORS headers
    response.headers.add("Access-Control-Allow-Origin", "*")
    
    return response, 200


@app.route("/api/features", methods=["GET", "OPTIONS"])
def get_features():
    """
    Връща валидните стойности за категориалните полета
    Използва се от React frontend за попълване на dropdown менюта
    """
    # Handle CORS preflight
    if request.method == "OPTIONS":
        response = jsonify({"status": "ok"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type")
        response.headers.add("Access-Control-Allow-Methods", "GET, OPTIONS")
        return response, 200
    
    try:
        if not METADATA_PATH.exists():
            return jsonify({
                "error": "Preprocessing metadata not found"
            }), 404
        
        with open(METADATA_PATH, 'r') as f:
            metadata = json.load(f)
        
        # Връща само категориалните стойности
        response = jsonify({
            "categories": metadata.get("label_encoder_categories", {}),
            "feature_cols": metadata.get("feature_cols", []),
            "numeric_cols": metadata.get("numeric_cols", []),
            "categorical_cols": metadata.get("categorical_cols", [])
        })
        
        # Добавя CORS headers
        response.headers.add("Access-Control-Allow-Origin", "*")
        
        return response, 200
    
    except Exception as e:
        return jsonify({
            "error": f"Failed to load features metadata: {str(e)}"
        }), 500


@app.route("/api/predict", methods=["POST", "OPTIONS"])
def predict():
    """
    Основен endpoint за предсказвания
    
    Приема JSON payload с всички необходими features (36 полета)
    Връща предсказаната продажба
    
    Example request:
    {
        "item_id": "HOBBIES_1_001",
        "dept_id": "HOBBIES_1",
        ...
        "price_vs_avg": 1.0
    }
    
    Example response:
    {
        "prediction": 5.67,
        "status": "success"
    }
    """
    # Handle CORS preflight
    if request.method == "OPTIONS":
        response = jsonify({"status": "ok"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type")
        response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
        return response, 200
    
    try:
        # Проверка за валиден JSON
        if not request.is_json:
            return jsonify({
                "error": "Content-Type must be application/json"
            }), 400
        
        payload = request.get_json()
        
        if payload is None:
            return jsonify({
                "error": "Invalid JSON payload"
            }), 400
        
        # Изпълнява предсказването чрез ML модула
        prediction = run_model_inference(payload)
        
        response = jsonify({
            "prediction": float(prediction),
            "status": "success"
        })
        
        # Добавя CORS headers
        response.headers.add("Access-Control-Allow-Origin", "*")
        
        return response, 200
    
    except KeyError as e:
        # Липсващи полета
        return jsonify({
            "error": f"Missing required field: {str(e)}",
            "message": "Please ensure all 36 feature fields are provided"
        }), 400
    
    except ValueError as e:
        # Невалидни стойности
        return jsonify({
            "error": f"Invalid input value: {str(e)}"
        }), 400
    
    except Exception as e:
        # Други грешки (model loading, preprocessing, etc.)
        import traceback
        error_details = traceback.format_exc()
        print(f"Prediction error: {error_details}")
        
        return jsonify({
            "error": f"Prediction failed: {str(e)}",
            "message": "An error occurred while processing your request"
        }), 500


@app.errorhandler(404)
def not_found(error):
    """Handler за неизвестни endpoints"""
    return jsonify({
        "error": "Endpoint not found",
        "available_endpoints": [
            "GET /api/health",
            "GET /api/features",
            "POST /api/predict"
        ]
    }), 404


@app.errorhandler(500)
def internal_error(error):
    """Handler за вътрешни грешки"""
    return jsonify({
        "error": "Internal server error",
        "message": "An unexpected error occurred"
    }), 500


if __name__ == "__main__":
    # Development server
    # Порт 5001 по подразбиране за да избегне конфликт с AirPlay на macOS (който използва 5000)
    port = int(os.environ.get("PORT", 5001))
    debug = os.environ.get("FLASK_DEBUG", "True").lower() == "true"
    
    print(f"🚀 Starting Flask API server on port {port}")
    print(f"🌐 API Homepage: http://localhost:{port}/")
    print(f"📡 Health check: http://localhost:{port}/api/health")
    print(f"📊 Features: http://localhost:{port}/api/features")
    print(f"🎯 Predict: http://localhost:{port}/api/predict")
    
    app.run(host="0.0.0.0", port=port, debug=debug)

