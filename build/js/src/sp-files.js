// SharePoint List Functionlity

SPOC.SP.Site.prototype.Files = function(filePath) {

    // save reference to this
    var site = this;

    // Create object to store public methods
    var methods = {};

    /**
     * Generates a time based External Sharing link
     * @params  Object query filter paramators in obj format
     * @return  promise
     */
    methods.generateExternalLink = function(hours) {
        hours = hours ? hours : 24;
        var listUrl = site.url + "/_api/Web/GetFileByServerRelativeUrl('" + filePath + "')/GetPreAuthorizedAccessUrl(" + hours + ")";
        return SPOC.Utils.Request.get(listUrl, true);
    };

    /**
     * Upload document in a document library
     * @params  Upload document: GUID document library, callBack function, setting object for the modal dialog
     * setting: {'width': number, 'height': number, 'title': string}
     * List of options can be found at https://msdn.microsoft.com/en-us/library/office/dn292552.aspx
     * @return Promise
     */
    methods.uploadViaModal = function(GUID) {
        return new Promise(function(resolve, reject) {
            var dialogOptions = {};
            dialogOptions.url = site.url + "/_layouts/Upload.aspx?List=" + GUID + "&IsDlg=1";
            dialogOptions.dialogReturnValueCallback = Function.createDelegate(null, function(result, value) {
                resolve(value);
            });

            SP.UI.ModalDialog.showModalDialog(dialogOptions);

        });
    };

    /**
     * Upload file to a document library
     * @params  file input
     * @return Promise
     */
    methods.upload = function(fileInput, expand) {
        return new Promise(function(resolve, reject) {
            var reader = new FileReader();

            reader.onloadend = function(e) {
                var parts = fileInput.value.split('\\');
                var fileName = parts[parts.length - 1];
                var url = site.url + "/_api/Web/GetFolderByServerRelativeUrl('" + filePath + "')/files/add(overwrite=true, url='" + fileName + "')" + 
                            (expand ? "?$" + expand : "");
                SPOC.Utils.Request.post(url, e.target.result, true).then(function(result) {
                    resolve(result);
                }, function(result) {
                    reject(result);
                });
            };
            reader.onerror = function(e) {
                reject(e.target.error);
            };

            reader.readAsArrayBuffer(fileInput.files[0]);
        });
    };

    /**
     * Upload file to a document library
     * @params  file input
     * @return Promise
     */
    methods.uploadFile = function(file, expand) {
        return new Promise(function(resolve, reject) {
            var reader = new FileReader();

            reader.onloadend = function(e) {                
                var fileName = file ? file.name : "";
                var url = site.url + "/_api/Web/GetFolderByServerRelativeUrl('" + filePath + "')/files/add(overwrite=true, url='" + fileName + "')" + 
                            (expand ? "?$" + expand : "");
                SPOC.Utils.Request.post(url, e.target.result, true).then(function(result) {
                    resolve(result);
                }, function(result) {
                    reject(result);
                });
            };
            reader.onerror = function(e) {
                reject(e.target.error);
            };

            reader.readAsArrayBuffer(file);
        });
    };

    /**
     * Get file list item properties
     * @params bool cache
     * @return Promise
     */
    methods.query = function(cache) {
        var url = site.url + "/_api/web/getfilebyserverrelativeurl('" + filePath + "')/ListItemAllFields";
        return SPOC.Utils.Request.get(url, cache);
    };

    /**
     * Forces download of a document
     * @return Promise
     */
    methods.download = function() {
        window.open('/_layouts/download.aspx?SourceUrl=' + site.url + filePath);
    };

    /**
     * Opens compatiable files in webapps,
     * @params bool forceNoCache
     * @return Promise
     */
    methods.openInWebApps = function(newTab) {
        var url = site.url + filePath;

        if (newTab) {
            window.open(SPOC.Utils.SP.convertToWebApp(url));
        } else {
            window.location.href = SPOC.Utils.SP.convertToWebApp(url);
        }

    };

    return methods;

};
