### Conversion (SPOC.Utils.Conversion)
###### Convert JS object to SP format API querystrings
```javascript
    var params = {
        select: 'Title, My Column/Title',
        expand: 'My Column',
        top: 100
    };
   
   var queryVersion = SPOC.Utils.Conversion.objToQueryString(params);
   console.log(queryVersion);
   // Outputs '?$select=Title,My_x0020_Column/Title&$expand=My_x0020_Column&$top=100';
```

##### Requests (SPOC.Utils.Request)


##### SharePoint General (SPOC.Utils.SP)
 - Generate SP data type by list name (.getListItemType(listName))
 - Upload document via SP modal and return item list data (.uploadDocument(ListGUID, settings))

##### Storage (SPOC.Utils.Conversion)
 - Check if browser storage is avaliable (.storageAvailable())
 - Save data in browser storage (.set(key, data, useLocalStorage))
 - Get data from browser storage by key (.get(key, isLocalStorage))
 - Get cookie (.getCookie(name))
 - Get cookie (.setCookie(name, value, days))
 - Delete cookie (.removeCookie(name))

##### Strings (SPOC.Utils.Strings)
 - Truncate string to length with '...' (.truncate(string, requiredLength))
 
##### Templates (SPOC.Utils.tpl)
 - Truncate string to length with '...' (.truncate(string, requiredLength))

##### URLs (SPOC.Utils.Url)
 - Get a query string value by key (.getQueryString(key))
 - Make a AJAX get request to a url (.get(url))
 - Checks if passed in url has the same domain

##### Yammer (SPOC.Utils.Yammer)
 - Tidy up a Yammer feed response (.formatFeedResponse(data))
 - Tidy up a Yammer search response (.formatSearchResponse(data))
 - Check if a user is logged into Yammer (.checkLogin(promptLogin))
 - 