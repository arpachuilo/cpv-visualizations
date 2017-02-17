import json
import csv
import sys
import os.path

# Load mouse data
mouse = []
with open('data/mouse/' + sys.argv[1] + '.json', 'rb') as file:
    mouse = json.load(file)

# Load eye tracking data
eye = []
with open('data/eye/' + sys.argv[1] + '.csv', 'rb') as file:
    d = csv.reader(file, delimiter=',')
    for row in d:
        eye.append(row)

subKeys = {
    'officesCleared': 'offices',
    'officeMouseEnter': 'offices',
    'officeClicked': 'offices',
    'sliderMoved': 'offices',
    'accessTimeClicked': 'table',
    'histogramBrushStart': 'overviewHist',
    'histogramBrushEnd': 'overviewHist',
    'headerClicked': 'table',
    'rowClicked': 'table',
    'rowMouseOver': 'table',
    'tableToggleSelected': 'table',
    'pageChange': 'table',
    'histogramBarClick': 'detailHist',
    'histogramBarMouseEnter': 'detailHist',
    'graphNodeMouseEnter': 'graph'
}

def innerloop(e, t):
    eAOI = ''
    eTime = 0

    for e in eye:
        if int(e[3]) > t:
            break
        else:
            eAOI = e[4]
            eTime = e[3]
    return eAOI

hits = 0
for m in mouse:
    mAOI = subKeys[m.get('id')]
    mTime = m.get('date')

    eAOI = innerloop(eye, mTime)

    if eAOI == mAOI:
        m['hit'] = True
        hits = hits + 1
    else:
        m['hit'] = False

print(hits, len(mouse))

# Dump to new csv file
filename = 'data/mouse/hits-' + sys.argv[1]
with open(filename, 'wb') as file:
    file.write(json.dumps(mouse, indent=4))
