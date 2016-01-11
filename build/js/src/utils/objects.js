
SPOC.Utils.Objects = {};

/**
 * Find a object in object array by property value
 * @params  data object array to search
 * @params  prop property to search 
 * @params  value value to search
 * @return  index or false
 */
SPOC.Utils.Objects.findObjectByProperty = function(data, prop, value) {
    var i;
    for (i = 0; i < data.length; i++) {
        if (data[i][prop] === value) {
            return data[i];
        }
    }
    return false;
};

/**
 * Merge to Javascipt objects together
 * @params  obj Object of props to convert
 * @return  string
 */
SPOC.Utils.Objects.merge = function(obj1, obj2) {
    for (var p in obj2) {
        try {
          // Property in destination object set; update its value.
          if ( obj2[p].constructor==Object ) {
            obj1[p] = MergeRecursive(obj1[p], obj2[p]);

          } else {
            obj1[p] = obj2[p];

          }

        } catch(e) {
          // Property in destination object not set; create it and set its value.
          obj1[p] = obj2[p];

        }
  }
  return obj1;
};