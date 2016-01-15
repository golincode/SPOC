
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

