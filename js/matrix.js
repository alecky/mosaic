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
            console.log("the number of rows are: " + this.rows + " columns are: " + this.cols);
        },
        
        /**
         * Returns a canvas context that contains the current image and dimensions.
         **/
        getCanvasCtxFromImg: function (img) {
            var canvas = document.createElement('canvas'),
                context = canvas.getContext && canvas.getContext('2d');
            
            canvas.height = this.height;
            canvas.width = this.width;

            context.drawImage(img, 0, 0);
            
            return context;
        },
        
        /**
         * for every tile (row and column) of the current image a correesponding average colour is calculated.
         * a promise is returned that contains this information
         **/
        getAvgColourMatrix: function (context) {
            var result = [],
                row,
                col;

            for (row = 0; row < this.rows; row += 1) {
                result.push(this.getAvgRowMatrix(row, context));
            }
            
            return Promise.all(result);
        },
        
        /**
         * for the row specified it creates an array of avg colours for that row as a promise
         **/
        getAvgRowMatrix: function (row, context) {
            var rowPromise = [],
                col;
            
            for (col = 0; col < this.cols; col += 1) {
                rowPromise.push(this.getAvgTilePromise(row, col, context));
            }
            
            return Promise.all(rowPromise);
        },
                                
        getAvgTilePromise: function (row, col, context) {
            return new Promise(function (resolve, reject) {
                try {
                    resolve(this.getAverageColourForTile(
                        context.getImageData(col * TILE_WIDTH, row * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT)
                    ));
                } catch (e) {
                    reject(e.message);
                }
            }.bind(this));
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
         * Returns a promise that contains a multi dimensional array that contains the avg colours for each tile of a passed image.
         **/
        generateMatrix: function (image) {
            var context;
            this.calculateDimensions(image);
            
            context = this.getCanvasCtxFromImg(image);
            
            return this.getAvgColourMatrix(context);
        },
        
        /**
         * Method that converts rgb to hex, this was a copy paste from:
         * https://www.sitepoint.com/jquery-convert-rgb-hex-color/
         **/
        _rgbToHex: function (r, g, b) {
            if (r > 255 || g > 255 || b > 255) {
                throw "Invalid color component";
            }
            return ("0" + parseInt(r,10).toString(16)).slice(-2) +
                    ("0" + parseInt(g,10).toString(16)).slice(-2) +
                    ("0" + parseInt(b,10).toString(16)).slice(-2);
        }
    };
    
    //@TODO need to work out a better way to export this object
    window.mosaic = window.mosaic || {};
    window.mosaic.Matrix = Matrix;
}());