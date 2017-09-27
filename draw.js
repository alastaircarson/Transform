// drawing methods for CanvasRenderingContext2D

CanvasRenderingContext2D.prototype.drawGeoJSONPolygon = function (coordinates, fillColor, strokeColor, strokeWidth) {
    if (coordinates.length <= 0) return;
    // parts
    for (var i = 0; i < coordinates.length; i++) {
        var part = coordinates[i];
        if (part.length <= 2) return;
        this.beginPath();
        this.moveTo(part[0][0], part[0][1]);
        for (var j = 1; j < part.length; j++) {
            this.lineTo(part[j][0], part[j][1]);
        }

        if (strokeColor != null && strokeColor != undefined && strokeWidth != null && strokeWidth != undefined)
        {
            this.strokeStyle = strokeColor;
            this.lineWidth = strokeWidth;
            this.stroke();
        }

        if (fillColor != null && fillColor != undefined) {
            this.fillStyle = fillColor;
            this.fill();
        }
    }
};

CanvasRenderingContext2D.prototype.drawGeoJSONMultiPolygon = function (coordinates, fillColor, strokeColor, strokeWidth) {
    if (coordinates.length <= 0) return;
    // multi-parts
    for (var i = 0; i < coordinates.length; i++) {
        this.drawGeoJSONPolygon(coordinates[i],fillColor, strokeColor, strokeWidth);
    }
};

CanvasRenderingContext2D.prototype.drawGeoJSONLine = function (coordinates, strokeColor, strokeWidth) {
    if (coordinates.length <= 0) return;
    this.beginPath();
    this.moveTo(coordinates[0][0], coordinates[0][1]);
    for (var i = 1; i < coordinates.length; i++) {
        this.lineTo(coordinates[i][0], coordinates[i][1]);
    }

    if (strokeColor != null && strokeColor != undefined && strokeWidth != null && strokeWidth != undefined)
    {
        this.strokeStyle = strokeColor;
        this.lineWidth = strokeWidth;
        this.stroke();
    }
};

CanvasRenderingContext2D.prototype.drawGeoJSONMultiLine = function (coordinates, strokeColor, strokeWidth) {
    if (coordinates.length <= 0) return;
    // multi-parts
    for (var i = 0; i < coordinates.length; i++) {
        this.drawGeoJSONLine(coordinates[i], strokeColor, strokeWidth);
    }
};

CanvasRenderingContext2D.prototype.drawGeoJSONPoint = function (coordinates, fillColor, size) {
    this.fillStyle = fillColor;
    this.fillRect(coordinates[0]-size, coordinates[1]-size, 4*size, 4*size);
};
