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
    methods.query = function(settings, cache) {
        return new Promise(function(resolve, reject) {
            var searchUrl = site.url + '/_api/search/query?querytext=%27' + searchTerm + ' +path:' + site.url + '%27';
            searchUrl += settings ? '?' + SPOC.Utils.Conversion.objToQueryString(settings) : '';

            SPOC.Utils.Request.get(searchUrl, cache).then(function(result) {
                result = SPOC.Utils.SP.formatSearchResponse(result);
                resolve(result);
            }, function(err) {
                reject(err);
            });
        });

    };

    return methods;
};
