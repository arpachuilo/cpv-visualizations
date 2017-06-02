## ABOUT
This was made to help visualize user interaction logs and eye tracking.

## Pages Offered

### Video Heatmap
This view simply loads a user's video of the application and uses canvas to draw over them showing the last 5 seconds of where there mouse and eyes were.

### Segmented Heatmap
This view uses various segmention methods to generate multiple static heatmaps (both eye and mouse) based on the split times defined by the segmention.

### Dashboard
This view contains a stacked bar chart of user area of interest (AOI) over time. Each bar is binned by 1 minute of time with different colors representing the various AOI associated with the visualization. The stacked bar chart is also burshable -- this allows for a finer detail viewing of below of what a user was doing during that time. Just below this bar chart is a line graph that shows the change in filters over time during the visualizations use. The bottom left contains a simple picture of the application used with colored bounding boxes to act as a legend. The bottom right are two circle graphs, one for eye and mouse each, which show 2-way intransitons between various AOIs.

## Segmentation Methods

### Single Type AOI, Altering Top-1
This is the most basic segmentation method that works individually using eye or mouse (not both). First the data is binned by time the sub-binned by aoi. Then if the top AOI between two consecutive bins is different it is marked as an inflection to be used as a segmentation time.

### Pair Type AOI, Altering Top-1
This version is similar to the above strategy except it looks at both eye and mouse. Both datasets are binned by time then sub-binned by AOI. Then if the pair (eye/mouse) is different between two consecutive bins it is marked as an inflection to be used as a segmention time.

### Interaction Based, Top-2 Disjoint
This version is based on the various interactions that can be used within a single AOI. First the data is binned by time then sub-binned by interaction. The bins are scanned over looking for a new bin whose top-2 interactions are disjoint from the previous. For example if the top-2 were for four bins were `ab ad bd cd` then there would be a break point between bd and cd.

## HOW TO ADD DATA

### Pre-processing
For the cyber and pokemon applications the data has been processed using the python scripts contained in this repo. This must be done to each new file you want visualized.

### Loading data into the visualization
Within the ID.js file you will have to define the filename (without extension) to be loaded. Please note that when naming files your mouse, eye, and transcript data should all share the same filename.

### Non cyber/poke app related data
Since this was a prototype there are a few things that had to hard coded for each app since the data format changed. You are welcome to make this a general use platform or to continue hotfixing in new application formats.
