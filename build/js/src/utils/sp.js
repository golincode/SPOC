// Create objects for Utils conversion
SPOC.Utils.SP = {};

/**
 * Returns data type for list items
 * @return  bool
 */
SPOC.Utils.SP.getListItemType = function(name) {
	name = name[0].toUpperCase() + name.substring(1);
    return "SP.Data." + name.replace(/ /g, '_x0020_') + "ListItem";
};

/**
 * Upload document in a document library
 * @params  Upload document: GUID document library, callBack function, setting object for the modal dialog
 * setting: {'width': number, 'height': number, 'title': string}
 * List of options can be found at https://msdn.microsoft.com/en-us/library/office/dn292552.aspx
 * @return  jQuery Deferred Object
 */
SPOC.Utils.SP.uploadDocument = function(GUID, settings) {
    var defer = $.Deferred();
    var dialogOptions = {};

    if (settings) {
        $.extend(dialogOptions, settings);
    }

    dialogOptions.url = site.url + "/_layouts/Upload.aspx?List=" + GUID + "&IsDlg=1";
    dialogOptions.dialogReturnValueCallback = Function.createDelegate(null, function(result, value) {
        defer.resolve(value);
    });

    SP.UI.ModalDialog.showModalDialog(dialogOptions);
    return defer.promise();
};

