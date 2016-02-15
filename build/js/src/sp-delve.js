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
    methods.board = function(searchTerm, actions, cache) {
        return new Promise(function(resolve, reject) {
            var searchUrl, actor;

            if(!searchTerm){
                searchTerm = '*';
            }

            if (userEmail) {
                 searchUrl = site.url + "/_api/search/query?Querytext=%27WorkEmail:" + userEmail + "%27&SelectProperties=%27UserName,DocId%27";

                 SPOC.Utils.Request.get(searchUrl, cache).then(function(result) {
                    result = SPOC.Utils.SP.formatSearchResponse(result);

                    if (result.length){

                        if(result.length > 1){
                            result = result[0];
                        }

                        actor = result.DocId;
                        searchUrl = site.url + "/_api/search/query?Querytext='"+ searchTerm + "'&amp;Properties='GraphQuery:ACTOR("+ actor + actions ? (", " + actions) : "" + ")";

                        SPOC.Utils.Request.get(searchUrl, cache).then(function(board) {
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
                SPOC.Utils.Request.get(searchUrl, cache).then(function(board) {
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
