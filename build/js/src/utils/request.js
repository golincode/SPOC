
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
