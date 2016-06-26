/**
 * Client for mosaic that sets up the image loader and the colour matrix as well as the tile loader
 */
(function (Matrix, Loader) {
    "use strict";
    
    function Client() {
        this.input;
        this.output;
        this.matrix = new Matrix();
        this.loader = new Loader();
    }
    
    Client.prototype = {
        /**
         * This method pre-loads the image that is selected in the file input. calls the supplied callback when done
         * 
         * @TODO need to add validation in case an image is not selected.
         **/
        loadImage: function (whenLoad) {
            var image = document.createElement("img"),
                imgReader = new FileReader();
            
            imgReader.onload = function (e) {
                image.setAttribute('src', e.target.result);
                whenLoad(image);
            };
            imgReader.readAsDataURL(this.input.files[0]);
        },
        
        /**
         * This method draws a row into the results div on the page. the method accepts a string of svg's
         * 
         **/
        rowDraw: function (row) {
            var doc = new DOMParser().parseFromString("<div>" + row + "</div>", "application/xml");
            
            var node = document.importNode(doc.documentElement, true);
            this.output.appendChild(node);
        },
        
        /**
         * This method sets the correct higth for each row div. default styles tend to add some minor 
         * spacing between each row.
         **/
        setRowStyles: function () {
            var css = "#mosaic div { display: block; height: " + window.TILE_HEIGHT + "px; }",
                head = document.head || document.getElementsByTagName('head')[0],
                style = document.createElement('style');

            style.type = 'text/css';
            if (style.styleSheet){
              style.styleSheet.cssText = css;
            } else {
              style.appendChild(document.createTextNode(css));
            }

            head.appendChild(style);
        },
        
        /**
         * The inti method for the client. this method assigns the input and output placeholders and 
         * adds the change event listner to the file input to load the image and draw the mosaic
         **/
        init: function (input, output) {
            this.input = input;
            this.output = output;
            
            this.setRowStyles();
            
            this.input.addEventListener("change", function () {
                this.loadImage(function (image) {
                    var imgMatrix = this.matrix.generateMatrix(image);
                    this.loader.loadMosaic(imgMatrix, this.rowDraw.bind(this));
                }.bind(this));
            }.bind(this));
        }
    };

    // on document ready find the file load input and the mosaic place holder.
    // initialises the client also.
    document.addEventListener("DOMContentLoaded", function (event) {
        var client = new Client();
        
        client.init(document.getElementById("selector"), document.getElementById("mosaic"));
    });
    
}(window.mosaic.Matrix, window.mosaic.Loader));
