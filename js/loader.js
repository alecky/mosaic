/**
 * Loads the tile svg's from the the server for the entire mosaic. 
 */
(function () {
    "use strict";
    function Loader() {
        this.tileStore = {};
        this.onRowComplete = null;
        this.currentRow = 0;
        this.rowPromises = [];
        this.matrix = null;
    }
    
    Loader.prototype = {        
        /**
         * here the first row of the mosaic is loaded
         * 
         **/
        loadRows: function (matrix) {
            var i;
                this.rowPromises = [];
                this.currentRow = 0;
            
            this.loadRow(matrix[this.currentRow]).then(this.insertRow.bind(this));
        },
        
        /**
         * here all tiles are loaded in the row array of colours passed. returns a promise for that row and draws the row out.
         * 
         **/
        loadRow: function (row) {
            var i,
                tiles = [];
            
            for (i = 0; i < row.length; i += 1) {
                tiles.push(this._ajax(row[i]));
            }
            
            return Promise.all(tiles);
        },
        
        /**
         * Concatenates the result which should be an array of tiles and passes it to the onRowComplet mehtod. 
         * creates the next promise then to draw the next row.
         **/
        insertRow: function (result) {
            this.onRowComplete(result.reduce(this._concat));
            this.currentRow += 1;
            if (this.currentRow < this.matrix.length) {
                this.loadRow(this.matrix[this.currentRow]).then(this.insertRow.bind(this));
            }  
        },
        
        /**
         * ajax call to retrive the tiles. Returns a promise for the tile of the colour passed.
         * @TODO need to prevent repeat calls for the same colour.
         **/
        _ajax: function (colour) {
            return new Promise(function (resolve, reject) {
                var r = new XMLHttpRequest();

                r.open("GET", "/color/" + colour, true);
                r.onload = function () {
                    if (this.status >= 200 && this.status < 300) {
                        resolve(this.response);
                    } else {
                        reject(this.statusText);
                    }
                };
                r.onerror = function () {
                    reject(this.statusText);
                };
                r.send();
            });
        },
                               
        _concat: function (a, b) {
            return a + b;
        },
        
        /**
         * Method loads all the tiles for a matrix passed and calls onRowComplete when each row has all its tiles loaded
         **/
        loadMosaic: function (matrix, onRowComplete) {

            this.onRowComplete = onRowComplete;
            
            this.matrix = matrix;
            
            this.loadRows(matrix);
        }
    };
    
    //@TODO need to work out a better way to export this object
    window.mosaic = window.mosaic || {};
    window.mosaic.Loader = Loader;
}());