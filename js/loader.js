/**
 * Loads the tile svg's from the the server for the entire mosaic. 
 */
(function () {
    "use strict";
    function Loader() {
        
    }
    
    Loader.prototype = {
    };
    
    //@TODO need to work out a betterway to export this object
    window.mosaic = window.mosaic || {};
    window.mosaic.Loader = Loader;
}());