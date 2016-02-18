# Mock API calls (Developing outside of SP)
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
