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
    if key != 'id' and key != 'mouseEnter':
        for d in jsonData[0][key]:
            d['id'] = key
            data.append(d)

# Sort data
data.sort(key=lambda x: x.get('date'))

# Add (x, y) to histogramBrushStart, histogramBrushEnd, pageChange, sliderMoved, headerClicked, tableToggleSelected

# Zero base time
zero = dateutil.parser.parse(data[0].get('date'))
zero = int(time.mktime(zero.timetuple())) * 1000
for d in data:
    t = dateutil.parser.parse(d.get('date'))
    t = int(time.mktime(t.timetuple())) * 1000
    d['date'] = t - zero

# Dump to new csv file
filename = os.path.dirname(sys.argv[1]) + '/converted-' + os.path.basename(sys.argv[1])
with open(filename, 'wb') as file:
    file.write(json.dumps(data, indent=4))
