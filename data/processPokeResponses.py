# RUN AS: python processMouseData-PV.py [FILENAME]

import matplotlib.path as mplPath
import numpy as np
import json
import csv
import dateutil.parser
import time
import sys
import os.path

# Load mouse interaction data
jsonData = []
with open(sys.argv[1], 'rb') as file:
    jsonData = json.load(file)

# Flatten
zData = []
for key in jsonData[0]:
    if key == 'MouseEnter':
        for d in jsonData[0][key]:
            d['id'] = key
            zData.append(d)

# Sort data
zData.sort(key=lambda x: x.get('date'))

# Zero base time
zero = zData[0].get('date')

data = []
data.append([0, '(START)'])
for key in jsonData[0]:
    if key == 'Response':
        for d in jsonData[0][key]:
            t = d['date'] - zero
            r = d['response'].replace(',', ' ').replace('\n', ' ')
            data.append([t - 2000, 'placeholder'])
            data.append([t - 1000, '|' + r + '|'])
            data.append([t, '(INFLECTION)'])

data[len(data) - 1][1] = '(END)'

# Dump to new json file
filename = os.path.dirname(sys.argv[1]) + 'responses-' + os.path.basename(sys.argv[1]).replace('.json', '.csv')
with open(filename, 'wb') as file:
    d = csv.writer(file)
    d.writerows(data)
