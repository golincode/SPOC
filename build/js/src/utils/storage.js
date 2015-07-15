// Create objects for Utils conversion
SPOC.Utils.Storage = {};

/**
 * Checks if session and local storage is available
 * @return  bool
 */
SPOC.Utils.Storage.storageAvailable = function() {
    return (typeof(Storage) !== "undefined");
};

/**
 * Add data to local or session storage
 * @params  key String to use as item key
 * @params  data Object containing data to save
 * @params  isLocal bool to us local storage rather than session
 * @return  void
 */
SPOC.Utils.Storage.set = function(key, data, isLocal) {
    if (SPOC.Utils.Storage.storageAvailable()) {
        var storageObj = isLocal ? localStorage : sessionStorage;
        storageObj.setItem(key, (data === Object(data)) ? JSON.stringify(data) : data);
    }
};

/**
 * Checks if session and local storage is available
 * @params  key String of key to retrieve
 * @params  isLocal bool to set local storage rather than session
 * @return  string | object | null
 */
SPOC.Utils.Storage.get = function(key, isLocal) {
    if (SPOC.Utils.Storage.storageAvailable()) {
        var storageObj = isLocal ? localStorage : sessionStorage;
        return JSON.parse(storageObj.getItem(key));
    } else {
        return null;
    }
};

/**
 * Checks if session and local storage is available
 * @params  key String of key to remove
 * @params  isLocal bool to set local storage rather than session
 * @return  void
 */
SPOC.Utils.Storage.remove = function(key, isLocal) {
    if (SPOC.Utils.Storage.storageAvailable()) {
        var storageObj = isLocal ? localStorage : sessionStorage;
        localStorage.removeItem(key);
    }
};
