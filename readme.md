# SPOC - SharePoint Online Connector (Beta).

SPOC is a client-side Javascript library that helps you interact with the **SharePoint Online & Yammer REST APIs**. It also contains handy helper and utility functions that are regularly used when working on Front-end SharePoint projects. 

The library currently lets you interact with:  

  - SharePoint Sites (Both App and Host Webs)
  - SharePoint Lists
  - SharePoint List Items
  - SharePoint User Profiles
  - SharePoint Search
  - Delve Boards
  - Files (Upload, Download, Open, Generate timed guest links)
  - Yammer Search 
  - Yammer Posts & Feeds
  - Yammer Profiles

### SharePoint Hosted App Model
SPOC has built in logic that automatically detects when you are trying to call a site within a different domain and handles the relevant calls. This makes it really simple to interact with both the Host and App web when using the library within a SharePoint Hosted App.

## Getting Started
First download  **SPOC.min.js** and include it in your project or add it to your master-page or page layouts. Note that **If you want to interact with Yammer from within SharePoint Online, you must also include the Yammer JS SDK** by adding the following into your master-page or page layouts.

```html 
<!-- Optional - only needed if you are using Yammer functions -->
<script type="text/javascript" data-app-id="ADD YAMMER APP ID" src="https://c64.assets-yammer.com/assets/platform_js_sdk.js"></script>

<!-- Load SPOC library into your masterpage or pagelayout -->
<script type="text/javascript" src="https://yoursite.sharepoint.com/document_library/SPOC.min.js"></script>

```

> To use the Yammer API, you must first register an app on your network and set the app-id shown above. You can find out how to do this by visiting the [Yammer help pages](https://developer.yammer.com/docs/app-registration)


## Basic Examples
##### 1. Get items from a SharePoint list
This examples show you how to retrieve items from a SharePoint list. The list item method allows you to pass in filters and query settings via a JS object. It supports all default OData query string operators (select, filter, orderBy, expand, top etc). More information can be found on [MSDN](https://msdn.microsoft.com/en-us/library/office/fp142385.aspx#sectionSection0).

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

// Query list, passing in your settings. If you don't pass anything into the query, it will return all items.
exampleList.query(settings).then(function(results){
    console.log(results);
});

```
> Note that all GET requests automatically cache results in the browser sessionStorage. If you would like to bypass the cache, pass true into the second parameter of the query function.

##### 2. Retrieve items from both the Host and App web from within a SharePoint Hosted App
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

##### 3. Get the current users profile details
This examples shows how to get the current users profile properties

```javascript
// Create a new user instance.
var user = new SPOC.SP.User();

// Query the users profile
user.Profile().query().then(function(results){
    console.log(results);
});

```

##### 4. Get personalised yammer posts for the logged in user (Posts from People, Groups and topics that they follow)
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
## Further Examples
View the [more examples page](https://github.com/wearearchitect/SPOC/blob/master/docs/examples.md) to see the full list of functionilty available within the SPOC library.

## Utility functions and Helpers
SPOC includes utility functions functions that are useful when developing within SharePoint. You can view a [list of utility functions here](https://github.com/wearearchitect/SPOC/blob/master/docs/utils.md).

## Mock API calls (Developing outside of SP)
To help improve efficiency when working on front-end based SharePoint projects, we often start development offline (i.e creating the styling, HTML templates etc), and then integrate it to SharePoint once completed. This makes the development process much quicker. 

The problem with this is that you do not have access to the SharePoint API's when working offline. In order to get around this, SPOC includes the ability to create fake lists & users using javascript or a JSON file. The Library will then return the fake lists / list items / users when running outside of SharePoint! As soon as you run the file inside of SharePoint, it will return to using the real list apis. When using this feature, be sure to create a mock list for each real list within your solution.

```javascript

// Create items to add to the mock list 
var myListItems = [{Title: "Item One",Title: "Item Two", Title: "Item Three"}];

// Create a mock list called 'MyList' and list items
SPOC.Mock.createList('MyList', myListItems);

// Query SharePoint list as normal

var site = new SPOC.SP.Site();
var exampleList = site.listItems('MyList');

exampleList.query().then(function(results){
    console.log(results);
    // Returns [{Title: "Item One",Title: "Item Two", Title: "Item Three"}]
});

```

## Contributing
Please read the [contributing.md](https://github.com/wearearchitect/SPOC/blob/master/docs/contributing.md) to find out how you can get involved in the project.

## Versions
0.0.1 - Bewared - still in early development stage

## License
----
The code and the documentation are released under the [MIT License](https://github.com/wearearchitect/SPOC/blob/master/LICENSE)

**Free Software, Hell Yeah!**

