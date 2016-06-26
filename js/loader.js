/**
 * Loads the tile svg's from the the server for the entire mosaic. 
 */
(function () {
    "use strict";
    function Loader() {
        this.tileStore = {};
        this.onRowComplete = null;
        this.tilesLoaded = 0;
        this.totalTilesToLoad = 0;
        this.currentRow = 0;
        this.currentMatrix = null;
    }
    
    Loader.prototype = {
        /**
         * based on the matrix with return the list of unique colours that need to be loaded.
         * the colours are ordered by first occurance
         **/
        findUnique: function (matrix) {
            var colours = [],
                row,
                col;
            
            for (row = 0; row < matrix.length; row += 1) {
                for (col = 0; col < matrix[row].length; col += 1) {
                    if (colours.indexOf(matrix[row][col]) === -1) {
                        colours.push(matrix[row][col]);
                    }
                }
            }
            
            return colours;
        },
        
        /**
         * here all tiles are loaded in the array of colours passed.
         * 
         **/
        loadTiles: function (list) {
            var i;
            
            this.totalTilesToLoad = list.length;
            
            for (i = 0; i < this.totalTilesToLoad; i += 1) {
                this._ajax(list[i]);
            }
        },
        
        /**
         * ajax call to retrive the tiles. on success a counter in incrememted and the colour is stored in an colour store.
         * finally the whenload method is called.
         * @TODO need to ad some error validation in case the call fails.
         **/
        _ajax: function (colour) {
            var r = new XMLHttpRequest(),
                self = this;
            
            r.open("GET", "/color/" + colour, true);
            r.onreadystatechange = function () {
                if (r.readyState !== 4 || r.status !== 200) {
                    return; // need a proper error check or mosaic will never load.
                }
                self.tilesLoaded += 1;
                self.tileStore[colour] = r.responseText;
                self.whenLoad();
            };
            r.send("");
        },
        
        /**
         * Check if the current row has loaded all tiles that it needs. if so the row has its onRowComplete fow method called
         * with a string containing all the svg's concatenated in order
         **/
        whenLoad: function () {
            var i,
                currentList = this.currentMatrix[this.currentRow],
                length = currentList.length,
                result = "";
            
            for (i = 0; i < length; i += 1) {
                if (this.tileStore[currentList[i]]) {
                    result += this.tileStore[currentList[i]];
                } else {
                    return false;
                }
            }
            
            console.log("completed a new row, the current row count is: " + this.currentRow);
            this.currentRow += 1;
            this.onRowComplete(result);
            this.loadRemainingRows();
        },
        
        /**
         * Method determines if all tiles have been loaded but not all rows then ensures all rows are drawn
         **/
        loadRemainingRows: function () {
            if (this.currentRow < this.currentMatrix.length && this.tilesLoaded === this.totalTilesToLoad) {
                this.whenLoad();
            }
        },
        
        /**
         * Method loads all the tiles for a matrix passed and calls onRowComplete when each row has all its tiles loaded
         **/
        loadMosaic: function (matrix, onRowComplete) {
            var colourList = this.findUnique(matrix);
            
            this.currentRow = 0;
            this.currentMatrix = matrix;
            this.onRowComplete = onRowComplete;
            
            this.loadTiles(colourList);
        }
    };
    
    //@TODO need to work out a better way to export this object
    window.mosaic = window.mosaic || {};
    window.mosaic.Loader = Loader;
}());