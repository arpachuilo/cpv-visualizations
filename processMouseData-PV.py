# RUN AS: python processMouseData-PV.py [FILENAME]

import matplotlib.path as mplPath
import numpy as np
import json
import dateutil.parser
import time
import sys
import os.path

# Load mouse interaction data
jsonData = []
with open(sys.argv[1], 'rb') as file:
    jsonData = json.load(file)

# Flatten
data = []
for key in jsonData[0]:
    if key != 'id':
        for d in jsonData[0][key]:
            d['id'] = key
            data.append(d)

# Sort data
data.sort(key=lambda x: x.get('date'))

# Zero base time
zero = data[0].get('date')
for d in data:
    t = d.get('date')
    d['date'] = t - zero

# Dump to new csv file
filename = os.path.dirname(sys.argv[1]) + 'converted-' + os.path.basename(sys.argv[1])
with open(filename, 'wb') as file:
    file.write(json.dumps(data, indent=4))
