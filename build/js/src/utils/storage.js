
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
 * @params  useLocalStorage bool to us local storage rather than session
 * @return  void
 */
SPOC.Utils.Storage.set = function(key, data, useLocalStorage) {
    if (SPOC.Utils.Storage.storageAvailable()) {
        var storageObj = useLocalStorage ? localStorage : sessionStorage;
        storageObj.setItem(key, (data === Object(data)) ? JSON.stringify(data) : data);
    }
};

/**
 * Checks if session and local storage is available
 * @params  key String of key to retrieve
 * @params  useLocalStorage bool to set local storage rather than session
 * @return  string | object | null
 */
SPOC.Utils.Storage.get = function(key, useLocalStorage) {
    if (SPOC.Utils.Storage.storageAvailable()) {
        var storageObj = useLocalStorage ? localStorage : sessionStorage;
        return JSON.parse(storageObj.getItem(key));
    } else {
        return null;
    }
};


/**
 * Checks if session and local storage is available
 * @params  key String of key to remove
 * @params  useLocalStorage bool to set local storage rather than session
 * @return  void
 */
SPOC.Utils.Storage.remove = function(key, useLocalStorage) {
    if (SPOC.Utils.Storage.storageAvailable()) {
        var storageObj = useLocalStorage ? localStorage : sessionStorage;
        localStorage.removeItem(key);
    }
};


/**
 * Get a cookie value by name
 * @params  key String of key to remove
 * @return  void
 */
SPOC.Utils.Storage.getCookie = function(name) {
    name = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
    }
    return false;
};

/**
 * Set a cookie value by name, value and number of days before expired date
 * @params  name String name of the cookie value
 * @params  value Obj value to storage in the cookie
 * @params  days Number number of days before expired
 * @return  void
 */
SPOC.Utils.Storage.setCookies = function(name, value, days) {
    var expires;
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    } else {
        expires = "";
    }
    document.cookie = name + "=" + value + "; " + expires;
};


/**
 * Delete a cookie value by name
 * @params  key String of key to remove
 * @return  void
 */
SPOC.Utils.Storage.removeCookies = function(name) {
    SPOC.Utils.Storage.setCookies(name, "", -1);
};
