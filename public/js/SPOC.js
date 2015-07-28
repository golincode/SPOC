/*! SPOC 28-07-2015 */


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
  SPOC.SPSite = null;
  //SPOC.SPUser = null;
  SPOC.Yam = null;


  
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
 * Define Sp Site Object constructor
 * @params  url  url of Sharepoint site
 * @author  Martin Pomeroy <mpomeroy@wearearchitect.com>
 * @return  void
 */
SPOC.SPSite = function(url) {

    // Set URL to current site if no url passed in.
    this.url = url ? url : _spPageContextInfo.webAbsoluteUrl;
};




/**
 * Define Yam Object constructor & ensure login
 * @params  url  url of Sharepoint site
 * @author  Martin Pomeroy <mpomeroy@wearearchitect.com>
 * @return  void
 */
SPOC.Yam = function() {

    if (!window.yam) {
        //@todo: Update error messages to SP notifications?
        console.log('Please ensure that you have included Yammer SDK and added a valid Client Id');
    }

};
// SharePoint List Items Functionlity



SPOC.SPSite.prototype.ListItems = function(listTitle) {

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
        var listUrl = site.url + '/_api/lists/getByTitle%28%27' + listTitle + '%27%29/items';

        // Get query from cache.
        var cache = SPOC.Utils.Storage.get('SPOCC-listitems' + listTitle);

        // Convert and append query params
        listUrl += settings ? '?' + SPOC.Utils.convertObjToQueryString(settings) : '';

        // Return cached version if available
        if (cache && !forceNoCache) {
            return cache;
        }

        // else get data and return promise.
        return $.ajax({
            type: "GET",
            url: listUrl,
            dataType: 'json',
            headers: {
                "Accept": "application/json;odata=verbose" + verbose ? "verbose" : "nometadata"
            },
            complete: function(data) {
                // On complete, cache results
                SPOC.Utils.Storage.set('SPOCC-listitems' + listTitle, data);
            }
        });
    };

    /**
     * Creates a new list items
     * @params  Object Create list settings
     * List of options can be found at https://msdn.microsoft.com/en-us/library/office/dn292552.aspx
     * @return  jQuery Deferred Object
     */
     methods.create = function(items) {
        var listUrl = site.url + '/_api/lists/getByTitle%28%27' + listTitle + '%27%29/items';
        var data = {
            __metadata: {
                'type': SPOC.Utils.SP.getListItemType(listTitle)
            }
        };

        if (settings) {
            $.extend(data, items);
        }

        return $.ajax({
            type: "POST",
            url: listUrl,
            data: JSON.stringify(data),
            headers: {
                "Accept": "application/json;odata=verbose",
                "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                'Content-Type': "application/json;odata=verbose"
            }
        });
    };


    /**
     * Creates a new list items
     * @params  Object Create list settings
     * List of options can be found at https://msdn.microsoft.com/en-us/library/office/dn292552.aspx
     * @return  jQuery Deferred Object
     */
     methods.update = function(id, data) {
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

        return $.ajax({
            type: "POST",
            url: listUrl,
            data: JSON.stringify(defaults),
            headers: {
                "Accept": "application/json;odata=verbose",
                "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                'Content-Type': "application/json;odata=verbose"
            }
        });
    };

    /**
     * Deletes a list items
     * @params  Object Delete list settings
     * List of options can be found at https://msdn.microsoft.com/en-us/library/office/dn292552.aspx
     * @return  jQuery Deferred Object
     */
     methods.delete = function(item) {
        var listUrl = item.__metadata.uri;

        if (settings) {
            $.extend(data, settings);
        }

        return $.ajax({
            type: "POST",
            url: listUrl,
            data: JSON.stringify(data),
            headers: {
                "Accept": "application/json;odata=verbose",
                "X-Http-Method": "DELETE",
                "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                "If-Match": "*",
                'Content-Type': "application/json;odata=verbose"
            }
        });
    };

    /**
     * Deletes a list items get by Id
     * @params  Object Delete list settings
     * List of options can be found at https://msdn.microsoft.com/en-us/library/office/dn292552.aspx
     * @return  jQuery Deferred Object
     */
     methods.deleteById = function(id) {
        var listUrl = site.url + '/_api/lists/getByTitle%28%27' + listTitle + '%27%29/items';
        var data = {
            __metadata: {
                'type': SPOC.Utils.SP.getListItemType(listTitle)
            }
        };

        if (settings) {
            $.extend(data, settings);
        }

        return $.ajax({
            type: "POST",
            url: listUrl,
            data: JSON.stringify(data),
            headers: {
                "Accept": "application/json;odata=verbose",
                "X-Http-Method": "DELETE",
                "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                "If-Match": "*",
                'Content-Type': "application/json;odata=verbose"
            }
        });
    };


    return methods;
};
// SharePoint List Functionlity

SPOC.SPSite.prototype.Lists = function(listTitle) {

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
        var listUrl = site.url + '/_api/lists/getByTitle%28%27' + listTitle + '%27%29/';
        var cache = SPOC.Utils.Storage.get('SPOCC-list' + listTitle);

        listUrl += settings ? '?' + SPOC.Utils.Conversion.convertObjToQueryString(settings) : '';

         // Return cached version if available
        if (cache && !forceNoCache) {
            return cache;
        }
        
        // else get data and return promise.
        return $.ajax({
            type: "GET",
            url: listUrl,
            dataType: 'json',
            complete: function() {
                // On complete, cache results
                SPOC.Utils.Storage.set('SPOCC-list' + listTitle, data);
            }
        });
    };

    /**
     * Creates a new SharePoint List
     * @params  Object Create list settings
     * List of options can be found at https://msdn.microsoft.com/en-us/library/office/dn292552.aspx
     * @return  jQuery Deferred Object
     */
    methods.create = function(settings) {
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

        return $.ajax({
            type: "POST",
            url: site.url + '/_api/web/lists',
            data: JSON.stringify(defaults),
            headers: {
                "Accept": "application/json;odata=verbose",
                "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                'Content-Type': "application/json;odata=verbose"
            }
        });
    };

    return methods;
};
// SharePoint List Functionlity

SPOC.SPSite.prototype.SPUsers = function() {

    // save reference to this
    var site = this;

    // Create object to store public methods
    var methods = {};

    /**
     * Queries a SharePont User via REST API
     * @params  Object query filter paramators in obj format
     * @return  jQuery Deferred Object
     */
    methods.query = function(account) {
        var listUrl = site.url;
        var cache = SPOC.Utils.Storage.get('SPOCC-SPUsers');

        listUrl += account ? "/_api/SP.UserProfiles.PeopleManager/GetPropertiesFor(accountName=@v)?@v=%27" + account + "%27" : "/_api/SP.UserProfiles.PeopleManager/GetMyProperties";

        // else get data and return promise.
        return $.ajax({
            type: "GET",
            url: listUrl,
            dataType: 'json',
            complete: function() {
                // On complete, cache results
                SPOC.Utils.Storage.set('SPOCC-SPUsers', data);
            }
        });
    };

    return methods;
};
// Yammer Group Functionlity.

SPOC.Yam.prototype.Auth = function() {

    // save reference to this
    var _this = this;

    // Create object to store public methods
    var methods = {};

    /**
     * Checks that user is logged into Yammer. If not, Logins user and fetches access token.
     * @return  jQuery Deferred Object
     */
    methods.checkLogin = function() {
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


    return methods;

};
// Yammer Group Functionlity.

SPOC.Yam.prototype.Messages = function(feedId, feedType) {

    // save reference to this
    var _this = this;

    // Create object to store public methods
    var methods = {};

    // Default api endpoint to all messages
    var apiUrl = "messages.json";

    // If an id is passed and feedtype, formuate new endpoint
    if (feedId && feedType) {
        apiUrl = "messages/" + feedType === 'group' ? "in_group" : "from_user" + "/" + feedId + ".json";
    }

    /**
     * Queries a Yammer Group and returns feed items
     * @return  jQuery Deferred Object
     */
    methods.query = function(settings, forceNoCache) {
        var promise = $.Deferred();

        // Get query from cache.
        var cache = SPOC.Utils.Storage.get('SPOCC-yammessage' + feedId + feedType);

        // Return cached version if available
        if (cache && !forceNoCache) {
            promise.resolve(cache);
        } else {
            // Check user has access token and then then return group feed.
            _this.Auth.checkLogin().then(function() {
                yam.platform.request({
                    url: apiUrl,
                    method: "GET",
                    data: settings ? settings : null,
                    success: function(data) {
                        // Format response to combine references with messages
                        data = SPOC.Utils.Yammer.formatFeedResponse(data);
                        SPOC.Utils.Storage.set('SPOCC-yammessage' + feedId + feedType, data);
                        promise.resolve(data);
                    },
                    error: function(data) {
                        promise.reject(data);
                    }
                });
            });
        }

        return promise;
    };


    return methods;

};
// Yammer User Functionlity.

SPOC.Yam.prototype.User = function(userId) {

    // save reference to this
    var _this = this;

    // Create object to store public methods
    var methods = {};

    // If not user id is passed in, set as current.
    userId = userId ? userId : 'current';

    /**
     * Queries a Yammer User Profile and returns properties
     * @return  jQuery Deferred Object
     */
    methods.query = function(settings, forceNoCache) {
        var promise = $.Deferred();

        //Get query from cache.
        var cache = SPOC.Utils.Storage.get('SPOCC-yamuser' + userId);

        // Return cached version if available
        if (cache && !forceNoCache) {
            promise.resolve(cache);
        } else {
            // Check user has access token and then then return group feed.
            _this.Auth.checkLogin().then(function() {
                yam.platform.request({
                    url: "users/" + userId + ".json",
                    method: "GET",
                    data: settings ? settings : null,
                    success: function(data) {
                        SPOC.Utils.Storage.set('SPOCC-yamuser' + userId, data);
                        promise.resolve(data);
                    },
                    error: function(data) {
                        promise.reject(data);
                    }
                });
            });
        }

        return promise;
    };

    return methods;

};
})(window, document, window.SPOC = window.SPOC || {}, jQuery);