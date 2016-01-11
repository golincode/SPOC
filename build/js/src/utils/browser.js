// Create objects for Utils conversion
SPOC.Utils.Browser = {};


/**
 * Check if user is using windows
 * phone
 * @return indexOf whether windows
 * phone or not
 */
SPOC.Utils.Browser.isWindowsPhone = function(obj) {
    var str = '';
    for (var propertyName in obj) {
        str += '&$' + propertyName + '=' + obj[propertyName];
    }
    return str;
};


/**
 * Check and return what version IE
 * is being used if any
 */
SPOC.Utils.Browser.ieVersion = function(obj) {
	var myNav = navigator.userAgent.toLowerCase();
    return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1], 10) : false;
};