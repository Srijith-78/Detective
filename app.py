from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import json
import os
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import accuracy_score

app = Flask(__name__)
CORS(app, supports_credentials=True, methods=['GET', 'POST'])

# Variables to store the trained models and vectorizers
chatbot_models = {}
vectorizers = {}

# Define a route for the main page
@app.route('/')
def index():
    return send_from_directory('public', 'index.html')

# Define a route to serve static files from the 'public' directory
@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory(os.path.abspath('public'), filename)

# Define a route for scripts.js
@app.route('/scripts.js')
def serve_scripts():
    return send_from_directory('public', 'scripts.js')

@app.route('/api/startBackend', methods=['GET', 'POST'])
def hello_backend():
    if request.method == 'GET':
        return jsonify(message='Hello Backend')
    elif request.method == 'POST':
        data = request.json  # Access JSON data from the request

        # Access the 'userInput' and 'currentChatTarget' from the JSON data
        user_input = data.get('userInput', '')
        current_chat_target = data.get('currentChatTarget', 'None')  # Default to 'Kajal' if not provided

        # Preprocess the input (your preprocessing goes here)
        processed_input = preprocess_input(user_input)

        # Load chat data and train chatbot models
        chat_data_file = os.path.join('public', 'data', f'{current_chat_target}_chat.json')
        person_data = load_chat_data(chat_data_file, current_chat_target)
        train_chatbot_model(person_data, current_chat_target)

        # Access the trained model and vectorizer
        classifier = chatbot_models.get(current_chat_target)
        vectorizer = vectorizers.get(current_chat_target)

        if classifier and vectorizer:
            # Your processing logic here
            # Example: Use the classifier and vectorizer to get a response
            response = get_chatbot_response(processed_input, classifier, vectorizer, person_data)
            return jsonify(response=response)
        else:
            return jsonify(error='Model not found for the current chat target')




def preprocess_input(user_input):
    processed_input = user_input.lower().replace('a', '').replace('is', '').replace('was', '').replace('be', '')
    return processed_input

def load_chat_data(file_path, person):
    try:
        with open(file_path, 'r') as file:
            data = json.load(file)
        return pd.DataFrame(data)
    except FileNotFoundError as e:
        raise FileNotFoundError(f"Chat data file '{file_path}' not found for {person}.") from e

def train_chatbot_model(chat_data, person):
    if chat_data.empty:
        print(f"Warning: Chat data is empty for {person}. Skipping training.")
        return

    train_data, test_data = train_test_split(chat_data, test_size=0.2, random_state=42)

    if train_data.empty or test_data.empty:
        print(f"Warning: Insufficient data for training the chatbot model for {person}. Skipping training.")
        return

    vectorizer = CountVectorizer()
    X_train = vectorizer.fit_transform(train_data['text'])
    X_test = vectorizer.transform(test_data['text'])

    classifier = MultinomialNB()
    classifier.fit(X_train, train_data['label'])

    predictions = classifier.predict(X_test)
    accuracy = accuracy_score(test_data['label'], predictions)
    print(f'{person} Accuracy: {accuracy * 100:.2f}%')

    chatbot_models[person] = classifier
    vectorizers[person] = vectorizer

def get_chatbot_response(processed_input, classifier, vectorizer, chat_data):
    input_vectorized = vectorizer.transform([processed_input])
    prediction = classifier.predict(input_vectorized)[0]

    # Find the corresponding response for the predicted label
    response = find_response(prediction, chat_data)

    return response

def find_response(predicted_label, chat_data):
    # Search for the response associated with the predicted label
    for item in chat_data.to_dict('records'):
        if item['label'] == predicted_label:
            return item['response']

    # If no corresponding response is found, return a default response or handle it as needed
    return 'I apologize, but I don\'t have a specific response for that.'


# Load chat data and train chatbot models
person_names = ['Aravind', 'Dinesh','Lingesan', 'Anu', 'Martin', 'Maya','Nisha','David','Annapoorni', 'None']  # Add more names as needed

for person_name in person_names:
    chat_data_file = os.path.join('public', 'data', f'{person_name}_chat.json')
    person_data = load_chat_data(chat_data_file, person_name)
    train_chatbot_model(person_data, person_name)

if __name__ == "__main__":
    app.run(port=7000, debug=True)
