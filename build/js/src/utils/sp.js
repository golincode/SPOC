// Create objects for Utils conversion
SPOC.Utils.SP = {};

/**
 * Returns data type for list items
 * @return  bool
 */
SPOC.Utils.SP.getListItemType = function(name) {
  return "SP.Data." + name[0].toUpperCase() + name.substring(1) + "ListItem";
};

