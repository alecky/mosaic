// Edit me.
(function () {
    "use strict";
    var input,
        loadImage = function (whenLoad) {
            var image = document.createElement("img"),
                imgReader = new FileReader();
            imgReader.onload = function (e) {
                image.setAttribute('src', e.target.result);
                // test append to body  REMOVE
                //document.getElementsByTagName("body")[0].appendChild(image);
                whenLoad(image);
            };
            imgReader.readAsDataURL(input.files[0]);
        },
        matrix;
    
    window.mosaic = window.mosaic || {};
    
    matrix = new window.mosaic.Matrix();
    
    document.addEventListener("DOMContentLoaded", function (event) {
        input = document.getElementById("selector");
        input.addEventListener("change", function () {
            loadImage(function (image) {
                matrix.generateMatrix(image);
            });
        });
    });
        

    
    function rgbToHex(r, g, b) {
//        if (r > 255 || g > 255 || b > 255) {
//            throw "Invalid color component";
//        }
//        return ((r << 16) | (g << 8) | b).toString(16);
    }
}());