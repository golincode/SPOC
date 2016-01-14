

SPOC.Mock = {
    active: false,
    db: {}
};


// If not in SP, set page context as an empty object
if(_spPageContextInfo){
    _spPageContextInfo = {};
}

/**
 * Creates a Mock SharePoint List
 * @params  listName  name of list to create
 * @params  obj Object of columns and values
 * @return void
 */
SPOC.Mock.createList = function(listName, data) {
    SPOC.Mock.db[listName.toLowerCase()] = data;
};