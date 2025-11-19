from flask import Flask, render_template, request, jsonify, redirect, url_for
import os
import sys
from pathlib import Path

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent))

app = Flask(__name__)

# Import ML inference function
try:
    from ml import run_model_inference
    ML_AVAILABLE = True
except ImportError:
    ML_AVAILABLE = False
    print("Warning: ML module not available. Predictions will be simulated.")

# Feature list that the model expects
FEATURE_LIST = [
    'temperature', 'humidity', 'wind_speed', 'precipitation',
    'solar_radiation', 'season', 'hour', 'day_of_week'
]

@app.route('/')
def index():
    """Home page"""
    return render_template('index.html')

@app.route('/predict', methods=['GET'])
def predict_form():
    """Show prediction form"""
    return render_template('predict.html', features=FEATURE_LIST)

@app.route('/predict', methods=['POST'])
def predict_submit():
    """Handle prediction submission"""
    try:
        # Get form data
        input_data = {}
        for feature in FEATURE_LIST:
            value = request.form.get(feature)
            if value is None or value == '':
                raise ValueError(f"Missing value for {feature}")
            input_data[feature] = float(value)
        
        # Run inference
        if ML_AVAILABLE:
            forecast = run_model_inference(input_data)
        else:
            # Simulated response for testing
            forecast = {
                'prediction': 42.5,
                'confidence_interval': [40.0, 45.0],
                'model_version': 'v2.0'
            }
        
        # Render results
        return render_template('results.html', 
                             forecast=forecast,
                             input_data=input_data)
    
    except ValueError as e:
        return render_template('error.html', 
                             error_message=f"Input error: {str(e)}"), 400
    except Exception as e:
        return render_template('error.html', 
                             error_message=f"Prediction failed: {str(e)}"), 500

@app.route('/how-it-works')
def how_it_works():
    """Show how it works page"""
    return render_template('how_it_works.html')

@app.route('/model-card')
def model_card():
    """Show model card page"""
    return render_template('model_card.html')

@app.route('/healthz')
def health_check():
    """Health check endpoint"""
    return "OK", 200

@app.errorhandler(404)
def page_not_found(e):
    """Handle 404 errors"""
    return render_template('error.html', 
                         error_message="Page not found"), 404

@app.errorhandler(500)
def internal_error(e):
    """Handle 500 errors"""
    return render_template('error.html', 
                         error_message="Internal server error"), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
