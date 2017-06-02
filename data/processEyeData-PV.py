# TO RUN: python processEyeData-PV.py [FILENAME] [TIMEOFFSET]

# TIMEOFFSET is just the time of the first mouse interaction that happened with the associated user
# NOTE: Trim time based on ids
# PV-C: 1493223410994
# PV-D: 1493845551957
# PV-E: 1494343866740
# PV-F: 1494871687539
# PV-G: 1494873841748

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
# Setup was 1920x1080
# NOTE: Each is defined as an (x, y, width, height)
genBarChart = [0, 0, 640, 303]
genBarChartBB = mplPath.Path(np.array([[genBarChart[0], genBarChart[1]],
                     [genBarChart[0] + genBarChart[2], genBarChart[1]],
                     [genBarChart[0] + genBarChart[2], genBarChart[1] + genBarChart[3]],
                     [genBarChart[1], genBarChart[1] + genBarChart[3]]]))

starPlot = [0, 303, 640, 486]
starPlotBB = mplPath.Path(np.array([[starPlot[0], starPlot[1]],
                     [starPlot[0] + starPlot[2], starPlot[1]],
                     [starPlot[0] + starPlot[2], starPlot[1] + starPlot[3]],
                     [starPlot[1], starPlot[1] + starPlot[3]]]))

questionArea = [0, 879, 640, 291]
questionAreaBB = mplPath.Path(np.array([[questionArea[0], questionArea[1]],
                     [questionArea[0] + questionArea[2], questionArea[1]],
                     [questionArea[0] + questionArea[2], questionArea[1] + questionArea[3]],
                     [questionArea[1], questionArea[1] + questionArea[3]]]))

scatterPlot = [640, 0, 1280, 897]
scatterPlotBB = mplPath.Path(np.array([[scatterPlot[0], scatterPlot[1]],
                     [scatterPlot[0] + scatterPlot[2], scatterPlot[1]],
                     [scatterPlot[0] + scatterPlot[2], scatterPlot[1] + scatterPlot[3]],
                     [scatterPlot[1], scatterPlot[1] + scatterPlot[3]]]))

XaxisSelection = [640, 897, 640, 80]
XaxisSelectionBB = mplPath.Path(np.array([[XaxisSelection[0], XaxisSelection[1]],
                     [XaxisSelection[0] + XaxisSelection[2], XaxisSelection[1]],
                     [XaxisSelection[0] + XaxisSelection[2], XaxisSelection[1] + XaxisSelection[3]],
                     [XaxisSelection[1], XaxisSelection[1] + XaxisSelection[3]]]))

YaxisSelection = [1280, 897, 640, 80]
YaxisSelectionBB = mplPath.Path(np.array([[YaxisSelection[0], YaxisSelection[1]],
                     [YaxisSelection[0] + YaxisSelection[2], YaxisSelection[1]],
                     [YaxisSelection[0] + YaxisSelection[2], YaxisSelection[1] + YaxisSelection[3]],
                     [YaxisSelection[1], YaxisSelection[1] + YaxisSelection[3]]]))

typeSelection = [640, 977, 1280, 103]
typeSelectionBB = mplPath.Path(np.array([[typeSelection[0], typeSelection[1]],
                     [typeSelection[0] + typeSelection[2], typeSelection[1]],
                     [typeSelection[0] + typeSelection[2], typeSelection[1] + typeSelection[3]],
                     [typeSelection[1], typeSelection[1] + typeSelection[3]]]))

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
    if genBarChartBB.contains_point((x, y)):
        r.append('BarChart')
    elif starPlotBB.contains_point((x, y)):
        r.append('Starplot')
    elif questionAreaBB.contains_point((x, y)):
        r.append('QuestionArea')
    elif scatterPlotBB.contains_point((x, y)):
        r.append('Scatterplot')
    elif XaxisSelectionBB.contains_point((x, y)):
        r.append('xAxisSelection')
    elif YaxisSelectionBB.contains_point((x, y)):
        r.append('yAxisSelection')
    elif typeSelectionBB.contains_point((x, y)):
        r.append('TypeFilters')
    else:
        r.append('none')

# Dump to new csv file
filename = os.path.dirname(sys.argv[1]) + '/converted-' + os.path.basename(sys.argv[1])
with open(filename, 'wb') as file:
    d = csv.writer(file)
    d.writerows(data)
