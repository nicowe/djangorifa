var radiuses = new Object;

function control_points_init(map) {
    var lyr = map.layers[2];
    var currentLonLat;
    
    lyr.events.register('featureadded', lyr, onFeatureAdded);
    lyr.events.register('featureselected', lyr, onFeatureSelected);
    lyr.events.register('featuremodified', lyr, onFeatureModified);
    
    // Sets the radius from a lonLat object, or deletes if there is none
    function setRadiuses(lonLat, radius) {
        key = getRadiusesKey(lonLat);
        if (radius == undefined) delete radiuses[key];
        else radiuses[key] = radius;
    }
    
    // Gets a radius from a lonLat object
    function getRadiuses(lonLat) {
        r = radiuses[getRadiusesKey(lonLat)];
        if (r == undefined) return "";
        return r;
    }
    
    function getRadiusesKey(lonLat) {
        trans = lonLat;
        return trans.transform(map.projection, map.displayProjection).toShortString();
    }
    
    function onFeatureAdded(event) {
        console.log(django.jQuery('#id_radius'));
        saveOldRadius();
        lonLat = getLonLat(event);
        popup = getPopup(lonLat, "", false);
        map.addPopup(popup, true);
    }
    
    function onFeatureSelected(event) {
        saveOldRadius();
        lonLat = getLonLat(event);
        popup = getPopup(lonLat, getRadiuses(lonLat));
        map.addPopup(popup, true);
    }
    
    // This is triggered when a feature is deleted or moved
    function onFeatureModified(event) {
        oldLonLat = currentLonLat;
        // If deleted, remove all popups
        if(event.feature == undefined) map.deleteAllPopups();
        else {
            // If it's been modified, update the information and create a new popup
            lonLat = getLonLat(event);
            radius = getRadiuses(oldLonLat);
            setRadiuses(lonLat, radius);
            popup = getPopup(lonLat, radius, false);
            map.addPopup(popup, true);
        }
        // Delete the old entry from radiuses
        setRadiuses(oldLonLat);
    }
    
    function getPopup(lonLat, radius, isError) {
        currentLonLat = lonLat;
        
        // Create the HTML of the textbox
        var divbox = document.createElement('div');
        var textbox = document.createElement('input');
        textbox.setAttribute('id', 'control_points_radius');
        if(!isError) textbox.setAttribute('value', radius);
        divbox.innerHTML = 'Radius influence (m):'
        divbox.appendChild(textbox);
        
        // If we want to display an error message,
        if(isError) message = divbox.innerHTML + "<br />Radius must be an integer.";
        else message = divbox.innerHTML;
        
        // Return the popup
        return new OpenLayers.Popup.FramedCloud("popup",
            lonLat,
            new OpenLayers.Size(100, 100),
            message,
            null, true, onPopupClose);
    }
    
    function onPopupClose(event) {
        if(!saveOldRadius()) {
            popup = getPopup(currentLonLat, getRadiusFromTextBox(), true);
            map.addPopup(popup, true);
        }
        else map.deleteAllPopups();
    }
    
    function getLonLat(event) {
        console.log(event.feature.geometry);
        return event.feature.geometry.getBounds().getCenterLonLat();
    }
    
    function getRadiusFromTextBox() {
        radius = document.getElementById('control_points_radius');
        if(radius != undefined) {
            return radius.value;
        }
        return undefined;
    }
    
    function isInteger(value) {
        var intRegex = /^\d+$/;
        return intRegex.test(value);
    }
    
    function isValidRadius(radius) {
        return ((radius != 0 && isInteger(radius)) || radius == "");
    }
    
    // Returns true if it saved the old radius successfully
    function saveOldRadius() {
        // If there is a value in the old popup which is valid, save before displaying next popup
        var radius = getRadiusFromTextBox();
        if(isValidRadius(radius)) {
            setRadiuses(currentLonLat, radius);
            return true;
        }
        return false;
    }
}

// JQuery event handlers
(function($) {
    $(function() {
        // Register form event handlers
        $('#taarifaconfig_form').submit(function(e) {
            //e.preventDefault();
            // Need to update the value in the radius form with serialised version of the lonlats
            $('#id_radiuses').val(JSON.stringify(radiuses));
        });
        
        // Load the values in the textbox to radiuses
        radi = $.parseJSON($('#id_radiuses').val());
        if(radi != null) radiuses = radi;
    });
})(django.jQuery);


