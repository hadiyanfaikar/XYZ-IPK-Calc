import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

# Configure Flask to serve static files from the frontend directory
frontend_folder = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'frontend'))
app = Flask(__name__, static_folder=frontend_folder, static_url_path='/')
# Enable CORS for the frontend origin
CORS(app)

@app.route('/')
def index():
    return app.send_static_file('index.html')

def get_grade_info(nsm):
    if nsm > 85:
        return {"nmk": "A", "point": 4.00}
    elif nsm > 75:
        return {"nmk": "AB", "point": 3.50}
    elif nsm > 65:
        return {"nmk": "B", "point": 3.00}
    elif nsm > 60:
        return {"nmk": "BC", "point": 2.50}
    elif nsm > 50:
        return {"nmk": "C", "point": 2.00}
    elif nsm > 40:
        return {"nmk": "D", "point": 1.00}
    else:
        return {"nmk": "E", "point": 0.00}

@app.route('/api/calculate', methods=['POST'])
def calculate_ipk():
    data = request.json
    if not data or 'courses' not in data:
        return jsonify({"error": "Invalid request"}), 400

    courses = data['courses']
    total_sks = 0
    total_quality_points = 0
    results = []

    for course in courses:
        name = course.get('name', 'Unknown Course')
        try:
            credits = float(course.get('credits', 0))
            nsm = float(course.get('nsm', 0))
        except ValueError:
            return jsonify({"error": "Credits and NSM must be valid numbers"}), 400

        grade_info = get_grade_info(nsm)
        nmk = grade_info['nmk']
        point = grade_info['point']
        
        quality_points = credits * point
        total_sks += credits
        total_quality_points += quality_points

        results.append({
            "name": name,
            "credits": credits,
            "nsm": nsm,
            "nmk": nmk,
            "point": point,
            "quality_points": quality_points
        })

    ipk = total_quality_points / total_sks if total_sks > 0 else 0

    return jsonify({
        "ipk": round(ipk, 2),
        "total_sks": total_sks,
        "total_quality_points": total_quality_points,
        "courses": results
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
