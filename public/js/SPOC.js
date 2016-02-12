/*! SPOC 12-02-2016 */


/*!
 * @overview RSVP - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/tildeio/rsvp.js/master/LICENSE
 * @version   3.2.0
 */

(function(){"use strict";function lib$rsvp$utils$$objectOrFunction(x){return typeof x==="function"||typeof x==="object"&&x!==null}function lib$rsvp$utils$$isFunction(x){return typeof x==="function"}function lib$rsvp$utils$$isMaybeThenable(x){return typeof x==="object"&&x!==null}var lib$rsvp$utils$$_isArray;if(!Array.isArray){lib$rsvp$utils$$_isArray=function(x){return Object.prototype.toString.call(x)==="[object Array]"}}else{lib$rsvp$utils$$_isArray=Array.isArray}var lib$rsvp$utils$$isArray=lib$rsvp$utils$$_isArray;var lib$rsvp$utils$$now=Date.now||function(){return(new Date).getTime()};function lib$rsvp$utils$$F(){}var lib$rsvp$utils$$o_create=Object.create||function(o){if(arguments.length>1){throw new Error("Second argument not supported")}if(typeof o!=="object"){throw new TypeError("Argument must be an object")}lib$rsvp$utils$$F.prototype=o;return new lib$rsvp$utils$$F};function lib$rsvp$events$$indexOf(callbacks,callback){for(var i=0,l=callbacks.length;i<l;i++){if(callbacks[i]===callback){return i}}return-1}function lib$rsvp$events$$callbacksFor(object){var callbacks=object._promiseCallbacks;if(!callbacks){callbacks=object._promiseCallbacks={}}return callbacks}var lib$rsvp$events$$default={mixin:function(object){object["on"]=this["on"];object["off"]=this["off"];object["trigger"]=this["trigger"];object._promiseCallbacks=undefined;return object},on:function(eventName,callback){if(typeof callback!=="function"){throw new TypeError("Callback must be a function")}var allCallbacks=lib$rsvp$events$$callbacksFor(this),callbacks;callbacks=allCallbacks[eventName];if(!callbacks){callbacks=allCallbacks[eventName]=[]}if(lib$rsvp$events$$indexOf(callbacks,callback)===-1){callbacks.push(callback)}},off:function(eventName,callback){var allCallbacks=lib$rsvp$events$$callbacksFor(this),callbacks,index;if(!callback){allCallbacks[eventName]=[];return}callbacks=allCallbacks[eventName];index=lib$rsvp$events$$indexOf(callbacks,callback);if(index!==-1){callbacks.splice(index,1)}},trigger:function(eventName,options,label){var allCallbacks=lib$rsvp$events$$callbacksFor(this),callbacks,callback;if(callbacks=allCallbacks[eventName]){for(var i=0;i<callbacks.length;i++){callback=callbacks[i];callback(options,label)}}}};var lib$rsvp$config$$config={instrument:false};lib$rsvp$events$$default["mixin"](lib$rsvp$config$$config);function lib$rsvp$config$$configure(name,value){if(name==="onerror"){lib$rsvp$config$$config["on"]("error",value);return}if(arguments.length===2){lib$rsvp$config$$config[name]=value}else{return lib$rsvp$config$$config[name]}}var lib$rsvp$instrument$$queue=[];function lib$rsvp$instrument$$scheduleFlush(){setTimeout(function(){var entry;for(var i=0;i<lib$rsvp$instrument$$queue.length;i++){entry=lib$rsvp$instrument$$queue[i];var payload=entry.payload;payload.guid=payload.key+payload.id;payload.childGuid=payload.key+payload.childId;if(payload.error){payload.stack=payload.error.stack}lib$rsvp$config$$config["trigger"](entry.name,entry.payload)}lib$rsvp$instrument$$queue.length=0},50)}function lib$rsvp$instrument$$instrument(eventName,promise,child){if(1===lib$rsvp$instrument$$queue.push({name:eventName,payload:{key:promise._guidKey,id:promise._id,eventName:eventName,detail:promise._result,childId:child&&child._id,label:promise._label,timeStamp:lib$rsvp$utils$$now(),error:lib$rsvp$config$$config["instrument-with-stack"]?new Error(promise._label):null}})){lib$rsvp$instrument$$scheduleFlush()}}var lib$rsvp$instrument$$default=lib$rsvp$instrument$$instrument;function lib$rsvp$then$$then(onFulfillment,onRejection,label){var parent=this;var state=parent._state;if(state===lib$rsvp$$internal$$FULFILLED&&!onFulfillment||state===lib$rsvp$$internal$$REJECTED&&!onRejection){lib$rsvp$config$$config.instrument&&lib$rsvp$instrument$$default("chained",parent,parent);return parent}parent._onError=null;var child=new parent.constructor(lib$rsvp$$internal$$noop,label);var result=parent._result;lib$rsvp$config$$config.instrument&&lib$rsvp$instrument$$default("chained",parent,child);if(state){var callback=arguments[state-1];lib$rsvp$config$$config.async(function(){lib$rsvp$$internal$$invokeCallback(state,child,callback,result)})}else{lib$rsvp$$internal$$subscribe(parent,child,onFulfillment,onRejection)}return child}var lib$rsvp$then$$default=lib$rsvp$then$$then;function lib$rsvp$promise$resolve$$resolve(object,label){var Constructor=this;if(object&&typeof object==="object"&&object.constructor===Constructor){return object}var promise=new Constructor(lib$rsvp$$internal$$noop,label);lib$rsvp$$internal$$resolve(promise,object);return promise}var lib$rsvp$promise$resolve$$default=lib$rsvp$promise$resolve$$resolve;function lib$rsvp$enumerator$$makeSettledResult(state,position,value){if(state===lib$rsvp$$internal$$FULFILLED){return{state:"fulfilled",value:value}}else{return{state:"rejected",reason:value}}}function lib$rsvp$enumerator$$Enumerator(Constructor,input,abortOnReject,label){this._instanceConstructor=Constructor;this.promise=new Constructor(lib$rsvp$$internal$$noop,label);this._abortOnReject=abortOnReject;if(this._validateInput(input)){this._input=input;this.length=input.length;this._remaining=input.length;this._init();if(this.length===0){lib$rsvp$$internal$$fulfill(this.promise,this._result)}else{this.length=this.length||0;this._enumerate();if(this._remaining===0){lib$rsvp$$internal$$fulfill(this.promise,this._result)}}}else{lib$rsvp$$internal$$reject(this.promise,this._validationError())}}var lib$rsvp$enumerator$$default=lib$rsvp$enumerator$$Enumerator;lib$rsvp$enumerator$$Enumerator.prototype._validateInput=function(input){return lib$rsvp$utils$$isArray(input)};lib$rsvp$enumerator$$Enumerator.prototype._validationError=function(){return new Error("Array Methods must be provided an Array")};lib$rsvp$enumerator$$Enumerator.prototype._init=function(){this._result=new Array(this.length)};lib$rsvp$enumerator$$Enumerator.prototype._enumerate=function(){var length=this.length;var promise=this.promise;var input=this._input;for(var i=0;promise._state===lib$rsvp$$internal$$PENDING&&i<length;i++){this._eachEntry(input[i],i)}};lib$rsvp$enumerator$$Enumerator.prototype._settleMaybeThenable=function(entry,i){var c=this._instanceConstructor;var resolve=c.resolve;if(resolve===lib$rsvp$promise$resolve$$default){var then=lib$rsvp$$internal$$getThen(entry);if(then===lib$rsvp$then$$default&&entry._state!==lib$rsvp$$internal$$PENDING){entry._onError=null;this._settledAt(entry._state,i,entry._result)}else if(typeof then!=="function"){this._remaining--;this._result[i]=this._makeResult(lib$rsvp$$internal$$FULFILLED,i,entry)}else if(c===lib$rsvp$promise$$default){var promise=new c(lib$rsvp$$internal$$noop);lib$rsvp$$internal$$handleMaybeThenable(promise,entry,then);this._willSettleAt(promise,i)}else{this._willSettleAt(new c(function(resolve){resolve(entry)}),i)}}else{this._willSettleAt(resolve(entry),i)}};lib$rsvp$enumerator$$Enumerator.prototype._eachEntry=function(entry,i){if(lib$rsvp$utils$$isMaybeThenable(entry)){this._settleMaybeThenable(entry,i)}else{this._remaining--;this._result[i]=this._makeResult(lib$rsvp$$internal$$FULFILLED,i,entry)}};lib$rsvp$enumerator$$Enumerator.prototype._settledAt=function(state,i,value){var promise=this.promise;if(promise._state===lib$rsvp$$internal$$PENDING){this._remaining--;if(this._abortOnReject&&state===lib$rsvp$$internal$$REJECTED){lib$rsvp$$internal$$reject(promise,value)}else{this._result[i]=this._makeResult(state,i,value)}}if(this._remaining===0){lib$rsvp$$internal$$fulfill(promise,this._result)}};lib$rsvp$enumerator$$Enumerator.prototype._makeResult=function(state,i,value){return value};lib$rsvp$enumerator$$Enumerator.prototype._willSettleAt=function(promise,i){var enumerator=this;lib$rsvp$$internal$$subscribe(promise,undefined,function(value){enumerator._settledAt(lib$rsvp$$internal$$FULFILLED,i,value)},function(reason){enumerator._settledAt(lib$rsvp$$internal$$REJECTED,i,reason)})};function lib$rsvp$promise$all$$all(entries,label){return new lib$rsvp$enumerator$$default(this,entries,true,label).promise}var lib$rsvp$promise$all$$default=lib$rsvp$promise$all$$all;function lib$rsvp$promise$race$$race(entries,label){var Constructor=this;var promise=new Constructor(lib$rsvp$$internal$$noop,label);if(!lib$rsvp$utils$$isArray(entries)){lib$rsvp$$internal$$reject(promise,new TypeError("You must pass an array to race."));return promise}var length=entries.length;function onFulfillment(value){lib$rsvp$$internal$$resolve(promise,value)}function onRejection(reason){lib$rsvp$$internal$$reject(promise,reason)}for(var i=0;promise._state===lib$rsvp$$internal$$PENDING&&i<length;i++){lib$rsvp$$internal$$subscribe(Constructor.resolve(entries[i]),undefined,onFulfillment,onRejection)}return promise}var lib$rsvp$promise$race$$default=lib$rsvp$promise$race$$race;function lib$rsvp$promise$reject$$reject(reason,label){var Constructor=this;var promise=new Constructor(lib$rsvp$$internal$$noop,label);lib$rsvp$$internal$$reject(promise,reason);return promise}var lib$rsvp$promise$reject$$default=lib$rsvp$promise$reject$$reject;var lib$rsvp$promise$$guidKey="rsvp_"+lib$rsvp$utils$$now()+"-";var lib$rsvp$promise$$counter=0;function lib$rsvp$promise$$needsResolver(){throw new TypeError("You must pass a resolver function as the first argument to the promise constructor")}function lib$rsvp$promise$$needsNew(){throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.")}function lib$rsvp$promise$$Promise(resolver,label){this._id=lib$rsvp$promise$$counter++;this._label=label;this._state=undefined;this._result=undefined;this._subscribers=[];lib$rsvp$config$$config.instrument&&lib$rsvp$instrument$$default("created",this);if(lib$rsvp$$internal$$noop!==resolver){typeof resolver!=="function"&&lib$rsvp$promise$$needsResolver();this instanceof lib$rsvp$promise$$Promise?lib$rsvp$$internal$$initializePromise(this,resolver):lib$rsvp$promise$$needsNew()}}var lib$rsvp$promise$$default=lib$rsvp$promise$$Promise;lib$rsvp$promise$$Promise.cast=lib$rsvp$promise$resolve$$default;lib$rsvp$promise$$Promise.all=lib$rsvp$promise$all$$default;lib$rsvp$promise$$Promise.race=lib$rsvp$promise$race$$default;lib$rsvp$promise$$Promise.resolve=lib$rsvp$promise$resolve$$default;lib$rsvp$promise$$Promise.reject=lib$rsvp$promise$reject$$default;lib$rsvp$promise$$Promise.prototype={constructor:lib$rsvp$promise$$Promise,_guidKey:lib$rsvp$promise$$guidKey,_onError:function(reason){var promise=this;lib$rsvp$config$$config.after(function(){if(promise._onError){lib$rsvp$config$$config["trigger"]("error",reason,promise._label)}})},then:lib$rsvp$then$$default,"catch":function(onRejection,label){return this.then(undefined,onRejection,label)},"finally":function(callback,label){var promise=this;var constructor=promise.constructor;return promise.then(function(value){return constructor.resolve(callback()).then(function(){return value})},function(reason){return constructor.resolve(callback()).then(function(){return constructor.reject(reason)})},label)}};function lib$rsvp$$internal$$withOwnPromise(){return new TypeError("A promises callback cannot return that same promise.")}function lib$rsvp$$internal$$noop(){}var lib$rsvp$$internal$$PENDING=void 0;var lib$rsvp$$internal$$FULFILLED=1;var lib$rsvp$$internal$$REJECTED=2;var lib$rsvp$$internal$$GET_THEN_ERROR=new lib$rsvp$$internal$$ErrorObject;function lib$rsvp$$internal$$getThen(promise){try{return promise.then}catch(error){lib$rsvp$$internal$$GET_THEN_ERROR.error=error;return lib$rsvp$$internal$$GET_THEN_ERROR}}function lib$rsvp$$internal$$tryThen(then,value,fulfillmentHandler,rejectionHandler){try{then.call(value,fulfillmentHandler,rejectionHandler)}catch(e){return e}}function lib$rsvp$$internal$$handleForeignThenable(promise,thenable,then){lib$rsvp$config$$config.async(function(promise){var sealed=false;var error=lib$rsvp$$internal$$tryThen(then,thenable,function(value){if(sealed){return}sealed=true;if(thenable!==value){lib$rsvp$$internal$$resolve(promise,value,undefined)}else{lib$rsvp$$internal$$fulfill(promise,value)}},function(reason){if(sealed){return}sealed=true;lib$rsvp$$internal$$reject(promise,reason)},"Settle: "+(promise._label||" unknown promise"));if(!sealed&&error){sealed=true;lib$rsvp$$internal$$reject(promise,error)}},promise)}function lib$rsvp$$internal$$handleOwnThenable(promise,thenable){if(thenable._state===lib$rsvp$$internal$$FULFILLED){lib$rsvp$$internal$$fulfill(promise,thenable._result)}else if(thenable._state===lib$rsvp$$internal$$REJECTED){thenable._onError=null;lib$rsvp$$internal$$reject(promise,thenable._result)}else{lib$rsvp$$internal$$subscribe(thenable,undefined,function(value){if(thenable!==value){lib$rsvp$$internal$$resolve(promise,value,undefined)}else{lib$rsvp$$internal$$fulfill(promise,value)}},function(reason){lib$rsvp$$internal$$reject(promise,reason)})}}function lib$rsvp$$internal$$handleMaybeThenable(promise,maybeThenable,then){if(maybeThenable.constructor===promise.constructor&&then===lib$rsvp$then$$default&&constructor.resolve===lib$rsvp$promise$resolve$$default){lib$rsvp$$internal$$handleOwnThenable(promise,maybeThenable)}else{if(then===lib$rsvp$$internal$$GET_THEN_ERROR){lib$rsvp$$internal$$reject(promise,lib$rsvp$$internal$$GET_THEN_ERROR.error)}else if(then===undefined){lib$rsvp$$internal$$fulfill(promise,maybeThenable)}else if(lib$rsvp$utils$$isFunction(then)){lib$rsvp$$internal$$handleForeignThenable(promise,maybeThenable,then)}else{lib$rsvp$$internal$$fulfill(promise,maybeThenable)}}}function lib$rsvp$$internal$$resolve(promise,value){if(promise===value){lib$rsvp$$internal$$fulfill(promise,value)}else if(lib$rsvp$utils$$objectOrFunction(value)){lib$rsvp$$internal$$handleMaybeThenable(promise,value,lib$rsvp$$internal$$getThen(value))}else{lib$rsvp$$internal$$fulfill(promise,value)}}function lib$rsvp$$internal$$publishRejection(promise){if(promise._onError){promise._onError(promise._result)}lib$rsvp$$internal$$publish(promise)}function lib$rsvp$$internal$$fulfill(promise,value){if(promise._state!==lib$rsvp$$internal$$PENDING){return}promise._result=value;promise._state=lib$rsvp$$internal$$FULFILLED;if(promise._subscribers.length===0){if(lib$rsvp$config$$config.instrument){lib$rsvp$instrument$$default("fulfilled",promise)}}else{lib$rsvp$config$$config.async(lib$rsvp$$internal$$publish,promise)}}function lib$rsvp$$internal$$reject(promise,reason){if(promise._state!==lib$rsvp$$internal$$PENDING){return}promise._state=lib$rsvp$$internal$$REJECTED;promise._result=reason;lib$rsvp$config$$config.async(lib$rsvp$$internal$$publishRejection,promise)}function lib$rsvp$$internal$$subscribe(parent,child,onFulfillment,onRejection){var subscribers=parent._subscribers;var length=subscribers.length;parent._onError=null;subscribers[length]=child;subscribers[length+lib$rsvp$$internal$$FULFILLED]=onFulfillment;subscribers[length+lib$rsvp$$internal$$REJECTED]=onRejection;if(length===0&&parent._state){lib$rsvp$config$$config.async(lib$rsvp$$internal$$publish,parent)}}function lib$rsvp$$internal$$publish(promise){var subscribers=promise._subscribers;var settled=promise._state;if(lib$rsvp$config$$config.instrument){lib$rsvp$instrument$$default(settled===lib$rsvp$$internal$$FULFILLED?"fulfilled":"rejected",promise)}if(subscribers.length===0){return}var child,callback,detail=promise._result;for(var i=0;i<subscribers.length;i+=3){child=subscribers[i];callback=subscribers[i+settled];if(child){lib$rsvp$$internal$$invokeCallback(settled,child,callback,detail)}else{callback(detail)}}promise._subscribers.length=0}function lib$rsvp$$internal$$ErrorObject(){this.error=null}var lib$rsvp$$internal$$TRY_CATCH_ERROR=new lib$rsvp$$internal$$ErrorObject;function lib$rsvp$$internal$$tryCatch(callback,detail){try{return callback(detail)}catch(e){lib$rsvp$$internal$$TRY_CATCH_ERROR.error=e;return lib$rsvp$$internal$$TRY_CATCH_ERROR}}function lib$rsvp$$internal$$invokeCallback(settled,promise,callback,detail){var hasCallback=lib$rsvp$utils$$isFunction(callback),value,error,succeeded,failed;if(hasCallback){value=lib$rsvp$$internal$$tryCatch(callback,detail);if(value===lib$rsvp$$internal$$TRY_CATCH_ERROR){failed=true;error=value.error;value=null}else{succeeded=true}if(promise===value){lib$rsvp$$internal$$reject(promise,lib$rsvp$$internal$$withOwnPromise());return}}else{value=detail;succeeded=true}if(promise._state!==lib$rsvp$$internal$$PENDING){}else if(hasCallback&&succeeded){lib$rsvp$$internal$$resolve(promise,value)}else if(failed){lib$rsvp$$internal$$reject(promise,error)}else if(settled===lib$rsvp$$internal$$FULFILLED){lib$rsvp$$internal$$fulfill(promise,value)}else if(settled===lib$rsvp$$internal$$REJECTED){lib$rsvp$$internal$$reject(promise,value)}}function lib$rsvp$$internal$$initializePromise(promise,resolver){var resolved=false;try{resolver(function resolvePromise(value){if(resolved){return}resolved=true;lib$rsvp$$internal$$resolve(promise,value)},function rejectPromise(reason){if(resolved){return}resolved=true;lib$rsvp$$internal$$reject(promise,reason)})}catch(e){lib$rsvp$$internal$$reject(promise,e)}}function lib$rsvp$all$settled$$AllSettled(Constructor,entries,label){this._superConstructor(Constructor,entries,false,label)}lib$rsvp$all$settled$$AllSettled.prototype=lib$rsvp$utils$$o_create(lib$rsvp$enumerator$$default.prototype);lib$rsvp$all$settled$$AllSettled.prototype._superConstructor=lib$rsvp$enumerator$$default;lib$rsvp$all$settled$$AllSettled.prototype._makeResult=lib$rsvp$enumerator$$makeSettledResult;lib$rsvp$all$settled$$AllSettled.prototype._validationError=function(){return new Error("allSettled must be called with an array")};function lib$rsvp$all$settled$$allSettled(entries,label){return new lib$rsvp$all$settled$$AllSettled(lib$rsvp$promise$$default,entries,label).promise}var lib$rsvp$all$settled$$default=lib$rsvp$all$settled$$allSettled;function lib$rsvp$all$$all(array,label){return lib$rsvp$promise$$default.all(array,label)}var lib$rsvp$all$$default=lib$rsvp$all$$all;var lib$rsvp$asap$$len=0;var lib$rsvp$asap$$toString={}.toString;var lib$rsvp$asap$$vertxNext;function lib$rsvp$asap$$asap(callback,arg){lib$rsvp$asap$$queue[lib$rsvp$asap$$len]=callback;lib$rsvp$asap$$queue[lib$rsvp$asap$$len+1]=arg;lib$rsvp$asap$$len+=2;if(lib$rsvp$asap$$len===2){lib$rsvp$asap$$scheduleFlush()}}var lib$rsvp$asap$$default=lib$rsvp$asap$$asap;var lib$rsvp$asap$$browserWindow=typeof window!=="undefined"?window:undefined;var lib$rsvp$asap$$browserGlobal=lib$rsvp$asap$$browserWindow||{};var lib$rsvp$asap$$BrowserMutationObserver=lib$rsvp$asap$$browserGlobal.MutationObserver||lib$rsvp$asap$$browserGlobal.WebKitMutationObserver;var lib$rsvp$asap$$isNode=typeof self==="undefined"&&typeof process!=="undefined"&&{}.toString.call(process)==="[object process]";var lib$rsvp$asap$$isWorker=typeof Uint8ClampedArray!=="undefined"&&typeof importScripts!=="undefined"&&typeof MessageChannel!=="undefined";function lib$rsvp$asap$$useNextTick(){var nextTick=process.nextTick;var version=process.versions.node.match(/^(?:(\d+)\.)?(?:(\d+)\.)?(\*|\d+)$/);if(Array.isArray(version)&&version[1]==="0"&&version[2]==="10"){nextTick=setImmediate}return function(){nextTick(lib$rsvp$asap$$flush)}}function lib$rsvp$asap$$useVertxTimer(){return function(){lib$rsvp$asap$$vertxNext(lib$rsvp$asap$$flush)}}function lib$rsvp$asap$$useMutationObserver(){var iterations=0;var observer=new lib$rsvp$asap$$BrowserMutationObserver(lib$rsvp$asap$$flush);var node=document.createTextNode("");observer.observe(node,{characterData:true});return function(){node.data=iterations=++iterations%2}}function lib$rsvp$asap$$useMessageChannel(){var channel=new MessageChannel;channel.port1.onmessage=lib$rsvp$asap$$flush;return function(){channel.port2.postMessage(0)}}function lib$rsvp$asap$$useSetTimeout(){return function(){setTimeout(lib$rsvp$asap$$flush,1)}}var lib$rsvp$asap$$queue=new Array(1e3);function lib$rsvp$asap$$flush(){for(var i=0;i<lib$rsvp$asap$$len;i+=2){var callback=lib$rsvp$asap$$queue[i];var arg=lib$rsvp$asap$$queue[i+1];callback(arg);lib$rsvp$asap$$queue[i]=undefined;lib$rsvp$asap$$queue[i+1]=undefined}lib$rsvp$asap$$len=0}function lib$rsvp$asap$$attemptVertex(){try{var r=require;var vertx=r("vertx");lib$rsvp$asap$$vertxNext=vertx.runOnLoop||vertx.runOnContext;return lib$rsvp$asap$$useVertxTimer()}catch(e){return lib$rsvp$asap$$useSetTimeout()}}var lib$rsvp$asap$$scheduleFlush;if(lib$rsvp$asap$$isNode){lib$rsvp$asap$$scheduleFlush=lib$rsvp$asap$$useNextTick()}else if(lib$rsvp$asap$$BrowserMutationObserver){lib$rsvp$asap$$scheduleFlush=lib$rsvp$asap$$useMutationObserver()}else if(lib$rsvp$asap$$isWorker){lib$rsvp$asap$$scheduleFlush=lib$rsvp$asap$$useMessageChannel()}else if(lib$rsvp$asap$$browserWindow===undefined&&typeof require==="function"){lib$rsvp$asap$$scheduleFlush=lib$rsvp$asap$$attemptVertex()}else{lib$rsvp$asap$$scheduleFlush=lib$rsvp$asap$$useSetTimeout()}function lib$rsvp$defer$$defer(label){var deferred={};deferred["promise"]=new lib$rsvp$promise$$default(function(resolve,reject){deferred["resolve"]=resolve;deferred["reject"]=reject},label);return deferred}var lib$rsvp$defer$$default=lib$rsvp$defer$$defer;function lib$rsvp$filter$$filter(promises,filterFn,label){return lib$rsvp$promise$$default.all(promises,label).then(function(values){if(!lib$rsvp$utils$$isFunction(filterFn)){throw new TypeError("You must pass a function as filter's second argument.")}var length=values.length;var filtered=new Array(length);for(var i=0;i<length;i++){filtered[i]=filterFn(values[i])}return lib$rsvp$promise$$default.all(filtered,label).then(function(filtered){var results=new Array(length);var newLength=0;for(var i=0;i<length;i++){if(filtered[i]){results[newLength]=values[i];newLength++}}results.length=newLength;return results})})}var lib$rsvp$filter$$default=lib$rsvp$filter$$filter;function lib$rsvp$promise$hash$$PromiseHash(Constructor,object,label){this._superConstructor(Constructor,object,true,label)}var lib$rsvp$promise$hash$$default=lib$rsvp$promise$hash$$PromiseHash;lib$rsvp$promise$hash$$PromiseHash.prototype=lib$rsvp$utils$$o_create(lib$rsvp$enumerator$$default.prototype);lib$rsvp$promise$hash$$PromiseHash.prototype._superConstructor=lib$rsvp$enumerator$$default;lib$rsvp$promise$hash$$PromiseHash.prototype._init=function(){this._result={}};lib$rsvp$promise$hash$$PromiseHash.prototype._validateInput=function(input){return input&&typeof input==="object"};lib$rsvp$promise$hash$$PromiseHash.prototype._validationError=function(){return new Error("Promise.hash must be called with an object")};lib$rsvp$promise$hash$$PromiseHash.prototype._enumerate=function(){var enumerator=this;var promise=enumerator.promise;var input=enumerator._input;var results=[];for(var key in input){if(promise._state===lib$rsvp$$internal$$PENDING&&Object.prototype.hasOwnProperty.call(input,key)){results.push({position:key,entry:input[key]})}}var length=results.length;enumerator._remaining=length;var result;for(var i=0;promise._state===lib$rsvp$$internal$$PENDING&&i<length;i++){result=results[i];enumerator._eachEntry(result.entry,result.position)}};function lib$rsvp$hash$settled$$HashSettled(Constructor,object,label){this._superConstructor(Constructor,object,false,label)}lib$rsvp$hash$settled$$HashSettled.prototype=lib$rsvp$utils$$o_create(lib$rsvp$promise$hash$$default.prototype);lib$rsvp$hash$settled$$HashSettled.prototype._superConstructor=lib$rsvp$enumerator$$default;lib$rsvp$hash$settled$$HashSettled.prototype._makeResult=lib$rsvp$enumerator$$makeSettledResult;lib$rsvp$hash$settled$$HashSettled.prototype._validationError=function(){return new Error("hashSettled must be called with an object")};function lib$rsvp$hash$settled$$hashSettled(object,label){return new lib$rsvp$hash$settled$$HashSettled(lib$rsvp$promise$$default,object,label).promise}var lib$rsvp$hash$settled$$default=lib$rsvp$hash$settled$$hashSettled;function lib$rsvp$hash$$hash(object,label){return new lib$rsvp$promise$hash$$default(lib$rsvp$promise$$default,object,label).promise}var lib$rsvp$hash$$default=lib$rsvp$hash$$hash;function lib$rsvp$map$$map(promises,mapFn,label){return lib$rsvp$promise$$default.all(promises,label).then(function(values){if(!lib$rsvp$utils$$isFunction(mapFn)){throw new TypeError("You must pass a function as map's second argument.")}var length=values.length;var results=new Array(length);for(var i=0;i<length;i++){results[i]=mapFn(values[i])}return lib$rsvp$promise$$default.all(results,label)})}var lib$rsvp$map$$default=lib$rsvp$map$$map;function lib$rsvp$node$$Result(){this.value=undefined}var lib$rsvp$node$$ERROR=new lib$rsvp$node$$Result;var lib$rsvp$node$$GET_THEN_ERROR=new lib$rsvp$node$$Result;function lib$rsvp$node$$getThen(obj){try{return obj.then}catch(error){lib$rsvp$node$$ERROR.value=error;return lib$rsvp$node$$ERROR}}function lib$rsvp$node$$tryApply(f,s,a){try{f.apply(s,a)}catch(error){lib$rsvp$node$$ERROR.value=error;return lib$rsvp$node$$ERROR}}function lib$rsvp$node$$makeObject(_,argumentNames){var obj={};var name;var i;var length=_.length;var args=new Array(length);for(var x=0;x<length;x++){args[x]=_[x]}for(i=0;i<argumentNames.length;i++){name=argumentNames[i];obj[name]=args[i+1]}return obj}function lib$rsvp$node$$arrayResult(_){var length=_.length;var args=new Array(length-1);for(var i=1;i<length;i++){args[i-1]=_[i]}return args}function lib$rsvp$node$$wrapThenable(then,promise){return{then:function(onFulFillment,onRejection){return then.call(promise,onFulFillment,onRejection)}}}function lib$rsvp$node$$denodeify(nodeFunc,options){var fn=function(){var self=this;var l=arguments.length;var args=new Array(l+1);var arg;var promiseInput=false;for(var i=0;i<l;++i){arg=arguments[i];if(!promiseInput){promiseInput=lib$rsvp$node$$needsPromiseInput(arg);if(promiseInput===lib$rsvp$node$$GET_THEN_ERROR){var p=new lib$rsvp$promise$$default(lib$rsvp$$internal$$noop);lib$rsvp$$internal$$reject(p,lib$rsvp$node$$GET_THEN_ERROR.value);return p}else if(promiseInput&&promiseInput!==true){arg=lib$rsvp$node$$wrapThenable(promiseInput,arg)}}args[i]=arg}var promise=new lib$rsvp$promise$$default(lib$rsvp$$internal$$noop);args[l]=function(err,val){if(err)lib$rsvp$$internal$$reject(promise,err);else if(options===undefined)lib$rsvp$$internal$$resolve(promise,val);else if(options===true)lib$rsvp$$internal$$resolve(promise,lib$rsvp$node$$arrayResult(arguments));else if(lib$rsvp$utils$$isArray(options))lib$rsvp$$internal$$resolve(promise,lib$rsvp$node$$makeObject(arguments,options));else lib$rsvp$$internal$$resolve(promise,val)};if(promiseInput){return lib$rsvp$node$$handlePromiseInput(promise,args,nodeFunc,self)}else{return lib$rsvp$node$$handleValueInput(promise,args,nodeFunc,self)}};fn.__proto__=nodeFunc;return fn}var lib$rsvp$node$$default=lib$rsvp$node$$denodeify;function lib$rsvp$node$$handleValueInput(promise,args,nodeFunc,self){var result=lib$rsvp$node$$tryApply(nodeFunc,self,args);if(result===lib$rsvp$node$$ERROR){lib$rsvp$$internal$$reject(promise,result.value)}return promise}function lib$rsvp$node$$handlePromiseInput(promise,args,nodeFunc,self){return lib$rsvp$promise$$default.all(args).then(function(args){var result=lib$rsvp$node$$tryApply(nodeFunc,self,args);if(result===lib$rsvp$node$$ERROR){lib$rsvp$$internal$$reject(promise,result.value)}return promise})}function lib$rsvp$node$$needsPromiseInput(arg){if(arg&&typeof arg==="object"){if(arg.constructor===lib$rsvp$promise$$default){return true}else{return lib$rsvp$node$$getThen(arg)}}else{return false}}var lib$rsvp$platform$$platform;if(typeof self==="object"){lib$rsvp$platform$$platform=self}else if(typeof global==="object"){lib$rsvp$platform$$platform=global}else{throw new Error("no global: `self` or `global` found")}var lib$rsvp$platform$$default=lib$rsvp$platform$$platform;function lib$rsvp$race$$race(array,label){return lib$rsvp$promise$$default.race(array,label)}var lib$rsvp$race$$default=lib$rsvp$race$$race;function lib$rsvp$reject$$reject(reason,label){return lib$rsvp$promise$$default.reject(reason,label)}var lib$rsvp$reject$$default=lib$rsvp$reject$$reject;function lib$rsvp$resolve$$resolve(value,label){return lib$rsvp$promise$$default.resolve(value,label)}var lib$rsvp$resolve$$default=lib$rsvp$resolve$$resolve;function lib$rsvp$rethrow$$rethrow(reason){setTimeout(function(){throw reason});throw reason}var lib$rsvp$rethrow$$default=lib$rsvp$rethrow$$rethrow;lib$rsvp$config$$config.async=lib$rsvp$asap$$default;lib$rsvp$config$$config.after=function(cb){setTimeout(cb,0)};var lib$rsvp$$cast=lib$rsvp$resolve$$default;function lib$rsvp$$async(callback,arg){lib$rsvp$config$$config.async(callback,arg)}function lib$rsvp$$on(){lib$rsvp$config$$config["on"].apply(lib$rsvp$config$$config,arguments)}function lib$rsvp$$off(){lib$rsvp$config$$config["off"].apply(lib$rsvp$config$$config,arguments)}if(typeof window!=="undefined"&&typeof window["__PROMISE_INSTRUMENTATION__"]==="object"){var lib$rsvp$$callbacks=window["__PROMISE_INSTRUMENTATION__"];lib$rsvp$config$$configure("instrument",true);for(var lib$rsvp$$eventName in lib$rsvp$$callbacks){if(lib$rsvp$$callbacks.hasOwnProperty(lib$rsvp$$eventName)){lib$rsvp$$on(lib$rsvp$$eventName,lib$rsvp$$callbacks[lib$rsvp$$eventName])}}}var lib$rsvp$umd$$RSVP={race:lib$rsvp$race$$default,Promise:lib$rsvp$promise$$default,allSettled:lib$rsvp$all$settled$$default,hash:lib$rsvp$hash$$default,hashSettled:lib$rsvp$hash$settled$$default,denodeify:lib$rsvp$node$$default,on:lib$rsvp$$on,off:lib$rsvp$$off,map:lib$rsvp$map$$default,filter:lib$rsvp$filter$$default,resolve:lib$rsvp$resolve$$default,reject:lib$rsvp$reject$$default,all:lib$rsvp$all$$default,rethrow:lib$rsvp$rethrow$$default,defer:lib$rsvp$defer$$default,EventTarget:lib$rsvp$events$$default,configure:lib$rsvp$config$$configure,async:lib$rsvp$$async};if(typeof define==="function"&&define["amd"]){define(function(){return lib$rsvp$umd$$RSVP})}else if(typeof module!=="undefined"&&module["exports"]){module["exports"]=lib$rsvp$umd$$RSVP}else if(typeof lib$rsvp$platform$$default!=="undefined"){lib$rsvp$platform$$default["RSVP"]=lib$rsvp$umd$$RSVP}}).call(this);

/**
 * Version: 0.0.1
 * Copyright (c) 2015-2015, Architect 365 (https://www.architect365.co.uk). All rights reserved.
 * License: Licensed under The MIT License. See license.txt and http://www.datejs.com/license/.
 * Website: https://www.architect365.co.uk
 */


(function(window, document, SPOC, undefined) {
        'use strict';

        // Promoise polyfill
 		window.Promise = window.Promise ? window.Promise : RSVP.Promise;

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
        str += '&$' + propertyName + '=' + obj[propertyName];
    }

    return str;
};

/**
 * Converts a column name to the internal REST safe version
 * @params  string to convert
 * @return  string
 */
SPOC.Utils.Conversion.spInternalName = function(string) {
    return str.replace(/ /g, '_x0020_');
};

SPOC.Mock = {
    active: false,
    db: {}
};


// If offline, set spPageContextInfo
if (!window._spPageContextInfo) {

    var AppWebUrl = SPOC.Utils.Url.AppWebUrl();

    window._spPageContextInfo = {
        userId: 1,
        userLoginName: 'test',
        webAbsoluteUrl: (AppWebUrl ? AppWebUrl : 'local')
    };

    if (!AppWebUrl) {
        SPOC.Mock.active = true;
    }
}


/**
 * Creates dummy text using lorem ipsum
 * @params  int count  number of words
 * @params  bool isDocument add document extension
 * @return  string seperator to use between words
 */
SPOC.Mock.dummyText = function(count, isDocument, seperator) {
    var loremIpsumWordBank = new Array("lorem", "ipsum", "dolor", "sit", "amet,", "consectetur", "adipisicing", "elit,", "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua.", "enim", "ad", "minim", "veniam,", "quis", "nostrud", "exercitation", "ullamco", "laboris", "nisi", "ut", "aliquip", "ex", "ea", "commodo", "consequat.", "duis", "aute", "irure", "dolor", "in", "reprehenderit", "in", "voluptate", "velit", "esse", "cillum", "dolore", "eu", "fugiat", "nulla", "pariatur.", "excepteur", "sint", "occaecat", "cupidatat", "non", "proident,", "sunt", "in", "culpa", "qui", "officia", "deserunt", "mollit", "anim", "id", "est", "laborum.", "sed", "ut", "perspiciatis,", "unde", "omnis", "iste", "natus", "error", "sit", "voluptatem", "accusantium", "doloremque", "laudantium,", "totam", "rem", "aperiam", "eaque", "ipsa,", "quae", "ab", "illo", "inventore", "veritatis", "et", "quasi", "architecto", "beatae", "vitae", "dicta", "sunt,", "explicabo.", "nemo", "enim", "ipsam", "voluptatem,", "quia", "voluptas", "sit,", "aspernatur", "aut", "odit", "aut", "fugit,", "sed", "quia", "consequuntur", "magni", "dolores", "eos,", "qui", "ratione", "voluptatem", "sequi", "nesciunt,", "neque", "porro", "quisquam", "est,", "qui", "dolorem", "ipsum,", "quia", "dolor", "sit,", "amet,", "consectetur,", "adipisci", "velit,", "sed", "quia", "non", "numquam", "eius", "modi", "tempora", "incidunt,", "ut", "labore", "et", "dolore", "magnam", "aliquam", "quaerat", "voluptatem.", "ut", "enim", "ad", "minima", "veniam,", "quis", "nostrum", "exercitationem", "ullam", "corporis", "suscipit", "laboriosam,", "nisi", "ut", "aliquid", "ex", "ea", "commodi", "consequatur?", "quis", "autem", "vel", "eum", "iure", "reprehenderit,", "qui", "in", "ea", "voluptate", "velit", "esse,", "quam", "nihil", "molestiae", "consequatur,", "vel", "illum,", "qui", "dolorem", "eum", "fugiat,", "quo", "voluptas", "nulla", "pariatur?", "at", "vero", "eos", "et", "accusamus", "et", "iusto", "odio", "dignissimos", "ducimus,", "qui", "blanditiis", "praesentium", "voluptatum", "deleniti", "atque", "corrupti,", "quos", "dolores", "et", "quas", "molestias", "excepturi", "sint,", "obcaecati", "cupiditate", "non", "provident,", "similique", "sunt", "in", "culpa,", "qui", "officia", "deserunt", "mollitia", "animi,", "id", "est", "laborum", "et", "dolorum", "fuga.", "harum", "quidem", "rerum", "facilis", "est", "et", "expedita", "distinctio.", "Nam", "libero", "tempore,", "cum", "soluta", "nobis", "est", "eligendi", "optio,", "cumque", "nihil", "impedit,", "quo", "minus", "id,", "quod", "maxime", "placeat,", "facere", "possimus,", "omnis", "voluptas", "assumenda", "est,", "omnis", "dolor", "repellendus.", "temporibus", "autem", "quibusdam", "aut", "officiis", "debitis", "aut", "rerum", "necessitatibus", "saepe", "eveniet,", "ut", "et", "voluptates", "repudiandae", "sint", "molestiae", "non", "recusandae.", "itaque", "earum", "rerum", "hic", "tenetur", "a", "sapiente", "delectus,", "aut", "reiciendis", "voluptatibus", "maiores", "alias", "consequatur", "aut", "perferendis", "doloribus", "asperiores", "repellat"),
        docTypes = ['docx', 'jpeg', 'pptx', 'xlsx', 'pdf', 'mp4', 'txt'],
        ext = isDocument ? docTypes[Math.floor(Math.random() * docTypes.length)] : '',
        finalString = "",
        ret = "",
        newTxt = "";

    seperator = seperator ? seperator : ' ';

    for (var i = 0; i < count; i++) {
        newTxt = loremIpsumWordBank[Math.floor(Math.random() * (loremIpsumWordBank.length - 1))];
        if (ret.substring(ret.length - 1, ret.length) == "." || ret.substring(ret.length - 1, ret.length) == "?") {
            newTxt = newTxt.substring(0, 1).toUpperCase() + newTxt.substring(1, newTxt.length);
        }
        ret += seperator + newTxt;
    }

    if (isDocument) {
        ret = ret.replace(/,/g, '');
    }

    finalString = ret.substring(1, ret.length - 1) + "." + ext;
    return finalString.charAt(0).toUpperCase() + finalString.slice(1);

};

/**
 * Use lorumpixel.com to generate an image
 * @params string  width of image. Defaults to 600
 * @params string  height of image. Defaults to 400
 * @return string
 */
SPOC.Mock.dummyImage = function(width, height, cat) {
    width = width ? width : 600;
    height = height ? height : 400;
    return 'http://lorempixel.com/' + width + '/' + height + '/' + (cat ? cat : '');
};


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
    return value.length > requiredLength ? value.substr(0, requiredLength - 3) + "..." : value;
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
 * Extracts and returns a list name from api url endpoint
 * @params  url
 * @return  string
 */
SPOC.Utils.Url.AppWebUrl = function(url) {
   return SPOC.Utils.Url.getQueryString('SPAppWebUrl');
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
    this.url = url ? url : window._spPageContextInfo.webAbsoluteUrl;
};


/**
 * Define Sp User Object constructor
 * @params  url  url of Sharepoint site
 * @return  object
 */
SPOC.SP.User = function(username) {
    this.id = username ? username : window._spPageContextInfo.userId;
    this.loginName = username ? username : window._spPageContextInfo.userLoginName;
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
    if (filePath.charAt(0) !== '/') {
        filePath = '/' + filePath;
    }

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
    methods.upload = function(fileInput) {
        return new Promise(function(resolve, reject) {
            var reader = new FileReader();

            reader.onloadend = function(e) {
                var parts = fileInput.value.split('\\');
                var fileName = parts[parts.length - 1];
                var url = site.url + "/_api/Web/GetFolderByServerRelativeUrl('" + filePath + "')/files/add(overwrite=true, url='" + fileName + "')";
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

        if (newTab) {
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

            SPOC.Utils.Request.get(searchUrl, forceNoCache).then(function(result) {
                result = SPOC.Utils.SP.formatSearchResponse(result);
                resolve(result);
            }, function(err) {
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
        var listUrl = window._spPageContextInfo.webAbsoluteUrl;

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
        var user = userId ? userId : window._spPageContextInfo.userId;
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