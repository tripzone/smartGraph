import os
import json
from flask import Flask, request, redirect, jsonify
from flask_cors import CORS
import numpy as np
from sklearn.externals import joblib
import requests
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import pyrebase

import logging
logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
CORS(app)

@app.route("/test")
def home():
   return json.dumps({"success":True}), 200, {"ContentType":"application/json"}

@app.route("/predict", methods=["POST"])
def predict():
	if request.method == "POST":
		print('here bro', request.data)
		# return json.dumps([1,2,3]), 200, {"ContentType":"application/json"}
		model = joblib.load("model.pkl")
		probs = model.predict_proba(0)
		probSort = np.argsort(probs)[0]
		positions = []
		for x in range(0,len(probSort)):
		    positions.insert(0,np.where(probSort == x)[0][0]+1)
		print(positions)
		results = list(map(int, positions))
		return json.dumps(results), 200, {"ContentType":"application/json"}


if __name__ == "__main__":
  app.run(host="0.0.0.0", debug=True, port=600)
