// clears the canvas for a new draw
function clearCanvas()
{
    var canvas = document.getElementById("myCanvas");
    var context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
}

// hold the loaded features
var features = null;
var featureInfo = null;


// load/draw features
function drawFeatures()
{
    if(!features)
    {
        loadFeatures();
    }
    else
    {
        drawLocalFeatures();
    }
}

// calculates the extents of the loaded features
function calculateFeatureInfo()
{
    var bbox = turf.bbox(features);
    featureInfo = new Object();
    featureInfo.minx = bbox[0];
    featureInfo.miny = bbox[1];
    featureInfo.maxx = bbox[2];
    featureInfo.maxy = bbox[3];
    featureInfo.centrex = (bbox[0] + bbox[2]) / 2;
    featureInfo.centrey = (bbox[1] + bbox[3]) / 2;
    featureInfo.width = bbox[2] - bbox[0];
    featureInfo.height = bbox[3] - bbox[1];
    featureInfo.max_dim = Math.max(featureInfo.width,featureInfo.height);
}

// initialises the view controls based on the loaded feature info
function setupControls()
{
    rangeCentreX.min = Math.round(featureInfo.minx);
    rangeCentreX.max = Math.round(featureInfo.maxx);
    rangeCentreX.value = Math.round(featureInfo.centrex);

    rangeCentreY.min = Math.round(featureInfo.miny);
    rangeCentreY.max = Math.round(featureInfo.maxy);
    rangeCentreY.value = Math.round(featureInfo.centrey);

    rangeScale.max = Math.round(featureInfo.max_dim);
    rangeScale.value = Math.round(featureInfo.max_dim);
}

// sets up the transform on the canvas based on the view controls
function setupTransform(canvas, context)
{
    var r = document.getElementById("rangeAngle");
    var tx = document.getElementById("rangeCentreX");
    var ty = document.getElementById("rangeCentreY");
    var sc = document.getElementById("rangeScale");
    var scalefactor = canvas.width/sc.value;

    var t = new Transform();
    t.apply(new Translate(-parseFloat(tx.value),-parseFloat(ty.value)));
    t.apply(new HorizontalFlip());
    t.apply(new Rotate(parseFloat(r.value)));
    t.apply(new Scale(scalefactor));
    t.apply(new Translate(250, 250));

    currentTransform = t;
    currentInverse = t.inverse();
    currentScaleFactor = scalefactor;

    context.setTransform(t.matrix[0][0],t.matrix[1][0],t.matrix[0][1],t.matrix[1][1],t.matrix[0][2],t.matrix[1][2]);
/*
    context.translate(250,250);
    context.scale(scalefactor,-scalefactor);
    context.rotate(parseFloat(r.value));
    context.translate(-parseFloat(tx.value),-parseFloat(ty.value));
*/
}

// draws the loaded features
function drawLocalFeatures()
{
    clearCanvas();

    var canvas = document.getElementById("myCanvas");
    var context = canvas.getContext("2d");

    setupTransform(canvas, context);

    turf.geomEach(features, function (currentGeometry, currentIndex) {
        var type = turf.getGeomType(currentGeometry);
        var coords = turf.getCoords(currentGeometry);

        switch(type)
        {
            case "Point":
                context.drawGeoJSONPoint(coords, "#000000", 1/currentScaleFactor);
                break;
            case "LineString":
                context.drawGeoJSONLine(coords, "#000000", 1/currentScaleFactor);
                break;
            case "MultiLineString":
                context.drawGeoJSONMultiLine(coords, "#000000", 1/currentScaleFactor);
                break;
            case "Polygon":
                context.drawGeoJSONPolygon(coords, '#FFFFFF', '#0', 0.5/currentScaleFactor);
                break;
            case "MultiPolygon":
                context.drawGeoJSONMultiPolygon(coords, '#FFFFFF', '#0', 0.5/currentScaleFactor);
                break;
            default:
                alert("Can't draw " + type);
        }
    });

    // reset transform
    context.setTransform(1,0,0,1,0,0);
}

// resets the view controls
function onReset()
{
    rangeAngle.value = 0;
    rangeCentreX.value = featureInfo.centrex;
    rangeCentreY.value = featureInfo.centrey;
    rangeScale.value = featureInfo.max_dim;
    drawFeatures();
}

// callback to add geojson to map from text
function geojson_callback(geojson_text)
{
    features = JSON.parse(geojson_text);
    //alert("Loaded " + features.features.length + " features");
    calculateFeatureInfo();
    setupControls();
    drawLocalFeatures();
}

// loads data from a file
function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

// Identify function
function onCanvasClicked(event)
{
    var myCanvas = document.getElementById("myCanvas");
    var x = event.layerX - myCanvas.offsetLeft;
    var y = event.layerY - myCanvas.offsetTop;

    var p = new Point(x,y);
    var p2 = currentInverse.transformPoint(p);
    var pt = turf.point([p2.x, p2.y]);

    var type = features.features[0].geometry.type;

    if(type === "Polygon") {
        turf.geomEach(features, function (currentGeometry, currentIndex) {
            if (turf.inside(pt, currentGeometry)) {
                showSelectedFeature(features.features[currentIndex].properties);
            }
        });
    }
    else if (type === "Point") {
        var nearest = turf.nearest(pt, features);
        if(turf.distance(pt, nearest.geometry) < 100) // default kilometers
            showSelectedFeature(nearest.properties);
    }
    else
    {
        alert("Can't identify this geometry type");
    }
}

// show selected feature properties
function showSelectedFeature(properties)
{
    var table = document.getElementById("selectedFeatureAttributesTable");
    var new_tbody = document.createElement('tbody');
    if(properties) {
        for (var key in properties) {
            if (properties.hasOwnProperty(key)) {
                var row = document.createElement("tr");
                row.innerHTML = "<td>" + key + "</td><td>" + properties[key] + "</td>";
                new_tbody.appendChild(row);
            }
        }
    }
    if(table.childElementCount === 1)
        table.replaceChild(new_tbody, table.childNodes[0]);
    else
        table.appendChild(new_tbody)
}

// initial load of Scotland layer
function loadFeatures()
{
    readTextFile("scotland.geojson",geojson_callback);
}

// on selection of a user file
function onSelectedFile(evt)
{
    var files = evt.target.files;
    var file = files[0];
    var reader = new FileReader();
    reader.onload = function(event) {
        geojson_callback(event.target.result);
    }
    reader.readAsText(file)
}

// on selection of a file from the predefined list
function onSelectFileFromList()
{
    var list = document.getElementById("selectfile");
    if(list.value != "")
    {
        readTextFile(list.value, geojson_callback);
        list.value = "";
    }
}

var currentTransform = null, currentInverse = null, currentScaleFactor = null;
