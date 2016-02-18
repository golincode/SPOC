# Usage Examples
### SharePoint Lists and Items
##### 1. Get all items from a SharePoint List
This example shows how to get list items from a list in the current site
```javascript
// Create a new site instance. Passing no url with set it as the current site
var site = new SPOC.SP.Site();

// Pass in the name of the list that you would like to query
var exampleList = site.listItems('List Name');

// Query list
exampleList.query().then(function(results){
    console.log(results);
});

```

##### 2. Get items from a list that match a filter
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

// Pass in the name of the list that you would like to query
var exampleList = site.listItems('List Name');

// Query list, passing in your settings
exampleList.query(settings).then(function(results){
    console.log(results);
});

```
> Note that you can pass in true as a second parameter on all GET requests to automatically cache results in the browser sessionStorage.

##### 3. Get items from a list using the CSOM
The list item method allows you to pass in filters and query settings via a JS object. It supports all default OData query string operators (select, filter, orderBy, expand, top etc). More information can be found on [MSDN](https://msdn.microsoft.com/en-us/library/office/fp142385.aspx#sectionSection0)

```javascript
// Create a new site instance. Passing no url with set it as the current site
var site = new SPOC.SP.Site();

// Create caml query
var camlQuery = '<View><RowLimit>100</RowLimit></View>';

// Pass in the name of the list that you would like to query
var exampleList = site.listItems('List Name');

// Query list, passing in your settings
exampleList.queryCSOM(camlQuery).then(function(results){
    console.log(results);
});

```

##### 4. Create a new list item in a list that is hosted in a subsite
This example shows how to create a new list item to a list in a different site to that being viewed

```javascript
// Create a new site instance. Pass in the url to the subsite that contains the list
var subSite = new SPOC.SP.Site('https://example.sharepoint.com/sites/mysite/mysubsite');

// Create an object with a property for each column.
var item = {
    Title: "My Item title",
    description: "text for the description column"
};

// Pass in the name of the list that you want to create the item in
var exampleList = subSite.listItems('List Name');

// Create Item, passing in the item object
exampleList.create(item).then(function(results){
    console.log(results);
}, function(err){
    console.log(err);
});

```
##### 5. Retrieve items from both the Host and App web from within a SharePoint Hosted App
This example shows how interacting with the host or app web when using SPOC in a SharePoint Hosted App is really simple.
```javascript
// Create a new site instance both the host and app web. To create the app web, leave the site param empty. To create the host web, pass your host web url into the site param.
var hostWeb = new SPOC.SP.Site('https://example.sharepoint.com/sites/mysite');
var appWeb = new SPOC.SP.Site();

// Both the host and app web instances can be called as normal. The hostWeb call will automatically use the SP xdomain logic.
hostWeb.listItems('Host web List Name').query().then(function(data){
    console.log(data)
});

appWeb.listItems('App Web List Name').query().then(function(data){
    console.log(data)
});

```

Note that when using SPOC, or calling the SharePoint API, from a App web, you should ensure the following scripts are added to your page.

```html
    <script type="text/javascript" src="/_layouts/15/MicrosoftAjax.js"></script>
    <script type="text/javascript" src="/_layouts/15/sp.runtime.js"></script>
    <script type="text/javascript" src="/_layouts/15/sp.js"></script>
```

#### SharePoint Files
##### 1. Upload a File via the API
This examples shows how to upload a file to a document library (Not supported on IE9)

```javascript
// Create a new site instance.
var user = new SPOC.SP.Site();

// Select the files by passing in a library name
var library = site.Files('App');

// get the file input element
var filePicker = document.getElementById('fileInput');

// Call the upload function, passing in the file input element
library.upload(filePicker).then(function(data){
console.log(data)
});
```
##### 2. Generate a timed guest access link
This example show you how to generate a guest access link that timesout after a set period

```javascript
// Create a new site instance.
var user = new SPOC.SP.Site();

// Select the files by passing in the relative url to the file
var file = site.Files('/documents/myfiletoshare.doc');

// Call the generate external link function, passing in the number of hours you like it to last
file.generateExternalLink(10).then(function(data){
    console.log(data)
});
```
> Note that you must have external access turned on within the site collection to use the functionlity.

#### SharePoint Users & Profiles

##### 1. Get the current users profile details
This examples shows how to get the current users profile properties

```javascript
// Create a new user instance.
var user = new SPOC.SP.User();

// Query the users profile
user.Profile().query().then(function(results){
    console.log(results);
});

```

##### 2. Get users profile details via a users email address
This examples shows how to get the current users profile properties

```javascript
// Create a new user instance, passing a users email address
var user = new SPOC.SP.User('test@test.sharepoint.com');

// Query the users profile
user.Profile().query().then(function(results){
    console.log(results);
    // Logs profile properties for user test@test.sharepoint.com
});

```
### SharePoint Search and Delve
##### 1. Retrieve search results for a given search term
This example shows to you how to retrieve search results for a given search term
```javascript
// Create a new site instance.
var site = new SPOC.SP.Site();

// Call search function, passing in the search term
var search = site.Search('My Search Term');

// query the search
search.query().then(function(data){
    console.log(data);
});
```
##### 2. Retrieve documents from the a delve board
This example shows to you how to retrieve items personlised items via delve
```javascript
// Create a new site instance.
var site = new SPOC.SP.Site();

// Create a new delve instance. You can pass in the email of the persons delve board you would like to retrieve.
// Passing is null will bring back the delve board for the current user
var delve = site.Delve('jon@test.onmicrosoft.com');

// call the board function
delve.board().then(function(data){
    console.log(data);
});
```
### Yammer

##### 1. Get personalised yammer posts for the logged in user (Posts from People, Groups and topics that they follow)
This examples shows how to get Yammer posts from People, Groups and Topics that hte current user is following
```javascript
// Create a new Yammer Messages instance.
var feed = new SPOC.Yam.Feed();

var posts = feed.posts();

posts.query().then(function(data){
    console.log(data);
    // outputs a object array of Yammer posts
});


```

##### 2. Get all posts from a Yammer Group
This examples shows how to get Yammer posts from group. This can anything that has a feed id (Group, user feed etc). For user feeds, the feed Id is the users Yammer id
```javascript
// Create a new Yammer feed instance. Pass in true as a second arguement if you are querying a users feed instead of a group
var feed = new SPOC.Yam.Feed('012345');
var posts = feed.posts();

posts.query().then(function(data){
    console.log(data);
    // outputs a object array of Yammer posts
});
```
##### 3. Search Yammer
This examples shows how to search groups, posts, documents and notes on Yammer.
```javascript
// Create a new Yammer Search instance.
var yamSearch = new SPOC.Yam.Search('search term');

yamSearch.query().then(function(data){
    console.log(data);
    // outputs a object array of Yammer search results
});
```
