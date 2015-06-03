/*! SPOC 03-06-2015 */


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

  
// Create objects for Utils conversion
SPOC.Utils.conversion = {};

/**
 * Converts a Javascript object to SP API query string format
 * @params  obj Object of props to convert
 * @return  string
 */
SPOC.Utils.conversion.ObjToQueryString = function(obj) {
    var str = '';
    for (var propertyName in obj) {
        str += '&$' + propertyName + '=' + obj[propertyName];
    }
    return str;
};

// Create objects for Utils conversion
SPOC.Utils.storage = {};

/**
 * Checks if session and local storage is available
 * @return  bool
 */
SPOC.Utils.storage.storageAvailable = function() {
    return (typeof(Storage) !== "undefined");
};

/**
 * Add data to local or session storage
 * @params  key String to use as item key
 * @params  data Object containing data to save
 * @params  isLocal bool to us local storage rather than session
 * @return  void
 */
SPOC.Utils.storage.set = function(key, data, isLocal) {
    if (SPOC.Utils.storage.storageAvailable()) {
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
SPOC.Utils.storage.get = function(key, isLocal) {
    if (SPOC.Utils.storage.storageAvailable()) {
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
SPOC.Utils.storage.remove = function(key, isLocal) {
    if (SPOC.Utils.storage.storageAvailable()) {
        var storageObj = isLocal ? localStorage : sessionStorage;
        localStorage.removeItem(key);
    }
};

// Create objects for Utils conversion
SPOC.Utils.tpls = {};

/**
 * Gets object propery value by string representation eg. Obj.prop.prop2
 * @params  propertyName string of required property
 * @params  obj Object to evaulate
 * @return  property string value of property
 */
SPOC.Utils.tpls.getProperty = function(propertyName, obj) {
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
SPOC.Utils.tpls.render = function(tpl, data) {
    var regex = /{{(.*?)}}/g;
    var matches = tpl.match(regex);
    if (matches && matches.length) {
        for (var i = 0, len = matches.length; i < len; i++) {
            tpl = tpl.replace(new RegExp(matches[i], 'g'), SPOC.Utils.tpls.getProperty(matches[i].replace(/{{|}}/g, ""), data));
        }
    }

    return tpl;
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

// SharePoint List Items Functionlity

SPOC.SPSite.prototype.list = function(listTitle) {

    // save reference to this
    var site = this;

    // Create object to store public methods
    var methods = {};

    /**
     * Queries a SharePont list via REST API
     * @params  Object query filter paramators in obj format
     * @return  jQuery Deferred Object
     */
    methods.query = function(settings) {
        var listUrl = site.url + '/_api/lists/getByTitle%28%27' + listTitle + '%27%29/items';
        listUrl += settings ? '?' + Utils.convertObjToQueryString(settings) : '';

        return $.ajax({
            type: "GET",
            url: listUrl,
            dataType: 'json',
            complete: function(data) {
                // On complete, cache results
                SPOC.Utils.storage.set('SPOCC-listitems' + listTitle, data);
            }
        });

    };

    methods.getCached = function(listTitle) {
        console.log(this);
        return SPOC.Utils.storage.get('SPOCC-listitems' + listTitle);
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

SPOC.SPSite.prototype.lists = function(listTitle) {

    // save reference to this
    var site = this;

    // Create object to store public methods
    var methods = {};

    /**
     * Queries a SharePont list via REST API
     * @params  Object query filter paramators in obj format
     * @return  jQuery Deferred Object
     */
    methods.query = function(settings) {
        var listUrl = site.url + '/_api/lists/getByTitle%28%27' + listTitle + '%27%29/';
        listUrl += settings ? '?' + Utils.convertObjToQueryString(settings) : '';

        return $.ajax({
            type: "GET",
            url: listUrl,
            dataType: 'json',
            complete: function (){
                // On complete, cache results
                SPOC.Utils.storage.set('SPOCC-list' + listTitle, data);
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

})(window, document, window.SPOC = window.SPOC || {}, jQuery);