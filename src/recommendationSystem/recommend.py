import pandas as pd
import numpy as np
import seaborn as sns
import plotly.express as px
import plotly.graph_objects as go
import matplotlib.pyplot as plt
import plotly
from sklearn.preprocessing import StandardScaler
from scipy.spatial import distance
import copy
import warnings
from flask import Flask, render_template, redirect, url_for,request
from flask import make_response
from flask_cors import CORS
import os
import json
warnings.filterwarnings("ignore")
data=pd.read_csv(os.path.join(os.path.dirname(__file__), "./genres_v2.csv"))
data.drop('Unnamed: 0',axis=1,inplace=True)
data=data.dropna(subset=['song_name'])
df=data[data.columns[:11]]
df['genre']=data['genre']
df['time_signature']=data['time_signature']
df['duration_ms']=data['duration_ms']
df['song_name']=data['song_name']
x=df[df.drop(columns=['song_name','genre']).columns].values
scaler = StandardScaler().fit(x)
X_scaled = scaler.transform(x)
df[df.drop(columns=['song_name','genre']).columns]=X_scaled

# This is a function to find the closest song name from the list
def find_word(word,words):
    t=[]
    count=0
    if word[-1]==' ':
        word=word[:-1]
    for i in words:
        if word.lower() in i.lower():
            t.append([len(word)/len(i),count])
        else:
            t.append([0,count])
        count+=1
    t.sort(reverse=True)
    return words[t[0][1]]
  
# Making a weight matrix using euclidean distance
def make_matrix(data,song,number):
    df=pd.DataFrame()
    data.drop_duplicates(inplace=True)
    songs=data['song_name'].values
#    best = difflib.get_close_matches(song,songs,1)[0]
    best=find_word(song,songs)
    print('The song closest to your search is :',best)
    genre=data[data['song_name']==best]['genre'].values[0]
    df=data[data['genre']==genre]
    x=df[df['song_name']==best].drop(columns=['genre','song_name']).values
    if len(x)>1:
        x=x[1]
    song_names=df['song_name'].values
    df.drop(columns=['genre','song_name'],inplace=True)
    df=df.fillna(df.mean())
    p=[]
    count=0
    for i in df.values:
        p.append([distance.euclidean(x,i),count])
        count+=1
    p.sort()
    res = []
    for i in range(1,number+1):
        print(song_names[p[i][1]])
        res.append(song_names[p[i][1]])
    return res
        
# a=input('Please enter The name of the song :')
# b=int(input('Please enter the number of recommendations you want: '))
# make_matrix(df,a,b)


'''
Flask Section
'''

app = Flask(__name__)
CORS(app)

@app.route("/recommend", methods=['POST'])
def recommend():
    song = request.form['song']
    recommended = make_matrix(df,song,5)
    resp = make_response(json.dumps(recommended))
    resp.headers['Content-Type'] = "application/json"
    return resp

if __name__ == "__main__":
    app.run(port=5001)
    
    