# RUN AS ./processEyeData-CPV.py [FILENAME] [TIMEOFFSET]

# TIMEOFFSET is just the time of the first mouse interaction that happened with the associated user
# NOTE: Trim time based on ids (offset)
# CPV-A: 1479489115000
# CPV-B: 1479496740000
# CPV-C: 1479521438000
# CPV-D: 1479531091000
# CPV-E: 1479774004000
# CPV-F: 1479860515000
# CPV-G: 1479936921000
# CPV-H: 1479954622000
# CPV-I: 1480533497000
# CPV-J: 1480627248000

#NOTE: Tested and used on linux
import matplotlib.path as mplPath
import numpy as np
import csv
import sys
import os.path

# Load eye tracking data
data = []
with open(sys.argv[1], 'rb') as file:
    d = csv.reader(file, delimiter=',')
    for row in d:
        data.append(row)

# Setup bounding boxes
# NOTE: Each is defined as an (x, y, width, height)
dHist = [0, 0, 1066, 331]
dHistBB = mplPath.Path(np.array([[dHist[0], dHist[1]],
                     [dHist[0] + dHist[2], dHist[1]],
                     [dHist[0] + dHist[2], dHist[1] + dHist[3]],
                     [dHist[1], dHist[1] + dHist[3]]]))

oHist = [0, 331, 1066, 223]
oHistBB = mplPath.Path(np.array([[oHist[0], oHist[1]],
                     [oHist[0] + oHist[2], oHist[1]],
                     [oHist[0] + oHist[2], oHist[1] + oHist[3]],
                     [oHist[1], oHist[1] + oHist[3]]]))

graph = [0, 554, 1066, 526]
graphBB = mplPath.Path(np.array([[graph[0], graph[1]],
                     [graph[0] + graph[2], graph[1]],
                     [graph[0] + graph[2], graph[1] + graph[3]],
                     [graph[1], graph[1] + graph[3]]]))

bnt = [1066, 0, 920, 272]
bntBB = mplPath.Path(np.array([[bnt[0], bnt[1]],
                     [bnt[0] + bnt[2], bnt[1]],
                     [bnt[0] + bnt[2], bnt[1] + bnt[3]],
                     [bnt[1], bnt[1] + bnt[3]]]))

bntKey = [1066, 272, 920, 31]
bntKeyBB = mplPath.Path(np.array([[bntKey[0], bntKey[1]],
                     [bntKey[0] + bntKey[2], bntKey[1]],
                     [bntKey[0] + bntKey[2], bntKey[1] + bntKey[3]],
                     [bntKey[1], bntKey[1] + bntKey[3]]]))

info = [1066, 303, 920, 192]
infoBB = mplPath.Path(np.array([[info[0], info[1]],
                     [info[0] + info[2], info[1]],
                     [info[0] + info[2], info[1] + info[3]],
                     [info[1], info[1] + info[3]]]))

table = [1066, 495, 920, 585]
tableBB = mplPath.Path(np.array([[table[0], table[1]],
                     [table[0] + table[2], table[1]],
                     [table[0] + table[2], table[1] + table[3]],
                     [table[1], table[1] + table[3]]]))

time = sys.argv[2]
# Trim based on given time
data = [x for x in data if x[3] > time]

# 0 base each timestamp
for x in data:
    x[3] = int(x[3]) - int(time)

# Get AOI of each x,y coordiante
for r in data:
    x = -1
    y = -1
    if r[1] != '-nan(ind)' and r[2] != '-nan(ind)':
        x = float(r[1])
        y = float(r[2])
    if dHistBB.contains_point((x, y)):
        r.append('detailHist')
    elif oHistBB.contains_point((x, y)):
        r.append('overviewHist')
    elif graphBB.contains_point((x, y)):
        r.append('graph')
    elif bntBB.contains_point((x, y)):
        r.append('offices')
    elif bntKeyBB.contains_point((x, y)):
        r.append('offices')
    elif infoBB.contains_point((x, y)):
        r.append('info')
    elif tableBB.contains_point((x, y)):
        r.append('table')
    else:
        r.append('none')

# Dump to new csv file
filename = os.path.dirname(sys.argv[1]) + '/converted-' + os.path.basename(sys.argv[1])
with open(filename, 'wb') as file:
    d = csv.writer(file)
    d.writerows(data)
