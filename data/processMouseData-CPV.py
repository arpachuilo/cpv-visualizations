# RUN AS: python processMouseData-PV.py [FILENAME]
# NOTE: Things were done to make this data less messy via this script

import matplotlib.path as mplPath
import numpy as np
import json
import dateutil.parser
import time
import sys
import os.path

import random

# Bounding box for info x,y,width,height
info = [1066, 303, 920, 192]
infoBB = mplPath.Path(np.array([[info[0], info[1]],
                     [info[0] + info[2], info[1]],
                     [info[0] + info[2], info[1] + info[3]],
                     [info[1], info[1] + info[3]]]))


# Load mouse interaction data
jsonData = []
with open(sys.argv[1], 'rb') as file:
    jsonData = json.load(file)

# Add info tag with id: infoHover
jsonData[0]['infoHover'] = []
for d in jsonData[0]['mouseEnter']:
    if infoBB.contains_point((d['x'], d['y'])):
        t = {}
        t['x'] = d['x']
        t['y'] = d['y']
        t['target'] = 'info'
        t['eventType'] = 'mouseenter'
        t['date'] = d['date']
        t['filters'] = {}
        jsonData[0]['infoHover'].append(t)

# Flatten
data = []
for key in jsonData[0]:
    if key != 'id' and key != 'mouseEnter':
        for d in jsonData[0][key]:
            d['id'] = key
            data.append(d)

# Sort data
data.sort(key=lambda x: x.get('date'))

# bbox top, bottom, left, right
prevBtn = [1021, 1059, 1123, 1250]
nextBtn = [1021, 1059, 1767, 1863]

hAccessTime = [527, 563, 1123, 1337]
hSrcIP = [527, 563, 1337, 1448]
hDstIP = [527, 563, 1448, 1578]
hSock = [527, 563, 1578, 1666]
hReqSize = [527, 563, 1666, 1769]
hRespSize = [527, 563, 1769, 1863]

tableToggle = [505, 518, 1264, 1277]

slideDay = [25, 46, 1158, 1287]
slideHour = [25, 46, 1330, 1458]
slideMinute = [25, 46, 1518, 1647]

histBrush = [333, 558, 19, 1085]

# Add (x, y) to histogramBrushStart, histogramBrushEnd
for d in data:
    if d['id'] == 'pageChange':
        if d['target'] == 'next button':
            d['x'] = random.randint(nextBtn[2], nextBtn[3])
            d['y'] = random.randint(nextBtn[0], nextBtn[1])
        if d['target'] == 'prev button':
            d['x'] = random.randint(prevBtn[2], prevBtn[3])
            d['y'] = random.randint(prevBtn[0], prevBtn[1])
    if d['id'] == 'headerClicked':
        if d['target'] == 'header AccessTime':
            d['x'] = random.randint(hAccessTime[2], hAccessTime[3])
            d['y'] = random.randint(hAccessTime[0], hAccessTime[1])
        if d['target'] == 'header DestIP':
            d['x'] = random.randint(hDstIP[2], hDstIP[3])
            d['y'] = random.randint(hDstIP[0], hDstIP[1])
        if d['target'] == 'header SourceIP':
            d['x'] = random.randint(hSrcIP[2], hSrcIP[3])
            d['y'] = random.randint(hSrcIP[0], hSrcIP[1])
        if d['target'] == 'header Socket':
            d['x'] = random.randint(hSock[2], hSock[3])
            d['y'] = random.randint(hSock[0], hSock[1])
        if d['target'] == 'header ReqSize':
            d['x'] = random.randint(hReqSize[2], hReqSize[3])
            d['y'] = random.randint(hReqSize[0], hReqSize[1])
        if d['target'] == 'header RespSize':
            d['x'] = random.randint(hRespSize[2], hRespSize[3])
            d['y'] = random.randint(hRespSize[0], hRespSize[1])
    if d['id'] == 'tableToggleSelected':
        d['x'] = random.randint(tableToggle[2], tableToggle[3])
        d['y'] = random.randint(tableToggle[0], tableToggle[1])
    if d['id'] == 'sliderMoved':
        if d['target'] == 'daySlider':
            d['x'] = random.randint(slideDay[2], slideDay[3])
            d['y'] = random.randint(slideDay[0], slideDay[1])
        if d['target'] == 'hourSlider':
            d['x'] = random.randint(slideHour[2], slideHour[3])
            d['y'] = random.randint(slideHour[0], slideHour[1])
        if d['target'] == 'minuteSlider':
            d['x'] = random.randint(slideMinute[2], slideMinute[3])
            d['y'] = random.randint(slideMinute[0], slideMinute[1])
    if d['id'] == 'histogramBrushStart' or d['id'] == 'histogramBrushEnd':
        d['x'] = random.randint(histBrush[2], histBrush[3])
        d['y'] = random.randint(histBrush[0], histBrush[1])


# Zero base time
zero = dateutil.parser.parse(data[0].get('date'))
zero = int(time.mktime(zero.timetuple())) * 1000
for d in data:
    t = dateutil.parser.parse(d.get('date'))
    t = int(time.mktime(t.timetuple())) * 1000
    d['date'] = t - zero

# Add filters to infoHover
prevFilter = {}
for d in data:
    if d['id'] == 'infoHover':
        d['filters'] = prevFilter
    if 'filters' in d:
        prevFilter = d['filters']

# Dump to new csv file
filename = os.path.dirname(sys.argv[1]) + 'converted-' + os.path.basename(sys.argv[1])
with open(filename, 'wb') as file:
    file.write(json.dumps(data, indent=4))
