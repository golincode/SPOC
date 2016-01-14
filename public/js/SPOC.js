/**
 * Define Sp Site Object constructor
 * @params  url  url of Sharepoint site
 * @return  undefined
 */
SPOC.SP.Site = function(url) {

    // Set URL to current site if no url passed in.
    this.url = url ? url : _spPageContextInfo.webAbsoluteUrl;
};


/**
 * Define Sp User Object constructor
 * @params  url  url of Sharepoint site
 * @return  object
 */
SPOC.SP.User = function(username) {
    this.id = username ? username : _spPageContextInfo.userId;
    this.loginName = username ? username : _spPageContextInfo.userLoginName;  
};


/**
 * Define Yam Object constructor & ensure login
 * @params  url  url of Sharepoint site
 * @return object
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
 * @return object
 */
SPOC.Yam.Feed = function(feedId, feedType) {

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
     * @return promise
     */
    methods.query = function(settings, forceNoCache, headers) {
        var listUrl = site.url + '/_api/web/lists/getByTitle%28%27' + listTitle + '%27%29/items';
        
        listUrl += settings ? '?' + SPOC.Utils.Conversion.objToQueryString(settings) : '';
        
        return SPOC.Utils.Request.get(listUrl, forceNoCache);        
    };


    /**
     * Creates a new list items
     * @params  Object Create list settings
     * List of options can be found at https://msdn.microsoft.com/en-us/library/office/dn292552.aspx
     * @return  promise
     */
    methods.create = function(data) {
        var listUrl = site.url + '/_api/web/lists/getByTitle%28%27' + listTitle + '%27%29/items';
        var defaults = {
            __metadata: {
                'type': SPOC.Utils.SP.getListItemType(listTitle)
            }
        };

        if (data) {
            defaults = SPOC.Utils.Objects.merge(defaults, data);
        }

        return SPOC.Utils.Request.post(listUrl, defaults);
    };


    /**
     * Creates a new list items
     * @params  Object Create list settings
     * List of options can be found at https://msdn.microsoft.com/en-us/library/office/dn292552.aspx
     * @return promise
     */
    methods.update = function(id, data) {
        var listUrl = site.url + '/_api/web/lists/getByTitle%28%27' + listTitle + '%27%29/items(' + id + ')';
        var defaults = {
            __metadata: {
                'type': SPOC.Utils.SP.getListItemType(listTitle)
            }
        };

        if (data) {
            defaults = SPOC.Utils.Objects.merge(defaults, data);
        }

        return SPOC.Utils.Request.put(listUrl, defaults);
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
     * @return  promise
     */
    methods.query = function(settings, forceNoCache) {
        var listUrl = site.url + '/_api/web/lists/getByTitle%28%27' + listTitle + '%27%29/';

        listUrl += settings ? '?' + SPOC.Utils.Conversion.convertObjToQueryString(settings) : '';

        return SPOC.Utils.Request.get(listUrl, forceNoCache);
    };

    /**
     * Creates a new SharePoint List
     * @params  Object Create list settings
     * List of options can be found at https://msdn.microsoft.com/en-us/library/office/dn292552.aspx
     * @return  promise
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
           defaults = SPOC.Utils.Objects.merge(defaults, settings);
        }

        var url = site.url + '/_api/web/lists';

        return SPOC.Utils.Request.post(url, defaults);
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
     * @return  promise
     */
    methods.query = function(forceNoCache) {
        var listUrl = _spPageContextInfo.webAbsoluteUrl;

        if (user.loginName){
            listUrl += "/_api/SP.UserProfiles.PeopleManager/GetPropertiesFor(accountName=@v)?@v=%27" + loginNamePrefix + user.loginName + "%27";
        } else {
            listUrl += "/_api/SP.UserProfiles.PeopleManager/GetMyProperties/UserProfileProperties";
        }
        // return promise
        return SPOC.Utils.Request.get(listUrl, forceNoCache);
    };


    /**
     * Returns if a SP user is a member of a security group
     * @params  groupName to check
     * @params  user Id to check (optional)
     * @return  bool
     */
    methods.isMemberOfGroup = function(groupName, userId, forceNoCache) {
        var user = userId ? userId : _spPageContextInfo.userId;
        var listUrl = site.url +  "/_api/web/sitegroups/getByName('" + groupName + "')/Users?$filter=Id eq " + user;

        // return promise
        return SPOC.Utils.Request.get(listUrl, forceNoCache);
    };

    return methods;
};
// Yammer Group Functionlity.

SPOC.Yam.Feed.prototype.posts = function() {

    // save reference to this
    var _this = this;

    // Create object to store public methods
    var methods = {};

    // Default api endpoint to all messages
    var apiUrl = "messages/following.json";

    // If an id is passed and feedtype, formuate new endpoint
    if (_this.feedId) {
        apiUrl = "messages/" + _this.feedType ? "in_group" : "from_user" + "/" + _this.feedId + ".json";
    }

    /**
     * Queries a Yammer Group and returns feed items
     * @return promise
     */
    methods.query = function(settings) {
         return new Promise(function(resolve, reject) {
            // Check user has access token and then then return group feed.
            SPOC.Utils.Yammer.checkLogin().then(function(result) {
                if (result) {
                    yam.platform.request({
                        url: apiUrl,
                        method: "GET",
                        data: settings ? settings : null,
                        success: function(data) {
                            // Format response to combine references with messages
                            data = SPOC.Utils.Yammer.formatFeedResponse(data);
                            resolve(data);
                        },
                        error: function(data) {
                            reject(data);
                        }
                    });
                } else {
                     resolve(false);
                }
            });
        });
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
       return new Promise(function(resolve, reject) {
            // Check user has access token and then then return group feed.
            SPOC.Utils.Yammer.checkLogin().then(function(result) {
                if (result) {
                   yam.platform.request({
                        url: apiUrl,
                        method: "GET",
                        data: settings ? settings : null,
                        success: function(data) {
                            // Format response to combine references with messages
                            data = SPOC.Utils.Yammer.formatSearchResponse(data);
                            SPOC.Utils.Storage.set('SPOC-yam-search-' + JSON.stringify(settings), data);
                            resolve(data);
                        },
                        error: function(data) {
                            reject(data);
                        }
                    });
                } else {
                     resolve(false);
                }
            });
        });
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
     * @return  promise
     */
    methods.query = function(settings, forceNoCache) {
       return new Promise(function(resolve, reject) {
            // Check user has access token and then then return group feed.
            SPOC.Utils.Yammer.checkLogin().then(function(result) {
                if (result) {
                    yam.platform.request({
                        url: "subscriptions/to_user/" + _this.id + ".json",
                        method: "GET",
                        data: settings ? settings : null,
                        success: function(data) {
                            SPOC.Utils.Storage.set('SPOC-yam-subs-' + _this.id, data);
                            deferred.resolve(data);
                        },
                        error: function(data) {
                            deferred.reject(data);
                        }
                    });
                } else {
                     resolve(false);
                }
            });
        });
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
     * @return promise
     */
    methods.query = function(settings, forceNoCache) {
        return new Promise(function(resolve, reject) {
            // Check user has access token and then then return group feed.
            SPOC.Utils.Yammer.checkLogin().then(function(result) {
                if (result) {
                    yam.platform.request({
                        url: "users/" + _this.id + ".json",
                        method: "GET",
                        data: settings ? settings : null,
                        success: function(data) {
                            SPOC.Utils.Storage.set('SPOCC-yam-users-' + _this.id, data);
                            deferred.resolve(data);
                        },
                        error: function(data) {
                            deferred.reject(data);
                        }
                    });
                } else {
                     resolve(false);
                }
            });
        });
    };

    return methods;

};
/**
 * Version: 0.0.1
 * Copyright (c) 2015-2015, Architect 365 (https://www.architect365.co.uk). All rights reserved.
 * License: Licensed under The MIT License. See license.txt and http://www.datejs.com/license/.
 * Website: https://www.architect365.co.uk
 */


(function(window, document, SPOC, undefined) {
        'use strict';

        // Define all top level namespaces.
        SPOC.Utils = {};
        SPOC.SP = {};
        SPOC.Yam = {};
})(window, document, window.SPOC = window.SPOC || {});
SPOC.Utils.Conversion = {};

/**
 * Converts a Javascript object to SP API query string format
 * @params  obj Object of props to convert
 * @return  string
 */
SPOC.Utils.Conversion.objToQueryString = function(obj) {
    var str = '';
    for (var propertyName in obj) {
        str += '&$' + propertyName + '=' + obj[propertyName].replace(/ /g, '_x0020_');
    }
    return encodeURI(str);
};



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

SPOC.Utils.Objects = {};

/**
 * Find a object in object array by property value
 * @params  data object array to search
 * @params  prop property to search 
 * @params  value value to search
 * @return  index or false
 */
SPOC.Utils.Objects.findObjectByProperty = function(data, prop, value) {
    var i;
    for (i = 0; i < data.length; i++) {
        if (data[i][prop] === value) {
            return data[i];
        }
    }
    return false;
};

/**
 * Merge to Javascipt objects together
 * @params  obj Object of props to convert
 * @return  string
 */
SPOC.Utils.Objects.merge = function(obj1, obj2) {
    for (var p in obj2) {
        try {
          // Property in destination object set; update its value.
          if ( obj2[p].constructor==Object ) {
            obj1[p] = MergeRecursive(obj1[p], obj2[p]);

          } else {
            obj1[p] = obj2[p];

          }

        } catch(e) {
          // Property in destination object not set; create it and set its value.
          obj1[p] = obj2[p];

        }
  }
  return obj1;
};

SPOC.Utils.Request = {};

/**
 * Makes a ajax requestio to a sharepoint url
 * @params  url url to retrieve
 * @params  forceNoCache bool to set if cache should be ignored
 * @return  javascript promise
 */
SPOC.Utils.Request.get = function(url, forceNoCache) {

    return new Promise(function(resolve, reject) {
        // Check if item is cached is session storage
        var cache = SPOC.Utils.Storage.get('SPOC-' + url);

        if(cache && !forceNoCache){
             resolve(cache);
        } else {

            // Check if a Mock db has been set
            if(SPOC.Mock.active) {
                url = SPOC.Utils.Url.getListNameFromUrl(url);
                var mockData = SPOC.Mock.db[url];
                if (mockData){
                    resolve(mockData);
                } else {
                    resolve({"error": "no mock data found for the list - " + url});
                }
            } else {

            if(!SPOC.Utils.Url.isSameDomain(url) && url.toLowerCase().indexOf('_api/web') > -1){
                url = SPOC.Utils.Url.convertToXDomain(url);
            }

            var req = new XMLHttpRequest();

            req.open('GET', url, true);
            req.setRequestHeader("Accept", "application/json;odata=verbose");

            req.onreadystatechange = function() {
                if (req.readyState == 4){
                      if (req.status == 200) {
                        var data = JSON.parse(req.responseText);
                            data = data.d.results ? data.d.results : data.d;
                            SPOC.Utils.Storage.set('SPOC-' + url, data);
                        
                        resolve(data);
                      }
                      else {
                        reject(Error(JSON.parse(req.statusText)));
                      }
                  }
                };

            req.onerror = function(err) {
              reject(Error('Network Error'));
            };
                req.send();
            } 
        }
    });
};

/**
 * Makes a post ajax requestio to a sharepoint url
 * @params  url url to retrieve
 * @params  data bool data to post
 * @return  javascript promise
 */
SPOC.Utils.Request.post = function(url, data) {
    return new Promise(function(resolve, reject) {
            // Check if a Mock db has been set
            if(SPOC.Mock.active){
                resolve(data);
            } else {

            if(!SPOC.Utils.Url.isSameDomain(url) && url.toLowerCase().indexOf('_api/web') > -1){
                url = SPOC.Utils.Url.convertToXDomain(url);
            }

            var req = new XMLHttpRequest();

            req.open('POST', url, true);
            req.setRequestHeader("Accept", "application/json;odata=verbose");
            req.setRequestHeader("X-RequestDigest", document.getElementById('__REQUESTDIGEST').value);
            req.setRequestHeader("Content-Type", "application/json;odata=verbose");

            req.onreadystatechange = function() {
                if (req.readyState == 4){
                      if (req.status == 200) {
                        resolve(data);
                      }
                      else {
                        reject(Error(req.statusText));
                      }
                  }
                };

            req.onerror = function(err) {
              reject(Error('Network Error'));
            };
                req.send(JSON.stringify(data));
            } 
        
    });
};

/**
 * Makes a put ajax requestio to a sharepoint url
 * @params  url url to retrieve
 * @params  data bool data to post
 * @return  javascript promise
 */
SPOC.Utils.Request.put = function(url, data) {
    return new Promise(function(resolve, reject) {
            // Check if a Mock db has been set
            if(SPOC.Mock.active){
                resolve(data);
            } else {

            if(!SPOC.Utils.Url.isSameDomain(url) && url.toLowerCase().indexOf('_api/web') > -1){
                url = SPOC.Utils.Url.convertToXDomain(url);
            }

            var req = new XMLHttpRequest();

            req.open('POST', url, true);
            req.setRequestHeader("Accept", "application/json;odata=verbose");
            req.setRequestHeader("X-RequestDigest", document.getElementById('__REQUESTDIGEST').value);
            req.setRequestHeader("Content-Type", "application/json;odata=verbose");
            req.setRequestHeader("X-HTTP-Method", "MERGE");
            req.setRequestHeader("If-Match", "*");

            req.onreadystatechange = function() {
                if (req.readyState == 4){
                      if (req.status == 200) {
                        resolve(data);
                      }
                      else {
                        reject(Error(req.statusText));
                      }
                  }
                };

            req.onerror = function(err) {
              reject(Error('Network Error'));
            };
                req.send(JSON.stringify(data));
            } 
        
    });
};
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
 * @return Promise
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

SPOC.Utils.Strings = {};

/**
 * Cuts a string to a required length and adds ...
 * @return  bool
 */
SPOC.Utils.Strings.cut = function(value, requiredLength) {
    return value.length > requiredLength ? title.substr(0, requiredLength - 3) + "..." : value.length;
};

// Super simple template engine that allows you to pass in a data array and html template.

SPOC.Utils.Tpl = {};

/**
 * Gets object propery value by string representation eg. Obj.prop.prop2
 * @params  propertyName string of required property
 * @params  obj Object to evaulate
 * @return  property string value of property
 */
SPOC.Utils.Tpl.getProperty = function(propertyName, obj) {
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
SPOC.Utils.Tpl.render = function(tpl, data) {
    var regex = /{{(.*?)}}/g;
    var matches = tpl.match(regex);
    if (matches && matches.length) {
        for (var i = 0, len = matches.length; i < len; i++) {
            tpl = tpl.replace(new RegExp(matches[i], 'g'), SPOC.Utils.Tpl.getProperty(matches[i].replace(/{{|}}/g, ""), data));
        }
    }

    return tpl;
};

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

/**
 * Extracts and returns a list name from api url endpoint
 * @params  url 
 * @return  string
 */
SPOC.Utils.Url.getListNameFromUrl = function(url) {
   var regex = /\%27(.*)\%27/g;
   var match = regex.exec(url);
    return match ? match[1] : null;
};


/**
 * Converts a Javascript object to SP API query string format
 * @params  obj Object of props to convert
 * @return  string
 */
SPOC.Utils.Url.isSameDomain = function(url) {
    var current = window.location.origin.toLowerCase();
    return url.toLowerCase().indexOf(current) > -1 ? true : false;
};

/**
 * Converts a API call to x domain format
 * @params  url string url of API call
 * @return  string
 */
SPOC.Utils.Url.convertToXDomain = function(url) {
    url = url.toLowerCase();
    url = url.replace('/_api/', '/_api/SP.AppContextSite(@target)/');
    var domain = url.split('/_api')[0];
    url = url.split('/_api')[1];

    if (url.indexOf('?') === -1){
        url = url + '?';
    }
    
    url = window.location.origin + '/_api' + url + '@target=%27' + domain + '%27';

    return url;
};

SPOC.Utils.Yammer = {};

/**
 * Matches references with messages and returns tidier data object
 * @params  array obj Yammer feed Object
 * @return  array
 */
SPOC.Utils.Yammer.formatFeedResponse = function(data) {
    var i;
    var cleanFeed = [];

    for (i = 0; i < data.messages.length; i++) {
        if (!data.messages[i].replied_to_id) {
            if (data.messages[i].sender_type && data.messages[i].sender_type === 'user') {
                data.messages[i].user = SPOC.Utils.Arrays.findByProperty(data.references, 'id', data.messages[i].sender_id);
                cleanFeed.push(data.messages[i]);
            }
        }
    }
    return cleanFeed;
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
SPOC.Utils.Yammer.checkLogin = function(promptLogin) {
     return new Promise(function(resolve, reject) {
         yam.getLoginStatus(function(response) {
            if (response.authResponse) {
                deferred.resolve(response);
            } else {
                if (promptLogin) {
                    yam.platform.login(function(user) {
                        if (user) {
                            resolve(user);
                        } else {
                            resolve(false);
                        }
                    });
                } else {
                    resolve(response);
                }
            }
        });
    });
};