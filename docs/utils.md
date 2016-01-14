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

### Objects (SPOC.Utils.Objects)
###### Find an object from an array of objects by property
```javascript
    var objectArray = [{
        Title: "Test1",
        Description: "Descr Test1",
    },{
        Title: "Test2",
        Description: "Descr Test2",
    },{
        Title: "Test3",
        Description: "Descr Test3",
    }];
   var results = SPOC.Utils.Objects.findObjectByProperty(objectArray, "Title", "Test1");
   console.log(results);
   // Outputs {Title:"Test1", Description: "Descr Test1"};
```

###### Merge two objects
```javascript
    var object1 = {
        Title: "Test1",
        Description: "Descr Test1",
    };
    
    var object2 = {
        Title: "Test2",
        Description: "Descr Test2",
    };
   var results = SPOC.Utils.Objects.merge(object1, object2);
   console.log(results);
   // Outputs [{Title:"Test1", Description: "Descr Test1"}, {Title:"Test2", Description: "Descr Test2"}];
```

### Requests (SPOC.Utils.Request)
###### Get an object by a request
```javascript
    //param forceNoCache true or false for not force the cache or yes
    var url = "https://www.sharepoint.com/Test";
    var results = SPOC.Utils.Request.get(url, forceNoCache);
    console.log(results);
    // Outputs if SPOC.Mock.active a mock object else a json object
```

###### Post an object by a request
```javascript
    //param forceNoCache true or false for not force the cache or yes
    var url = "https://www.sharepoint.com/Test";
    var data = {Title: "Test1", Description: "Descr Test1"};
    var results = SPOC.Utils.Request.post(url, data);
    console.log(results);
    // Outputs 'Network error' or .then({Title: "Test1", Description: "Descr Test1"})
```

### SharePoint General (SPOC.Utils.SP)
###### Generate SP data type by list name
```javascript
    var listName = "TestList";
    var results = SPOC.Utils.SP.getListItemType(listName);
    console.log(results);
    // Outputs "SP.Data.TestListListItem";
```

###### Upload document via SP modal and return item list data
```javascript
    var ListGUID = "{2226aabc-8137-4417-a26f-3adfaec4daa7}"
    var settings = {
        title: "Upload Document",
        height: 200,
        width: 800
    };
    var results = SPOC.Utils.SP.uploadDocument(ListGUID, settings);
    console.log(results);
    // Outputs .then(data) after modal dialog and upload;
```

### Storage (SPOC.Utils.Storage)
###### Check if browser storage is avaliable
```javascript
   var results = SPOC.Utils.Storage.storageAvailable();
   console.log(typeof(Storage) !== "undefined");
   // Outputs {Title:"Test1", Description: "Descr Test1"};
```

###### Save data in browser storage
```javascript
    var key = "ItemStorage";
    var data = {
        Title: "Test1",
        Description: "Descr Test1",
    };
    //useLocalStorage true or false to set storage in local or session storage
    var useLocalStorage = false;
    var results = SPOC.Utils.Storage.set(key, data, useLocalStorage);
    console.log(results);
    // Outputs void;
```

###### Get data from browser storage by key
```javascript
    var key = "ItemStorage";
    //isLocalStorage true or false to search the item in the local or session storage
    var isLocalStorage = false;
    var results = SPOC.Utils.Storage.get(key, isLocalStorage);
    console.log(results);
    // Outputs {Title:"Test1", Description: "Descr Test1"};
```

###### Remove data from browser storage by key
```javascript
    var key = "ItemStorage";
    //useLocalStorage true or false to set storage in local or session storage
    var useLocalStorage = false;
    var results = SPOC.Utils.Storage.remove(key, isLocalStorage);
    console.log(results);
    // Outputs void;
```

###### Get cookie by name
```javascript
    var name = "ItemCookie";
    var results = SPOC.Utils.Storage.getCookie(name);
    console.log(results);
   // Outputs false;
```

###### Set cookie
```javascript
    var name = "ItemCookie";
    var value = "10";
    var days = 5;
    var results = SPOC.Utils.Storage.setCookie(name, value, days);
    console.log(results);
    // Outputs void;
```

###### Delete cookie
```javascript
    var name = "ItemCookie";
    var results = SPOC.Utils.Storage.removeCookie(name);
    console.log(results);
   // Outputs void;
```

### Strings (SPOC.Utils.Strings)
###### Truncate string to length with '...'
```javascript
    var string = "test of description";
    var requiredLength = 4;
    var results = SPOC.Utils.Storage.truncate(string, requiredLength);
    console.log(results);
   // Outputs test...;
```
 
### Templates (SPOC.Utils.Tpl)
###### Get from an array, an object by property name
```javascript
    var obj = {
        Title: "Test1",
        Description: "Descr Test1",
    };
    
    propertyName = "Title";
    var results = SPOC.Utils.Tpl.getProperty(propertyName, obj);
    console.log(results);
    // Outputs {Title:"Test1", Description: "Descr Test1"};
```

###### Render template by matching the tpl with a array
```javascript
    var tpl = "<div class='test'>{{Title}}</div>";
    var data = {
        Title: "Test1"
    };
    var results = SPOC.Utils.Tpl.render(tpl, data);
    console.log(results);
    // Outputs "<div class='test'>Test1</div>";
```

### URLs (SPOC.Utils.Url)
###### Get a query string value by key
```javascript
    //current url https://www.sharepoint.com/Test?k=TestQuery
    var key = "k";
    var results = SPOC.Utils.Url.getQueryString(key);
    console.log(results);
   // Outputs "TestQuery";
```

###### Extracts and returns a list name from api url endpoint
```javascript
    var url = "https://www.sharepoint.com/Test";
    var results = SPOC.Utils.Url.getListNameFromUrl(url);
    console.log(results);
   // Outputs {Title:"Test1", Description: "Descr Test1"};
```

###### Checks if passed in url has the same domain
```javascript
    var url = "https://www.sharepoint.com/Test";
    //current domain is www.sharepoint.com
    var results = SPOC.Utils.Url.isSameDomain(url);
    console.log(results);
   // Outputs true;
```

###### Convert url to XDomain
```javascript
    var url = "https://www.sharepoint.com/Test";
    var results = SPOC.Utils.Url.convertToXDomain(url);
    console.log(results);
   // Outputs https://www.sharepoint.com/_api/https://www.sharepoint.com/Test@target=%27'https://www.sharepoint.com%27';
```

### Yammer (SPOC.Utils.Yammer)
###### Tidy up a Yammer feed response
```javascript
    var data = [{
        Title: "Test1",
        replied_to_id: false,
        sender_type: 'user'
    },{
        Title: "Test2",
        replied_to_id: false,
        sender_type: 'user'
    },{
        Title: "Test3",
        replied_to_id: false,
        sender_type: 'user'
    }];

    var results = SPOC.Utils.Yammer.formatFeedResponse(data);
    console.log(results);
    // Outputs [{Title: "Test1",
    //    replied_to_id: false,
    //    sender_type: 'user'
    //    user: Martin Pomeroy
    //},{
    //    Title: "Test2",
    //    replied_to_id: false,
    //    sender_type: 'user'
    //    user: Martin Pomeroy
    //},{
    //    Title: "Test3",
    //    replied_to_id: false,
    //    sender_type: 'user'
    //    user: Martin Pomeroy
    //}];
```

###### Tidy up a Yammer search response
```javascript
    var data = [{
        Title: "Test1",
        replied_to_id: false,
        sender_type: 'user'
    },{
        Title: "Test2",
        replied_to_id: false,
        sender_type: 'user'
    },{
        Title: "Test3",
        replied_to_id: false,
        sender_type: 'user'
    }];

   var results = SPOC.Utils.Yammer.formatFeedResponse(data);
    console.log(results);
    // Outputs [{Title: "Test1",
    //    replied_to_id: false,
    //    sender_type: 'user'
    //    user: Martin Pomeroy
    //},{
    //    Title: "Test2",
    //    replied_to_id: false,
    //    sender_type: 'user'
    //    user: Martin Pomeroy
    //},{
    //    Title: "Test3",
    //    replied_to_id: false,
    //    sender_type: 'user'
    //    user: Martin Pomeroy
    //}];
```

###### Check if a user is logged into Yammer
```javascript
    var promptLogin = true;
    var results = SPOC.Utils.Yammer.checkLogin(promptLogin);
    console.log(results);
   // Outputs .then(user);
```