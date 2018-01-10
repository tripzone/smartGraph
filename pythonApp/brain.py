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

config = json.load(open('./private/config.json'))
firebase = pyrebase.initialize_app(config)
db = firebase.database()

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
		print('here bro', request.form)
		device = request.get_data().decode('utf-8')
		if (device == "desktop"):
			deviceType = 0
		else:
			deviceType = 1
		# return json.dumps([1,2,3]), 200, {"ContentType":"application/json"}
		model = joblib.load("model.pkl")
		probs = model.predict_proba(deviceType)
		probSort = np.argsort(probs)[0]
		positions = (np.flip(probSort, axis=0) +1).tolist()
		print(positions)
		results = list(map(int, positions))
		print('btw it is', device, type(device))

		return json.dumps(results), 200, {"ContentType":"application/json"}

@app.route("/train", methods=["POST"])
def train():
	if request.method == "POST":
		data = db.get().val()['users']
		cat = []
		device = []
		for x in data:
		    cat.append(data[x]['category'])
		    device.append(data[x]['device'])
		df= pd.DataFrame({"cat":cat, "device":device})
		x=pd.get_dummies(df['device'],drop_first=True)
		y=df['cat']

		RC = RandomForestClassifier()
		RC.fit(x,y)
		joblib.dump(RC, 'model.pkl')
		return json.dumps({"success":1}), 200, {"ContentType":"application/json"}


if __name__ == "__main__":
  app.run(host="0.0.0.0", debug=True, port=600)
