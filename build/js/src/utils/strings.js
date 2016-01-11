// Create objects for Utils conversion
SPOC.Utils.Strings = {};

/**
 * Cuts a string to a required length and adds ...
 * @return  bool
 */
SPOC.Utils.String.cut = function(value, requiredLength) {
    return value.length > requiredLength ? title.substr(0, requiredLength - 3) + "..." : value.length;
};
