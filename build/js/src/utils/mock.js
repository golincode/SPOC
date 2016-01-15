

SPOC.Mock = {
    active: false,
    db: {}
};


document.addEventListener("DOMContentLoaded", function(event) { 
    
    if(_spPageContextInfo){
        _spPageContextInfo = {};
    }

    if (!SP){
        SPOC.Mock.active = true;
    } 
});


/**
 * Creates a Mock SharePoint List
 * @params  listName  name of list to create
 * @params  obj Object of columns and values
 * @return void
 */
SPOC.Mock.createList = function(listName, data) {
    SPOC.Mock.db[listName.toLowerCase()] = data;
};