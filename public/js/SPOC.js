/*! SPOC 22-01-2016 */


/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/jakearchibald/es6-promise/master/LICENSE
 * @version   3.0.2
 */

(function(){"use strict";function lib$es6$promise$utils$$objectOrFunction(x){return typeof x==="function"||typeof x==="object"&&x!==null}function lib$es6$promise$utils$$isFunction(x){return typeof x==="function"}function lib$es6$promise$utils$$isMaybeThenable(x){return typeof x==="object"&&x!==null}var lib$es6$promise$utils$$_isArray;if(!Array.isArray){lib$es6$promise$utils$$_isArray=function(x){return Object.prototype.toString.call(x)==="[object Array]"}}else{lib$es6$promise$utils$$_isArray=Array.isArray}var lib$es6$promise$utils$$isArray=lib$es6$promise$utils$$_isArray;var lib$es6$promise$asap$$len=0;var lib$es6$promise$asap$$toString={}.toString;var lib$es6$promise$asap$$vertxNext;var lib$es6$promise$asap$$customSchedulerFn;var lib$es6$promise$asap$$asap=function asap(callback,arg){lib$es6$promise$asap$$queue[lib$es6$promise$asap$$len]=callback;lib$es6$promise$asap$$queue[lib$es6$promise$asap$$len+1]=arg;lib$es6$promise$asap$$len+=2;if(lib$es6$promise$asap$$len===2){if(lib$es6$promise$asap$$customSchedulerFn){lib$es6$promise$asap$$customSchedulerFn(lib$es6$promise$asap$$flush)}else{lib$es6$promise$asap$$scheduleFlush()}}};function lib$es6$promise$asap$$setScheduler(scheduleFn){lib$es6$promise$asap$$customSchedulerFn=scheduleFn}function lib$es6$promise$asap$$setAsap(asapFn){lib$es6$promise$asap$$asap=asapFn}var lib$es6$promise$asap$$browserWindow=typeof window!=="undefined"?window:undefined;var lib$es6$promise$asap$$browserGlobal=lib$es6$promise$asap$$browserWindow||{};var lib$es6$promise$asap$$BrowserMutationObserver=lib$es6$promise$asap$$browserGlobal.MutationObserver||lib$es6$promise$asap$$browserGlobal.WebKitMutationObserver;var lib$es6$promise$asap$$isNode=typeof process!=="undefined"&&{}.toString.call(process)==="[object process]";var lib$es6$promise$asap$$isWorker=typeof Uint8ClampedArray!=="undefined"&&typeof importScripts!=="undefined"&&typeof MessageChannel!=="undefined";function lib$es6$promise$asap$$useNextTick(){return function(){process.nextTick(lib$es6$promise$asap$$flush)}}function lib$es6$promise$asap$$useVertxTimer(){return function(){lib$es6$promise$asap$$vertxNext(lib$es6$promise$asap$$flush)}}function lib$es6$promise$asap$$useMutationObserver(){var iterations=0;var observer=new lib$es6$promise$asap$$BrowserMutationObserver(lib$es6$promise$asap$$flush);var node=document.createTextNode("");observer.observe(node,{characterData:true});return function(){node.data=iterations=++iterations%2}}function lib$es6$promise$asap$$useMessageChannel(){var channel=new MessageChannel;channel.port1.onmessage=lib$es6$promise$asap$$flush;return function(){channel.port2.postMessage(0)}}function lib$es6$promise$asap$$useSetTimeout(){return function(){setTimeout(lib$es6$promise$asap$$flush,1)}}var lib$es6$promise$asap$$queue=new Array(1e3);function lib$es6$promise$asap$$flush(){for(var i=0;i<lib$es6$promise$asap$$len;i+=2){var callback=lib$es6$promise$asap$$queue[i];var arg=lib$es6$promise$asap$$queue[i+1];callback(arg);lib$es6$promise$asap$$queue[i]=undefined;lib$es6$promise$asap$$queue[i+1]=undefined}lib$es6$promise$asap$$len=0}function lib$es6$promise$asap$$attemptVertx(){try{var r=require;var vertx=r("vertx");lib$es6$promise$asap$$vertxNext=vertx.runOnLoop||vertx.runOnContext;return lib$es6$promise$asap$$useVertxTimer()}catch(e){return lib$es6$promise$asap$$useSetTimeout()}}var lib$es6$promise$asap$$scheduleFlush;if(lib$es6$promise$asap$$isNode){lib$es6$promise$asap$$scheduleFlush=lib$es6$promise$asap$$useNextTick()}else if(lib$es6$promise$asap$$BrowserMutationObserver){lib$es6$promise$asap$$scheduleFlush=lib$es6$promise$asap$$useMutationObserver()}else if(lib$es6$promise$asap$$isWorker){lib$es6$promise$asap$$scheduleFlush=lib$es6$promise$asap$$useMessageChannel()}else if(lib$es6$promise$asap$$browserWindow===undefined&&typeof require==="function"){lib$es6$promise$asap$$scheduleFlush=lib$es6$promise$asap$$attemptVertx()}else{lib$es6$promise$asap$$scheduleFlush=lib$es6$promise$asap$$useSetTimeout()}function lib$es6$promise$$internal$$noop(){}var lib$es6$promise$$internal$$PENDING=void 0;var lib$es6$promise$$internal$$FULFILLED=1;var lib$es6$promise$$internal$$REJECTED=2;var lib$es6$promise$$internal$$GET_THEN_ERROR=new lib$es6$promise$$internal$$ErrorObject;function lib$es6$promise$$internal$$selfFulfillment(){return new TypeError("You cannot resolve a promise with itself")}function lib$es6$promise$$internal$$cannotReturnOwn(){return new TypeError("A promises callback cannot return that same promise.")}function lib$es6$promise$$internal$$getThen(promise){try{return promise.then}catch(error){lib$es6$promise$$internal$$GET_THEN_ERROR.error=error;return lib$es6$promise$$internal$$GET_THEN_ERROR}}function lib$es6$promise$$internal$$tryThen(then,value,fulfillmentHandler,rejectionHandler){try{then.call(value,fulfillmentHandler,rejectionHandler)}catch(e){return e}}function lib$es6$promise$$internal$$handleForeignThenable(promise,thenable,then){lib$es6$promise$asap$$asap(function(promise){var sealed=false;var error=lib$es6$promise$$internal$$tryThen(then,thenable,function(value){if(sealed){return}sealed=true;if(thenable!==value){lib$es6$promise$$internal$$resolve(promise,value)}else{lib$es6$promise$$internal$$fulfill(promise,value)}},function(reason){if(sealed){return}sealed=true;lib$es6$promise$$internal$$reject(promise,reason)},"Settle: "+(promise._label||" unknown promise"));if(!sealed&&error){sealed=true;lib$es6$promise$$internal$$reject(promise,error)}},promise)}function lib$es6$promise$$internal$$handleOwnThenable(promise,thenable){if(thenable._state===lib$es6$promise$$internal$$FULFILLED){lib$es6$promise$$internal$$fulfill(promise,thenable._result)}else if(thenable._state===lib$es6$promise$$internal$$REJECTED){lib$es6$promise$$internal$$reject(promise,thenable._result)}else{lib$es6$promise$$internal$$subscribe(thenable,undefined,function(value){lib$es6$promise$$internal$$resolve(promise,value)},function(reason){lib$es6$promise$$internal$$reject(promise,reason)})}}function lib$es6$promise$$internal$$handleMaybeThenable(promise,maybeThenable){if(maybeThenable.constructor===promise.constructor){lib$es6$promise$$internal$$handleOwnThenable(promise,maybeThenable)}else{var then=lib$es6$promise$$internal$$getThen(maybeThenable);if(then===lib$es6$promise$$internal$$GET_THEN_ERROR){lib$es6$promise$$internal$$reject(promise,lib$es6$promise$$internal$$GET_THEN_ERROR.error)}else if(then===undefined){lib$es6$promise$$internal$$fulfill(promise,maybeThenable)}else if(lib$es6$promise$utils$$isFunction(then)){lib$es6$promise$$internal$$handleForeignThenable(promise,maybeThenable,then)}else{lib$es6$promise$$internal$$fulfill(promise,maybeThenable)}}}function lib$es6$promise$$internal$$resolve(promise,value){if(promise===value){lib$es6$promise$$internal$$reject(promise,lib$es6$promise$$internal$$selfFulfillment())}else if(lib$es6$promise$utils$$objectOrFunction(value)){lib$es6$promise$$internal$$handleMaybeThenable(promise,value)}else{lib$es6$promise$$internal$$fulfill(promise,value)}}function lib$es6$promise$$internal$$publishRejection(promise){if(promise._onerror){promise._onerror(promise._result)}lib$es6$promise$$internal$$publish(promise)}function lib$es6$promise$$internal$$fulfill(promise,value){if(promise._state!==lib$es6$promise$$internal$$PENDING){return}promise._result=value;promise._state=lib$es6$promise$$internal$$FULFILLED;if(promise._subscribers.length!==0){lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publish,promise)}}function lib$es6$promise$$internal$$reject(promise,reason){if(promise._state!==lib$es6$promise$$internal$$PENDING){return}promise._state=lib$es6$promise$$internal$$REJECTED;promise._result=reason;lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publishRejection,promise)}function lib$es6$promise$$internal$$subscribe(parent,child,onFulfillment,onRejection){var subscribers=parent._subscribers;var length=subscribers.length;parent._onerror=null;subscribers[length]=child;subscribers[length+lib$es6$promise$$internal$$FULFILLED]=onFulfillment;subscribers[length+lib$es6$promise$$internal$$REJECTED]=onRejection;if(length===0&&parent._state){lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publish,parent)}}function lib$es6$promise$$internal$$publish(promise){var subscribers=promise._subscribers;var settled=promise._state;if(subscribers.length===0){return}var child,callback,detail=promise._result;for(var i=0;i<subscribers.length;i+=3){child=subscribers[i];callback=subscribers[i+settled];if(child){lib$es6$promise$$internal$$invokeCallback(settled,child,callback,detail)}else{callback(detail)}}promise._subscribers.length=0}function lib$es6$promise$$internal$$ErrorObject(){this.error=null}var lib$es6$promise$$internal$$TRY_CATCH_ERROR=new lib$es6$promise$$internal$$ErrorObject;function lib$es6$promise$$internal$$tryCatch(callback,detail){try{return callback(detail)}catch(e){lib$es6$promise$$internal$$TRY_CATCH_ERROR.error=e;return lib$es6$promise$$internal$$TRY_CATCH_ERROR}}function lib$es6$promise$$internal$$invokeCallback(settled,promise,callback,detail){var hasCallback=lib$es6$promise$utils$$isFunction(callback),value,error,succeeded,failed;if(hasCallback){value=lib$es6$promise$$internal$$tryCatch(callback,detail);if(value===lib$es6$promise$$internal$$TRY_CATCH_ERROR){failed=true;error=value.error;value=null}else{succeeded=true}if(promise===value){lib$es6$promise$$internal$$reject(promise,lib$es6$promise$$internal$$cannotReturnOwn());return}}else{value=detail;succeeded=true}if(promise._state!==lib$es6$promise$$internal$$PENDING){}else if(hasCallback&&succeeded){lib$es6$promise$$internal$$resolve(promise,value)}else if(failed){lib$es6$promise$$internal$$reject(promise,error)}else if(settled===lib$es6$promise$$internal$$FULFILLED){lib$es6$promise$$internal$$fulfill(promise,value)}else if(settled===lib$es6$promise$$internal$$REJECTED){lib$es6$promise$$internal$$reject(promise,value)}}function lib$es6$promise$$internal$$initializePromise(promise,resolver){try{resolver(function resolvePromise(value){lib$es6$promise$$internal$$resolve(promise,value)},function rejectPromise(reason){lib$es6$promise$$internal$$reject(promise,reason)})}catch(e){lib$es6$promise$$internal$$reject(promise,e)}}function lib$es6$promise$enumerator$$Enumerator(Constructor,input){var enumerator=this;enumerator._instanceConstructor=Constructor;enumerator.promise=new Constructor(lib$es6$promise$$internal$$noop);if(enumerator._validateInput(input)){enumerator._input=input;enumerator.length=input.length;enumerator._remaining=input.length;enumerator._init();if(enumerator.length===0){lib$es6$promise$$internal$$fulfill(enumerator.promise,enumerator._result)}else{enumerator.length=enumerator.length||0;enumerator._enumerate();if(enumerator._remaining===0){lib$es6$promise$$internal$$fulfill(enumerator.promise,enumerator._result)}}}else{lib$es6$promise$$internal$$reject(enumerator.promise,enumerator._validationError())}}lib$es6$promise$enumerator$$Enumerator.prototype._validateInput=function(input){return lib$es6$promise$utils$$isArray(input)};lib$es6$promise$enumerator$$Enumerator.prototype._validationError=function(){return new Error("Array Methods must be provided an Array")};lib$es6$promise$enumerator$$Enumerator.prototype._init=function(){this._result=new Array(this.length)};var lib$es6$promise$enumerator$$default=lib$es6$promise$enumerator$$Enumerator;lib$es6$promise$enumerator$$Enumerator.prototype._enumerate=function(){var enumerator=this;var length=enumerator.length;var promise=enumerator.promise;var input=enumerator._input;for(var i=0;promise._state===lib$es6$promise$$internal$$PENDING&&i<length;i++){enumerator._eachEntry(input[i],i)}};lib$es6$promise$enumerator$$Enumerator.prototype._eachEntry=function(entry,i){var enumerator=this;var c=enumerator._instanceConstructor;if(lib$es6$promise$utils$$isMaybeThenable(entry)){if(entry.constructor===c&&entry._state!==lib$es6$promise$$internal$$PENDING){entry._onerror=null;enumerator._settledAt(entry._state,i,entry._result)}else{enumerator._willSettleAt(c.resolve(entry),i)}}else{enumerator._remaining--;enumerator._result[i]=entry}};lib$es6$promise$enumerator$$Enumerator.prototype._settledAt=function(state,i,value){var enumerator=this;var promise=enumerator.promise;if(promise._state===lib$es6$promise$$internal$$PENDING){enumerator._remaining--;if(state===lib$es6$promise$$internal$$REJECTED){lib$es6$promise$$internal$$reject(promise,value)}else{enumerator._result[i]=value}}if(enumerator._remaining===0){lib$es6$promise$$internal$$fulfill(promise,enumerator._result)}};lib$es6$promise$enumerator$$Enumerator.prototype._willSettleAt=function(promise,i){var enumerator=this;lib$es6$promise$$internal$$subscribe(promise,undefined,function(value){enumerator._settledAt(lib$es6$promise$$internal$$FULFILLED,i,value)},function(reason){enumerator._settledAt(lib$es6$promise$$internal$$REJECTED,i,reason)})};function lib$es6$promise$promise$all$$all(entries){return new lib$es6$promise$enumerator$$default(this,entries).promise}var lib$es6$promise$promise$all$$default=lib$es6$promise$promise$all$$all;function lib$es6$promise$promise$race$$race(entries){var Constructor=this;var promise=new Constructor(lib$es6$promise$$internal$$noop);if(!lib$es6$promise$utils$$isArray(entries)){lib$es6$promise$$internal$$reject(promise,new TypeError("You must pass an array to race."));return promise}var length=entries.length;function onFulfillment(value){lib$es6$promise$$internal$$resolve(promise,value)}function onRejection(reason){lib$es6$promise$$internal$$reject(promise,reason)}for(var i=0;promise._state===lib$es6$promise$$internal$$PENDING&&i<length;i++){lib$es6$promise$$internal$$subscribe(Constructor.resolve(entries[i]),undefined,onFulfillment,onRejection)}return promise}var lib$es6$promise$promise$race$$default=lib$es6$promise$promise$race$$race;function lib$es6$promise$promise$resolve$$resolve(object){var Constructor=this;if(object&&typeof object==="object"&&object.constructor===Constructor){return object}var promise=new Constructor(lib$es6$promise$$internal$$noop);lib$es6$promise$$internal$$resolve(promise,object);return promise}var lib$es6$promise$promise$resolve$$default=lib$es6$promise$promise$resolve$$resolve;function lib$es6$promise$promise$reject$$reject(reason){var Constructor=this;var promise=new Constructor(lib$es6$promise$$internal$$noop);lib$es6$promise$$internal$$reject(promise,reason);return promise}var lib$es6$promise$promise$reject$$default=lib$es6$promise$promise$reject$$reject;var lib$es6$promise$promise$$counter=0;function lib$es6$promise$promise$$needsResolver(){throw new TypeError("You must pass a resolver function as the first argument to the promise constructor")}function lib$es6$promise$promise$$needsNew(){throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.")}var lib$es6$promise$promise$$default=lib$es6$promise$promise$$Promise;function lib$es6$promise$promise$$Promise(resolver){this._id=lib$es6$promise$promise$$counter++;this._state=undefined;this._result=undefined;this._subscribers=[];if(lib$es6$promise$$internal$$noop!==resolver){if(!lib$es6$promise$utils$$isFunction(resolver)){lib$es6$promise$promise$$needsResolver()}if(!(this instanceof lib$es6$promise$promise$$Promise)){lib$es6$promise$promise$$needsNew()}lib$es6$promise$$internal$$initializePromise(this,resolver)}}lib$es6$promise$promise$$Promise.all=lib$es6$promise$promise$all$$default;lib$es6$promise$promise$$Promise.race=lib$es6$promise$promise$race$$default;lib$es6$promise$promise$$Promise.resolve=lib$es6$promise$promise$resolve$$default;lib$es6$promise$promise$$Promise.reject=lib$es6$promise$promise$reject$$default;lib$es6$promise$promise$$Promise._setScheduler=lib$es6$promise$asap$$setScheduler;lib$es6$promise$promise$$Promise._setAsap=lib$es6$promise$asap$$setAsap;lib$es6$promise$promise$$Promise._asap=lib$es6$promise$asap$$asap;lib$es6$promise$promise$$Promise.prototype={constructor:lib$es6$promise$promise$$Promise,then:function(onFulfillment,onRejection){var parent=this;var state=parent._state;if(state===lib$es6$promise$$internal$$FULFILLED&&!onFulfillment||state===lib$es6$promise$$internal$$REJECTED&&!onRejection){return this}var child=new this.constructor(lib$es6$promise$$internal$$noop);var result=parent._result;if(state){var callback=arguments[state-1];lib$es6$promise$asap$$asap(function(){lib$es6$promise$$internal$$invokeCallback(state,child,callback,result)})}else{lib$es6$promise$$internal$$subscribe(parent,child,onFulfillment,onRejection)}return child},"catch":function(onRejection){return this.then(null,onRejection)}};function lib$es6$promise$polyfill$$polyfill(){var local;if(typeof global!=="undefined"){local=global}else if(typeof self!=="undefined"){local=self}else{try{local=Function("return this")()}catch(e){throw new Error("polyfill failed because global object is unavailable in this environment")}}var P=local.Promise;if(P&&Object.prototype.toString.call(P.resolve())==="[object Promise]"&&!P.cast){return}local.Promise=lib$es6$promise$promise$$default}var lib$es6$promise$polyfill$$default=lib$es6$promise$polyfill$$polyfill;var lib$es6$promise$umd$$ES6Promise={Promise:lib$es6$promise$promise$$default,polyfill:lib$es6$promise$polyfill$$default};if(typeof define==="function"&&define["amd"]){define(function(){return lib$es6$promise$umd$$ES6Promise})}else if(typeof module!=="undefined"&&module["exports"]){module["exports"]=lib$es6$promise$umd$$ES6Promise}else if(typeof this!=="undefined"){this["ES6Promise"]=lib$es6$promise$umd$$ES6Promise}lib$es6$promise$polyfill$$default()}).call(this);
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
            if(SPOC.Mock && SPOC.Mock.active) {
                url = SPOC.Utils.Url.getListNameFromUrl(url);
                var mockData = SPOC.Mock.db[url];
                if (mockData){
                    resolve(mockData);
                } else {
                    reject({"error": "no mock data found for the list - " + url});
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
SPOC.Utils.Request.post = function(url, data, isFile) {
    return new Promise(function(resolve, reject) {
            // Check if a Mock db has been set
            if(SPOC.Mock && SPOC.Mock.active){
                url = SPOC.Utils.Url.getListNameFromUrl(url);
                SPOC.Mock.db[url] = data;
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

            if(isFile){
                 req.setRequestHeader("content-length", data.byteLength);
            }

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
                req.send(isFile ? data : JSON.stringify(data));
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
           if(SPOC.Mock && SPOC.Mock.active){
                url = SPOC.Utils.Url.getListNameFromUrl(url);
                var mockData = SPOC.Mock.db[url];
                if (mockData){
                    SPOC.Mock.db[url] = data;
                    resolve(data);
                } else {
                    reject({"error": "no mock data found for the list - " + url});
                }
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

/**
 * Makes a put ajax requestio to a sharepoint url
 * @params  url url to retrieve
 * @params  data bool data to post
 * @return  javascript promise
 */
SPOC.Utils.Request.loadScript = function(url, success, failure) {
    var scriptPromise = new Promise(function(resolve, reject) {
            var script = document.createElement('script');
            script.src = url;

            script.addEventListener('load', function() {
                resolve(url);
            }, false);

            script.addEventListener('error', function() {
                reject(url);
            }, false);

        // Add it to the body
        document.body.appendChild(script);
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
 * Returns if current site is a app web.
 * @return  bool
 */
SPOC.Utils.SP.isAppWeb = function() {
    return window.location.href.toLowerCase().indexOf('sphosturl') > -1 ? true : false;
};

/**
 * Returns a web app url for a filepaths
 * @PARAMS string url
 * @return string
 */
SPOC.Utils.SP.convertToWebApp = function(url) {
    if (url.toLowerCase().indexOf('WopiFrame.aspx') > -1) {
        return url;
    } else {
        var ext = SPOC.Utils.Strings.getFileExtension(url);
        if (ext === 'docx' || ext === 'pptx' || ext === 'xlsx'){
            return site.url + '/_layouts/15/WopiFrame.aspx?sourcedoc=' + url;
        } else {
            return url;
        }
    }
};

/**
 * Converts search results objects to a more workable format
 * @params  array obj search results Object
 * @return  array
 */
SPOC.Utils.SP.formatSearchResponse = function(data) {
  var result = data.query.PrimaryQueryResult.RelevantResults.Table.Rows;
  var finalarray = [], item, obj, i, a;

      if(result.results){
        result = result.results;
      } else {
        result = [result];
      }

    for (i = 0; i < result.length; i++) { 
        item = result[i].Cells.results;
        obj = {};
        for (a = 0; a < item.length; a++) { 
            obj[item[a].Key] = item[a].Value;
        }
        finalarray.push(obj);
    }

    return finalarray;
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


/**
 * Returns the file extension from a string path
 * @return  STRING
 */
SPOC.Utils.Strings.getFileExtension = function(value) {
    return value.split('.').pop();
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

// SharePoint List Functionlity

SPOC.SP.Site.prototype.Delve = function(userEmail) {

    // save reference to this
    var site = this;

    // Create object to store public methods
    var methods = {};

    /**
     * Queries a SharePont list via REST API
     * @params  Object query filter paramators in obj format
     * @return  promise
     */
    methods.board = function(searchTerm, actions, forceNoCache) {
        return new Promise(function(resolve, reject) {
            var searchUrl, actor;

            if(!searchTerm){
                searchTerm = '*';
            }

            if (userEmail) {
                 searchUrl = site.url + "/_api/search/query?Querytext=%27WorkEmail:" + userEmail + "%27&SelectProperties=%27UserName,DocId%27";
                 
                 SPOC.Utils.Request.get(searchUrl, forceNoCache).then(function(result) {
                    result = SPOC.Utils.SP.formatSearchResponse(result);

                    if (result.length){
                        
                        if(result.length > 1){
                            result = result[0];
                        }

                        actor = result.DocId;
                        searchUrl = site.url + "/_api/search/query?Querytext='"+ searchTerm + "'&amp;Properties='GraphQuery:ACTOR("+ actor + actions ? (", " + actions) : "" + ")";

                        SPOC.Utils.Request.get(searchUrl, forceNoCache).then(function(board) {
                            board = SPOC.Utils.SP.formatSearchResponse(board);
                            resolve(board);
                        }, function(err){
                             reject(err);
                        });

                    } else {
                        resolve(null);
                    }
                    
                }, function (err){
                    reject(err);
                });
            } else {
                searchUrl = site.url + "/_api/search/query?Querytext='"+ searchTerm + "'&amp;Properties='GraphQuery:ACTOR(ME" + actions ? (", " + actions) : "" + ")";
                SPOC.Utils.Request.get(searchUrl, forceNoCache).then(function(board) {
                    board = SPOC.Utils.SP.formatSearchResponse(board);
                    resolve(board);
                }, function(err){
                     reject(err);
                });
            }

        });
          
    };

    return methods;
};
//var test = SPOC.Utils.Request.get('https://architect365.sharepoint.com//_api/search/query?querytext=%27sharepoint%27');

//https://architect365.sharepoint.com/_api/search/query?Querytext=%27WorkEmail:mpomeroy@architect365.co.uk%27&SelectProperties=%27UserName,DocId%27
// SharePoint List Functionlity

SPOC.SP.Site.prototype.Files = function(filePath) {

    // save reference to this
    var site = this;

    // Create object to store public methods
    var methods = {};

    // Add leading slash if not present.
    if(filePath.charAt(0) !== '/'){
        filePath = '/' + filePath;
    }

    /**
     * Generates a time based External Sharing link
     * @params  Object query filter paramators in obj format
     * @return  promise
     */
    methods.generateExternalLink = function(hours) {
        hours = hours ? hours : 24;
        var listUrl = site.url + "/_api/Web/GetFileByServerRelativeUrl('" + filePath + "')/GetPreAuthorizedAccessUrl("+ hours +")";
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
    methods.upload = function(fileInput) {
        return new Promise(function(resolve, reject) {
            var reader = new FileReader();

            reader.onloadend = function (e) {
                var parts = fileInput.value.split('\\');
                var fileName = parts[parts.length - 1];
                var url = site.url + "/_api/Web/GetFolderByServerRelativeUrl('" + filePath + "')/files/add(overwrite=true, url='"+ fileName +"')";
                SPOC.Utils.Request.post(url, e.target.result, true).then(function(result){
                    resolve(result);
                }, function(result){
                     reject(result);
                });
            };
            reader.onerror = function (e) {
                reject(e.target.error);
            };

            reader.readAsArrayBuffer(fileInput.files[0]);
        });
    };

    /**
     * Get file list item properties
     * @params bool forceNoCache
     * @return Promise
     */
    methods.query = function(forceNoCache) {
       var url = site.url + "/_api/web/getfilebyserverrelativeurl('" + filePath + "')/ListItemAllFields";
       return SPOC.Utils.Request.get(url, forceNoCache);
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
       if (newTab){
            window.open(SPOC.Utils.SP.convertToWebApp(url));
       } else {
         window.location.href = SPOC.Utils.SP.convertToWebApp(url);
       }
    };

    return methods;

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

        listUrl += settings ? '?' + SPOC.Utils.Conversion.objToQueryString(settings) : '';

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

SPOC.SP.Site.prototype.Search = function(searchTerm) {

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
        return new Promise(function(resolve, reject) {
            var searchUrl = site.url + '/_api/search/query?querytext=%27' + searchTerm + ' +path:' + site.url + '%27';
            searchUrl += settings ? '?' + SPOC.Utils.Conversion.objToQueryString(settings) : '';

            SPOC.Utils.Request.get(searchUrl, forceNoCache).then(function(result){
                result = SPOC.Utils.SP.formatSearchResponse(result);
                resolve(result);
            }, function (err){
                reject(err);
            });
        });
          
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
})(window, document, window.SPOC = window.SPOC || {});