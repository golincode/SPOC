# SPOC - SharePoint Online Connector.

SPOC is a client-side Javascript library (with NO dependencies) that helps you interact with the **SharePoint Online & Yammer REST APIs**. It also contains handy helper and utility functions that are regularly used when working on Front-end SharePoint projects. The library currently lets you interact with:  

  - Sites
  - Lists
  - List Items
  - User Profiles
  - Yammer Messages
  - Yammer Profiles 
  
## Getting Started
First download  **SPOC.min.js** from this repo and include it in your project or add it to your masterpage or page layouts. Note that **If you want to interact with Yammer from within SharePoint Online, you must also include the Yammer JS SDK** by adding the following into your masterpage or page layouts (must be loaded before SPOC.min.js).

```html 
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
The list item method allows you to pass in filters and query settings via a JS object. It supports all default OData query string operators (select, filter, orderBy, expand, top etc) More information can be found on [MSDN](https://msdn.microsoft.com/en-us/library/office/fp142385.aspx#sectionSection0)

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

## Utilities and Helpers

##### Arrays (SPOC.Utils.Arrays)
 - Retrieve a object propirty by value (.findByProperty(data, prop, value))
##### Browser (SPOC.Utils.Browser)
 - Check if the user is using a windows phone (.isWindowsPhone())
 - Get version of IE browser (.ieVersion())
 ##### Conversion (SPOC.Utils.Conversion)
 - Convert JS object to SP format API querystrings (.objToQueryString(obj))
 - Get version of IE browser (.ieVersion())
 ##### Conversion (SPOC.Utils.Conversion)
 - Convert JS object to SP format API querystrings (.objToQueryString(obj))
 - Get version of IE browser (.ieVersion())
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
##### URLs (SPOC.Utils.Url)
 - Get a query string value by key (.getQueryString(key))
 - Make a AJAX get request to a url (.get(url))s
##### Yammer (SPOC.Utils.Yammer)
 - Tidy up a Yammer feed response (.formatFeedResponse(data))
 - Tidy up a Yammer search response (.formatSearchResponse(data))
 - Check if a user is logged into Yammer (.checkLogin(promptLogin))
 
## Versions
0.0.1 - Bewared - still in early development stage

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


### Todos

 - write Tests
 - Add SharePoint search
 - Add delete methods for lists and list items
 - Add site creation
 - Add delve
 - Add custom tool pane functions
 - write comprehensive documentation

License
----

MIT

**Free Software, Hell Yeah!**

