// Create objects for Utils conversion
SPOC.Utils.Arrays = {};

/**
 * Converts a Javascript object to SP API query string format
 * @params  obj Object of props to convert
 * @return  string
 */
SPOC.Utils.Arrays.findByProperty = function(data, prop, value) {
    var i;
    for (i = 0; i < data.length; i++) {
        if (data[i][prop] === value) {
            return data[i];
        }
    }
    return false;
};


/**
 * Converts an Array in a string by a template
 * @params  template html and obj Object of props to convert
 * @return  string
 */
SPOC.Utils.Arrays.renderViewFromArray = function(itemview, data) {
    var htmlout = '',
        keyProp, cloneView, newValue;

    var isArray = !!data && data.constructor == Array;

    if (!isArray) {
        data = [data];
    }

    $.each(data, function(i, value) {
        cloneView = itemview;
        $.each(value, function(key) {
            keyProp = key.replace(/_x0020_/g, ' ');
            while (cloneView.indexOf('{' + keyProp + '}') > 0) {
                cloneView = cloneView.replace('{' + keyProp + '}', value[key]);
            }
        });
        htmlout += cloneView;
    });
    return htmlout;
};


/**
 * Pagination of an array
 * @params  startPosition Number start index of the array, 
 * @params  array Obj data, 
 * @params  number Number elements for page, 
 * @params  template String template html
 * @params  div String render div class
 * @return  void
 */
SPOC.Utils.Arrays.viewMore = function(startPosition, array, number, template, div) {
    //method for view other documents
    var arrayCut = [],
        html = "",
        finalPos = startPosition + number;

    //if the array is smaller that my supposed finalPos I will use the length of the array so we don't get null items
    if (array.length < finalPos) {
        finalPos = array.length;
    }

    //save of my finalPos
    $('#finalPos').html(finalPos);

    var arrayFiltered = array;

    //cut the array by start and final pos
    for (var i = startPosition, len = finalPos; i !== len; i++) {
        arrayCut.push(arrayFiltered[i]);
    }

    //view my array by the template
    html = SPOC.Utils.Arrays.renderViewFromArray(template, arrayCut);
    $("." + div).append(html);

    //show or hide the view more button if i finish my paging
    if (array.length <= finalPos) {
        $(".view-more-container").hide();
    } else {
        $(".view-more-container").show();
    }
};