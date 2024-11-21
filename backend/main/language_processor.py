from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline

app = Flask(__name__)
CORS(app)

classifier = pipeline('sentiment-analysis', model='nlptown/bert-base-multilingual-uncased-sentiment')

@app.route('/process', methods=['POST'])
def process_text():
    data = request.get_json()
    text = data.get('text', '')
    language = data.get('language', 'English')
    try:
        result = classifier(text)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
@app.route('/process-query', methods=['POST'])
def process_query():
    data = request.json
    query = data['query']
    language = data['language']

    # Use language to adjust model behavior (if necessary)
    # Example: Process multilingual queries
    result = model(query, candidate_labels=["Trade Compliance", "Documentation", "Customs Regulations"])
    
    return jsonify({"response": result})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
