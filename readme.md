# SPOC - SharePoint Online Connector.

SPOC is a client-side Javascript library that helps you interact with the **SharePoint Online & Yammer REST APIs**. It also contains handy helper and utility functions that are regularly used when working on Front-end SharePoint projects. The library currently lets you interact with:  

  - Sites
  - Lists
  - List Items
  - User Profiles
  - Yammer Search (query only)
  - Yammer Messages (query only)
  - Yammer Profiles (query only)
  
## Getting Started
First download  **SPOC.min.js** from this repo and include it in your project or add it to your masterpage or page layouts. Note that **If you want to interact with Yammer from within SharePoint Online, you must also include the Yammer JS SDK** by adding the following into your masterpage or page layouts (must be loaded before SPOC.min.js).

```html 

<!-- Load SPOC library into your masterpage or pagelayout -->
<script type="text/javascript" src="https://yoursite.sharepoint.com/document_library/SPOC.min.js"></script>

<!-- Optional - only needed if you are using Yammer functions -->
<script type="text/javascript" data-app-id="ADD YAMMER APP ID" src="https://c64.assets-yammer.com/assets/platform_js_sdk.js"></script>

```
> To use the Yammer API, you must first register an app on your network and set the app-id shown above. You can find out how to do this by visting the [Yammer help pages](https://developer.yammer.com/docs/app-registration)

## Basic Examples

##### 1. Get all items from a List
This example shows how to get list items from a list in the current site
```javascript
// Create a new site instance. Passing no url with set it as the current site
var site = new SPOC.SP.Site();

// Pass in the name of the list that you want to query 
var exampleList = site.listItems('List Name');

// Query list and retrive results in a JS promise
exampleList.query().then(function(results){
    console.log(results);
});

```
##### 1. Get filtered items from a List
The list item method allows you to pass in filters and query settings via a JS object. It supports all default OData query string operators (select, filter, orderBy, expand, top etc). More information can be found on [MSDN](https://msdn.microsoft.com/en-us/library/office/fp142385.aspx#sectionSection0)

```javascript
// Create a new site instance. Passing no url with set it as the current site
var site = new SPOC.SP.Site();

// Create an object with your required settings
    var settings = {
        select: "Title,Created",
        filter: "Title eq 'My Item Title'",
        orderBy: 'Created'
    };

// Pass in the name of the list that you want to query 
var exampleList = site.listItems('List Name');

// Query list and retrive results in a JS promise
exampleList.query().then(function(results){
    console.log(results);
});

```

##### 2. Create a new list item to a list in a subsite
This example shows how to create a new list item to a list in a different site to that being viewed

```javascript
// Create a new site instance. Pass in the url to the subsite that contains the list
var subSite = new SPOC.SP.Site('https://example.sharepoint.com/sites/mysite/mysubsite');

// Create an object with a property for each column.
    var item = {
        Title: "My Item title",
        description: "text for the description column"
    };

// Pass in the name of the list that you want to query 
var exampleList = subSite.listItems('List Name');

// Query list and retrive results in a JS promise. This examples includes handling errors via a error callback
exampleList.create(item).then(function(results){
    console.log(results);
}, function(err){
    console.log(err);
});

```

##### 3. Get the current users profile details
This examples shows how to get the current users profile properties

```javascript
// Create a new user instance.
var user = new SPOC.SP.User();

// Query the users profile and retrive results in a JS promise
user.query().then(function(results){
    console.log(results);
});

```
## Mock API calls (Developing outside of SP)
To help improve efficiency when working on front-end based SharePoint projects, we often start development offline (i.e creating the styling, HTML templates etc), and then intergrate it to SharePoint once completed. This makes the development process much quicker. 
The problem with this is that you do not have access to the SharePoint API's when working offline. In order to get around this, SPOC includes the ability to create fake lists using javascript or a JSON file. This allows you to switch between real and local (fake) lists in a switch of a property (As long as you have a Mock list for each real list that your solution needs to interact with.)

```javascript

// Create items to add to the mock list 
var myListItems = [{Title: "Item One",Title: "Item Two", Title: "Item Three"}];

// Create a mock list called 'MyList' and list items
SPOC.Mock.createList('MyList', myListItems);

// Activate Mock API's. If active the API will return the mock lists, if deactivated it will query SP
SPOC.Mock.active = true;

// Query SharePoint list as normal

var site = new SPOC.SP.Site();
var exampleList = site.listItems('MyList');
exampleList.query().then(function(results){
    console.log(results);
    // Returns [{Title: "Item One",Title: "Item Two", Title: "Item Three"}]
});

```

## Utilities and Helpers 
Most of the following functions are used internally by the library, but have been exposed as they can came in handy.

##### Objects (SPOC.Utils.Objects)

###### Find first object in array based on a property value (.findObjectByProperty(data, property, value))
```javascript
    var data = [{
        Title: "My Title One",
        Description: "My Description One"
    },{
        Title: "My Title Two",
        Description: "My Description Two"
    }];
    
    var wantedObj = SPOC.Utils.Objects.findObjectByProperty(data, 'Title', 'My Title Two");
    
    console.log(wantedObj);
    // returns {Title: "My Title Two", Description: "My Description Two"}
```    
###### Merge two objects together (.merge(Object1, Object2))
```javascript
    var objectOne = {
        Title: "My Title One",
        Description: "My Description One"
    };
    var objectTwo = {
        Status: "open"
    };

    var mergedObject = SPOC.Utils.Objects.merge(objectOne, objectTwo);

    console.log(mergedObject);
    // returns {Title: "My Title One", Description: "My Description One", Status: "open"}
```    
##### Conversion (SPOC.Utils.Conversion)
 - Convert JS object to SP format API querystrings (.objToQueryString(obj))

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

##### Yammer (SPOC.Utils.Yammer)
 - Tidy up a Yammer feed response (.formatFeedResponse(data))
 - Tidy up a Yammer search response (.formatSearchResponse(data))
 - Check if a user is logged into Yammer (.checkLogin(promptLogin))
 
## Installation (Contributing)
Want to contribute? Great! Note that SPOC uses Grunt & NPM, so these will need to be installed:

```sh
$ npm i -g grunt
```

```sh
$ git clone [git-repo-url] SPOC
$ cd SPOC
$ npm install
$ grunt
```
If you are using Windows (shame on you), you can find more information on getting this working by reading the FAQs on the [Grunt Website](http://gruntjs.com/frequently-asked-questions)

## Versions
0.0.1 - Bewared - still in early development stage

### Todos

 - Add create, delete and update on lists
 - Write Tests
 - Add SharePoint search
 - Add site creation
 - Add delve api
 - Add custom tool pane functions
 - write comprehensive documentation

License
----

MIT

**Free Software, Hell Yeah!**

