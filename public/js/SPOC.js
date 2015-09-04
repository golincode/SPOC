/*! SPOC 04-09-2015 */


/**
 * Version: 0.0.1
 * Copyright (c) 2015-2015, Architect 365 (https://www.architect365.co.uk). All rights reserved.
 * License: Licensed under The MIT License. See license.txt and http://www.datejs.com/license/.
 * Website: https://www.architect365.co.uk
 */


(function(window, document, SPOC, $, undefined) {
        'use strict';

        // Define all top level namespaces.
        SPOC.Utils = {};
        SPOC.SP = {};
        SPOC.Yam = {};
// Create objects for Utils conversion
SPOC.Utils.Arrays = {};

/**
 * Converts a Javascript object to SP API query string format
 * @params  obj Object of props to convert
 * @return  string
 */
SPOC.Utils.Arrays.findByProperty = function(data, prop, value) {
    var i;
    for (i = 0; i < data.length; i++) {
        if (data[i][prop] === value) {
            return data[i];
        }
    }
    return false;
};
// Create objects for Utils conversion
SPOC.Utils.Conversion = {};

/**
 * Converts a Javascript object to SP API query string format
 * @params  obj Object of props to convert
 * @return  string
 */
SPOC.Utils.Conversion.objToQueryString = function(obj) {
    var str = '';
    for (var propertyName in obj) {
        str += '&$' + propertyName + '=' + obj[propertyName];
    }
    return str;
};

// Create objects for Utils conversion
SPOC.Utils.SP = {};

/**
 * Returns data type for list items
 * @return  bool
 */
SPOC.Utils.SP.getListItemType = function(name) {
  return "SP.Data." + name[0].toUpperCase() + name.substring(1) + "ListItem";
};


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


/**
 * Get a cookie value by name
 * @params  key String of key to remove
 * @return  void
 */
SPOC.Utils.Storage.getCookies = function(name) {
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
// Create objects for Utils conversion
SPOC.Tpl = {};

/**
 * Gets object propery value by string representation eg. Obj.prop.prop2
 * @params  propertyName string of required property
 * @params  obj Object to evaulate
 * @return  property string value of property
 */
SPOC.Tpl.getProperty = function(propertyName, obj) {
    var parts = propertyName.split("."),
        length = parts.length,
        i,
        property = obj || this;

    for (i = 0; i < length; i++) {
        property = property[parts[i]];
    }

    return property;
};

/**
 * Replaces properties in double braces with obj property values
 * @params  tpl string of HTML template
 * @params  data Object
 * @return  tpl string
 */
SPOC.Tpl.render = function(tpl, data) {
    var regex = /{{(.*?)}}/g;
    var matches = tpl.match(regex);
    if (matches && matches.length) {
        for (var i = 0, len = matches.length; i < len; i++) {
            tpl = tpl.replace(new RegExp(matches[i], 'g'), SPOC.Tpl.getProperty(matches[i].replace(/{{|}}/g, ""), data));
        }
    }

    return tpl;
};
// Create objects for Utils conversion
SPOC.Utils.Url = {};

/**
 * Converts a Javascript object to SP API query string format
 * @params  obj Object of props to convert
 * @return  string
 */
SPOC.Utils.Url.getQueryString = function(variable, query) {
    // Returns query string value from URL.
    // Can pass in a URL string via query parm
    if (query) {
        query = query.split('?')[1];
    } else {
        query = window.location.search.substring(1);
    }
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return unescape(pair[1]);
        }
    }
};
// Create objects for Utils conversion
SPOC.Utils.Yammer = {};

/**
 * Matches references with messages and returns tidier data object
 * @params  array obj Yammer feed Object
 * @return  array
 */
SPOC.Utils.Yammer.formatFeedResponse = function(data) {
    var i;

    for (i = 0; i < data.messages.length; i++) {
        if (data.messages[i].sender_type && data.messages[i].sender_type === 'user') {
            data.messages[i].user = SPOC.Utils.Arrays.findByProperty(data.references, 'id', data.messages[i].sender_id);
        }
    }
    return data.messages;
};


/**
 * Matches references with messages and returns tidier data object
 * @params  array obj Yammer feed Object
 * @return  array
 */
SPOC.Utils.Yammer.formatSearchResponse = function(data) {
    var i;

    if (data.messages && data.messages.messages) {
        for (i = 0; i < data.messages.messages.length; i++) {
            var message = data.messages.messages[i];
            if (message.sender_type && message.sender_type === 'user') {
                message.user = SPOC.Utils.Arrays.findByProperty(data.messages.references, 'id', message.sender_id);
            }
        }
    }

    return data;
};

/**
 * Checks that user is logged into Yammer. If not, Logins user and fetches access token.
 * @return  jQuery Deferred Object
 */
SPOC.Utils.Yammer.checkLogin = function() {
    var promise = $.Deferred();

    yam.getLoginStatus(function(response) {
        if (!response.authResponse) {
            yam.platform.login(function(user) {
                if (user) {
                    promise.resolve(user);
                }
            });
        } else {
            promise.resolve(response);
        }
    });

    return promise;
};
/**
 * Define Sp Site Object constructor
 * @params  url  url of Sharepoint site
 * @author  Martin Pomeroy <mpomeroy@wearearchitect.com>
 * @return  void
 */
SPOC.SP.Site = function(url) {

    // Set URL to current site if no url passed in.
    this.url = url ? url : _spPageContextInfo.webAbsoluteUrl;
};


/**
 * Define Sp User Object constructor
 * @params  url  url of Sharepoint site
 * @author  Martin Pomeroy <mpomeroy@wearearchitect.com>
 * @return  void
 */
SPOC.SP.User = function(username) {

    // Set URL to current site if no url passed in.
    this.id = username ? username : _spPageContextInfo.userId;
    this.loginName = username ? username : _spPageContextInfo.userLoginName;
    this.isAdmin = username ? false : _spPageContextInfo.isSiteAdmin;
};


/**
 * Define Yam Object constructor & ensure login
 * @params  url  url of Sharepoint site
 * @author  Martin Pomeroy <mpomeroy@wearearchitect.com>
 * @return  void
 */
SPOC.Yam.User = function(userId) {

    if (!window.yam) {
        //@todo: Update error messages to SP notifications?
        console.log('Please ensure that you have included Yammer SDK and added a valid Client Id');
    }

    this.id = userId ? userId : 'current';
};




/**
 * Define Yam Object constructor & ensure login
 * @params  url  url of Sharepoint site
 * @author  Martin Pomeroy <mpomeroy@wearearchitect.com>
 * @return  void
 */
SPOC.Yam.Messages = function(feedId, feedType) {

    if (!window.yam) {
        //@todo: Update error messages to SP notifications?
        console.log('Please ensure that you have included Yammer SDK and added a valid Client Id');
    }

    this.feedId = feedId;
    this.feedType = feedType;

};

// SharePoint List Items Functionlity



SPOC.SP.Site.prototype.ListItems = function(listTitle) {

    // save reference to this
    var site = this;

    // Create object to store public methods
    var methods = {};

    /**
     * Queries a SharePont list via REST API
     * @params  Object query filter paramators in obj format
     * @return  jQuery Deferred Object
     */
    methods.query = function(settings, forceNoCache, verbose) {
        var deferred = $.Deferred();

        var listUrl = site.url + '/_api/lists/getByTitle%28%27' + listTitle + '%27%29/items';

        // Get query from cache.
        var cache = SPOC.Utils.Storage.get('SPOCC-listitems' + listTitle);

        // Convert and append query params
        listUrl += settings ? '?' + SPOC.Utils.Conversion.objToQueryString(settings) : '';

        // Return cached version if available
        if (cache && !forceNoCache) {
            return deferred.promise().resolve(cache);
        } else {

            // else get data and return promise.
            $.ajax({
                type: "GET",
                url: listUrl,
                dataType: 'json',
                headers: {
                    "Accept": "application/json;odata=verbose"
                },
                success: function(data) {
                    // On complete, cache results
                    SPOC.Utils.Storage.set('SPOCC-listitems' + listTitle, data);
                    deferred.resolve(data);
                },
                error: function(data) {
                    deferred.reject(data);
                }
            });

            return deferred.promise();
        }


    };

    /**
     * Creates a new list items
     * @params  Object Create list settings
     * List of options can be found at https://msdn.microsoft.com/en-us/library/office/dn292552.aspx
     * @return  jQuery Deferred Object
     */
    methods.create = function(items) {
        var deferred = $.Deferred();
        var listUrl = site.url + '/_api/lists/getByTitle%28%27' + listTitle + '%27%29/items';
        var data = {
            __metadata: {
                'type': SPOC.Utils.SP.getListItemType(listTitle)
            }
        };

        if (settings) {
            $.extend(data, items);
        }

        $.ajax({
            type: "POST",
            url: listUrl,
            data: JSON.stringify(data),
            headers: {
                "Accept": "application/json;odata=verbose",
                "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                'Content-Type': "application/json;odata=verbose"
            },
            success: function(data) {
                deferred.resolve(data);
            },
            error: function(data) {
                deferred.reject(data);
            }
        });

        return deferred.promise();
    };


    /**
     * Creates a new list items
     * @params  Object Create list settings
     * List of options can be found at https://msdn.microsoft.com/en-us/library/office/dn292552.aspx
     * @return  jQuery Deferred Object
     */
    methods.update = function(id, data) {
        var deferred = $.Deferred();
        var listUrl = site.url + '/_api/lists/getByTitle%28%27' + listTitle + '%27%29/items';
        var defaults = {
            __metadata: {
                'type': SPOC.Utils.SP.getListItemType(listTitle)
            },
            BaseTemplate: 100,
            Description: '',
        };

        if (settings) {
            $.extend(defaults, settings);
        }

        $.ajax({
            type: "POST",
            url: listUrl,
            data: JSON.stringify(defaults),
            headers: {
                "Accept": "application/json;odata=verbose",
                "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                'Content-Type': "application/json;odata=verbose"
            },
            success: function(data) {
                deferred.resolve(data);
            },
            error: function(data) {
                deferred.reject(data);
            }
        });

        return deferred.promise();
    };


    /**
     * Upload document in a document library
     * @params  Upload document: GUID document library, callBack function, setting object for the modal dialog
     * setting: {'width': number, 'height': number, 'title': string}
     * List of options can be found at https://msdn.microsoft.com/en-us/library/office/dn292552.aspx
     * @return  jQuery Deferred Object
     */
    methods.uploadDocument = function(GUID, settings) {
        var defer = $.Deferred();
        var dialogOptions = {};

        if (settings) {
            $.extend(dialogOptions, settings);
        }

        dialogOptions.url = site.url + "/_layouts/Upload.aspx?List=" + GUID + "&IsDlg=1";
        dialogOptions.dialogReturnValueCallback = Function.createDelegate(null, function(result) {
            defer.resolve(result);
        });

        SP.UI.ModalDialog.showModalDialog(dialogOptions);
        return defer.promise();
    };


    return methods;
};
// SharePoint List Functionlity

SPOC.SP.Site.prototype.Lists = function(listTitle) {

    // save reference to this
    var site = this;

    // Create object to store public methods
    var methods = {};

    /**
     * Queries a SharePont list via REST API
     * @params  Object query filter paramators in obj format
     * @return  jQuery Deferred Object
     */
    methods.query = function(settings, forceNoCache) {
        var deferred = $.Deferred();
        var listUrl = site.url + '/_api/lists/getByTitle%28%27' + listTitle + '%27%29/';
        var cache = SPOC.Utils.Storage.get('SPOCC-list' + listTitle);

        listUrl += settings ? '?' + SPOC.Utils.Conversion.convertObjToQueryString(settings) : '';

        // Return cached version if available
        if (cache && !forceNoCache) {
            return deferred.promise().resolve(cache);
        } else {

            // else get data and return promise.
            $.ajax({
                type: "GET",
                url: listUrl,
                dataType: 'json',
                success: function(data) {
                    // On complete, cache results
                    SPOC.Utils.Storage.set('SPOCC-list' + listTitle, data);
                    deferred.resolve(data);
                },
                error: function(data) {
                    deferred.reject(data);
                }
            });

            return deferred.promise();
        }

    };

    /**
     * Creates a new SharePoint List
     * @params  Object Create list settings
     * List of options can be found at https://msdn.microsoft.com/en-us/library/office/dn292552.aspx
     * @return  jQuery Deferred Object
     */
    methods.create = function(settings) {
        var deferred = $.Deferred();
        var defaults = {
            __metadata: {
                'type': 'SP.List'
            },
            BaseTemplate: 100,
            Description: '',
        };

        if (settings) {
            $.extend(defaults, settings);
        }

        $.ajax({
            type: "POST",
            url: site.url + '/_api/web/lists',
            data: JSON.stringify(defaults),
            headers: {
                "Accept": "application/json;odata=verbose",
                "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                'Content-Type': "application/json;odata=verbose"
            },
            success: function(data) {
                deferred.resolve(data);
            },
            error: function(data) {
                deferred.reject(data);
            }
        });

        return deferred.promise();
    };

    return methods;
};
// SharePoint List Functionlity

SPOC.SP.User.prototype.Profile = function() {

    // save reference to this
    var user = this;

    // Create object to store public methods
    var methods = {};

    var loginNamePrefix = 'i:0%23.f|membership|';

    /**
     * Queries a SharePont User via REST API
     * @params  Object query filter paramators in obj format
     * @return  jQuery Deferred Object
     */
    methods.query = function(forceNoCache) {
        var deferred = $.Deferred();
        var listUrl = _spPageContextInfo.webAbsoluteUrl;
        var cache = SPOC.Utils.Storage.set('SPOCC-Users-' + user.id);

        // Return cached version if available
        if (cache && !forceNoCache) {
            return deferred.promise().resolve(cache);
        } else {

            listUrl += "/_api/SP.UserProfiles.PeopleManager/GetPropertiesFor(accountName=@v)?@v=%27" + loginNamePrefix + user.loginName + "%27";

            // else get data and return promise.
            $.ajax({
                type: "GET",
                url: listUrl,
                dataType: 'json',
                success: function(data) {
                    // On complete, cache results
                    SPOC.Utils.Storage.set('SPOCC-Users-' + user.id, data);
                    deferred.resolve(data);
                }
            });

            return deferred.promise();
        }
    };

    return methods;
};
// Yammer Group Functionlity.

SPOC.Yam.Messages = function() {

    // save reference to this
    var _this = this;

    // Create object to store public methods
    var methods = {};

    // Default api endpoint to all messages
    var apiUrl = "messages.json";

    // If an id is passed and feedtype, formuate new endpoint
    if (_this.feedId && _this.feedType) {
        apiUrl = "messages/" + _this.feedType === 'group' ? "in_group" : "from_user" + "/" + _this.feedId + ".json";
    }

    /**
     * Queries a Yammer Group and returns feed items
     * @return  jQuery Deferred Object
     */
    methods.query = function(settings, forceNoCache) {
        var deferred = $.Deferred();

        // Get query from cache.
        var cache = SPOC.Utils.Storage.get('SPOCC-yammessage' + _this.feedId + _this.feedType);

        // Return cached version if available
        if (cache && !forceNoCache) {
            deferred.resolve(cache);
        } else {
            // Check user has access token and then then return group feed.
            SPOC.Utils.Yammer.checkLogin().then(function() {
                yam.platform.request({
                    url: apiUrl,
                    method: "GET",
                    data: settings ? settings : null,
                    success: function(data) {
                        // Format response to combine references with messages
                        data = SPOC.Utils.Yammer.formatFeedResponse(data);
                        SPOC.Utils.Storage.set('SPOCC-yammessage' + _this.feedId + _this.feedType, data);
                        deferred.resolve(data);
                    },
                    error: function(data) {
                        deferred.reject(data);
                    }
                });
            });
        }

        return deferred.promise();

    };


    return methods;

};
// Yammer Group Functionlity.

SPOC.Yam.Search = function() {

    // save reference to this
    var _this = this;

    // Create object to store public methods
    var methods = {};

    // Default api endpoint to search
    var apiUrl = "search.json";

    /**
     * Queries a Yammer Group and returns feed items
     * @return  jQuery Deferred Object
     */
    methods.query = function(settings, forceNoCache) {
        var deferred = $.Deferred();

        // Get query from cache.
        var cache = SPOC.Utils.Storage.get('SPOCC-yamsearch-' + JSON.stringify(settings));

        // Return cached version if available
        if (cache && !forceNoCache) {
            deferred.resolve(cache);
        } else {
            // Check user has access token and then then return group feed.
            SPOC.Utils.Yammer.checkLogin().then(function() {
                yam.platform.request({
                    url: apiUrl,
                    method: "GET",
                    data: settings ? settings : null,
                    success: function(data) {
                        // Format response to combine references with messages
                        data = SPOC.Utils.Yammer.formatSearchResponse(data);
                        SPOC.Utils.Storage.set('SPOCC-yamsearch-' + JSON.stringify(settings), data);
                        deferred.resolve(data);
                    },
                    error: function(data) {
                        deferred.reject(data);
                    }
                });
            });

        }
        return deferred.promise();

    };


    return methods;

};
// Yammer User Functionlity.

SPOC.Yam.User.prototype.Subscriptions = function() {

    // save reference to this
    var _this = this;

    // Create object to store public methods
    var methods = {};

    /**
     * Queries a Yammer User Profile and returns properties
     * @return  jQuery Deferred Object
     */
    methods.query = function(settings, forceNoCache) {
        var defer = $.Deferred();

        //Get query from cache.
        var cache = SPOC.Utils.Storage.get('SPOCC-yamsubscriptions' + _this.id);

        // Return cached version if available
        if (cache && !forceNoCache) {
            deferred.resolve(cache);
        } else {
            // Check user has access token and then then return group feed.
            SPOC.Utils.Yammer.checkLogin().then(function() {
                yam.platform.request({
                    url: "subscriptions/to_user/" + _this.id + ".json",
                    method: "GET",
                    data: settings ? settings : null,
                    success: function(data) {
                        SPOC.Utils.Storage.set('SPOCC-yamsubscriptions' + _this.id, data);
                        defer.resolve(data);
                    },
                    error: function(data) {
                        defer.reject(data);
                    }
                });
            });

        }
        return defer.promise();

    };

    return methods;

};
// Yammer User Functionlity.

SPOC.Yam.User.prototype.Profile = function() {

    // save reference to this
    var _this = this;

    // Create object to store public methods
    var methods = {};

    /**
     * Queries a Yammer User Profile and returns properties
     * @return  jQuery Deferred Object
     */
    methods.query = function(settings, forceNoCache) {
        var defer = $.Deferred();

        //Get query from cache.
        var cache = SPOC.Utils.Storage.get('SPOCC-yamuser' + _this.id);

        // Return cached version if available
        if (cache && !forceNoCache) {
            deferred.resolve(cache);
        } else {
            // Check user has access token and then then return group feed.
            SPOC.Utils.Yammer.checkLogin().then(function() {
                yam.platform.request({
                    url: "users/" + _this.id + ".json",
                    method: "GET",
                    data: settings ? settings : null,
                    success: function(data) {
                        SPOC.Utils.Storage.set('SPOCC-yamuser' + _this.id, data);
                        defer.resolve(data);
                    },
                    error: function(data) {
                        defer.reject(data);
                    }
                });
            });

        }
        return defer.promise();

    };

    return methods;

};
})(window, document, window.SPOC = window.SPOC || {}, jQuery);