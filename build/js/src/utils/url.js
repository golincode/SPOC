// Create objects for Utils conversion
SPOC.Utils.Url = {};

/**
 * Converts a Javascript object to SP API query string format
 * @params  obj Object of props to convert
 * @return  string
 */
SPOC.Utils.Url.getQueryString = function(variable, query) {
    // Returns query string value from URL.
    // Can pass in a URL string via query parm
    if (query) {
        query = query.split('?')[1];
    } else {
        query = window.location.search.substring(1);
    }
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return unescape(pair[1]);
        }
    }
};

SPOC.Utils.Url.get = function(givenUrl) {
    var deferred = $.Deferred();

    $.ajax({
        type: "GET",
        url: givenUrl,
        dataType: 'json',
        headers: {
            "Accept": "application/json; odata=verbose"
        },
        success: function(data) {
            deferred.resolve(data);
        },
        error: function(data) {
            deferred.reject(data);
        }
    });

    return deferred.promise();
};