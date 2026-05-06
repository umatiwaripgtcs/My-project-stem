# model_train.py
# This script trains a simple scikit-learn model using the Iris dataset.

import joblib
from sklearn import datasets
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

def train_model():
    print("Loading Iris dataset...")
    # Load dataset
    iris = datasets.load_iris()
    X = iris.data
    y = iris.target
    
    # Split the data into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("Training RandomForest model...")
    # Create and train a RandomForestClassifier
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    # Evaluate the model
    predictions = model.predict(X_test)
    accuracy = accuracy_score(y_test, predictions)
    print(f"Model trained with accuracy: {accuracy:.4f}")
    
    # Save the model and the class names
    model_data = {
        'model': model,
        'target_names': iris.target_names.tolist()
    }
    joblib.dump(model_data, 'model.pkl')
    print("Model saved as model.pkl")

if __name__ == "__main__":
    train_model()
