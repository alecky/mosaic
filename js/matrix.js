/**
 * This file creates an object that is used to generate average colours for a defined tile size
 * based on an image passed.
 */
(function () {
    "use strict";
    function Matrix() {
        this.width = 0;
        this.height = 0;
        this.rows = 0;
        this.cols = 0;
        this.img = null;
    }
    
    Matrix.prototype = {
        /**
         * calculates the number of mosaic rows and cols as well as width and height of an image passed, 
         * if the image is not a multiple of TILE_WIDTH or TILE_HEIGHT the image is trimed off.
         */
        calculateDimensions: function (image) {
            var width = image.naturalWidth || image.offsetWidth || image.width,
                height = image.naturalHeight || image.offsetHeight || image.height;
            
            this.cols = Math.floor(width / TILE_WIDTH);
            this.rows = Math.floor(height / TILE_HEIGHT);
            this.width = this.cols * TILE_WIDTH;
            this.height = this.rows * TILE_HEIGHT;
            this.img = image;
            console.log("the number of rows are: " + this.rows + " columns are: " + this.cols);
        },
        
        /**
         * Returns a canvas context that contains the current image and dimensions.
         **/
        getCanvasCtxFromImg: function () {
            var canvas = document.createElement('canvas'),
                context = canvas.getContext && canvas.getContext('2d');
            
            canvas.height = this.height;
            canvas.width = this.width;

            context.drawImage(this.img, 0, 0);
            
            return context;
        },
        
        /**
         * for every tile (row and column) of the current image a correesponding average colour is calculated.
         * that data as an array is then returned 
         **/
        getAvgColourMatrix: function (context) {
            var result = [],
                row,
                col;

            for (row = 0; row < this.rows; row += 1) {
                for (col = 0; col < this.cols; col += 1) {
                    if (col === 0) {
                        result[row] = [];
                    }
                    result[row][col] = this.getAverageColourForTile(
                        context.getImageData(col * TILE_WIDTH, row * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT)
                    );
                }
            }
            
            return result;
        },
        
        /**
         * When passed an array conraining pixel data for an image this method calculates the average rgb values 
         * then converts them to hex.
         **/
        getAverageColourForTile: function (imgData) {
            var data = imgData.data,
                length = data.length,
                count,
                i,
                r = 0,
                g = 0,
                b = 0;

            for (i = 0, count = 0; i < data.length; i += 4, count += 1) {
                r += data[i];
                g += data[i + 1];
                b += data[i + 2];
            }

            r = Math.floor(r / count);
            g = Math.floor(g / count);
            b = Math.floor(b / count);

            return this._rgbToHex(r, g, b);
        },
        
        /**
         * Returns a multi dimensional array that contains the avg colours for each tile of a passed image.
         **/
        generateMatrix: function (image) {
            var context;
            this.calculateDimensions(image);
            
            context = this.getCanvasCtxFromImg();
            
            return this.getAvgColourMatrix(context);
        },
        
        /**
         * Method that converts rgb to hex, this was a copy paste from stackoverflow.
         **/
        _rgbToHex: function (r, g, b) {
            if (r > 255 || g > 255 || b > 255) {
                throw "Invalid color component";
            }
            return ((r << 16) | (g << 8) | b).toString(16);
        }
    };
    
    //@TODO need to work out a better way to export this object
    window.mosaic = window.mosaic || {};
    window.mosaic.Matrix = Matrix;
}());