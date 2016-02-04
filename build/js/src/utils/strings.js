
SPOC.Utils.Strings = {};

/**
 * Cuts a string to a required length and adds ...
 * @return  bool
 */
SPOC.Utils.Strings.cut = function(value, requiredLength) {
    return value.length > requiredLength ? title.substr(0, requiredLength - 3) + "..." : value.length;
};


/**
 * Returns the file extension from a string path
 * @return  STRING
 */
SPOC.Utils.Strings.getFileExtension = function(value) {
    return value.split('.').pop();
};
