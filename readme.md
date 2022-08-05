# Introduction to creating web apps with ExpressJS

In this document we will explore how to create web applications with [ExpressJS](http://http://expressjs.com/).

Web Applications are programs that clients can connect to remotely access using a Web Browser. They are started up on a port number, which forms part of the URL to the server.

Let's start of by creating a simple Web Server using JavaScript.

Create a project folder and change into it:

```
mkdir express-intro
cd express-intro
touch index.js
```

Initialise the node project using: `npm init --y`

Now install ExpressJS as project dependency:

```
npm install --save express
```

Setup a simple ExpressJS server in `index.js`

```
let express = require('express');
let app = express();

app.get("/", function(req, res){
  res.send("Bill Settings WebApp");
});

let PORT = process.env.PORT || 3009;

app.listen(PORT, function(){
  console.log('App starting on port', PORT);
});
```
> You can learn more about ExpressJS [here](http://expressjs.projectcodex.co/steps/intro.html) as well

## Start the server

Start you ExpressJS server using `node index.js`

Open this link in a web browser: `http://localhost:3007`

You should see `Bill Settings WebApp` in the server.

If you were to stop the server instance by pressing `Ctrl-C` in the terminal the `http://localhost:3007` URL will not work any more.

## Install nodemon

To make your development cycle easier install `nodemon` globally using this command: `npm install -g nodemon`.

When you start your ExpressJS server with `nodemon` you won't need to restart your server manually after a file change. The ExpressJS server will be restarted automatically for you.

## Adding functionality

ExpressJS can not do much straight out of the box. We will need to extends it's ability by installing extra middleware from using `npm`.

We will install two middleware modules to start with:

* [HandlebarsJS](https://www.npmjs.com/package/express-handlebars) to add HandlebarsJS templating support to ExpressJS
* [body-parser](https://www.npmjs.com/package/body-parser) middleware to process HTML Data sent to the server

And use ExpressJS built-in middleware

* [public folder](https://expressjs.com/en/starter/static-files.html) middleware to ensure that static files such as `css` and client-side `javascript` can be served.

Install the two middleware modules like this:

```
npm install --save express-handlebars
npm install --save body-parser
```

### HandlebarsJS setup

Set it up by creating a `views` folder and `layouts` folder inside the `views` folder.

Import `express-handlebars` like this:

```javascript
var exphbs  = require('express-handlebars');
```

Set it up like this:

```javascript
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
```

Make sure it create a layout file called `main.handlebars` in the layout folder it should contain `{{{body}}}`. You can add some HTML body and layout into this file.

Template you want to render should be created in the `views` folder.

You can render a template like this:

```javascript
app.get('/', function (req, res) {
    res.render('home');
});
```

Create a `home.handlebars` template to get the code above to work.

## POST and GET routes

One can create POST and GET post routes in ExpressJS amongst others.

A route in ExpressJS have two parts:

* The route name - the name of the route that can be called from the browser.
* The routes handler - the function that is called when the route is called in the browser.

Each route takes at least two parameters:

* The HttpRequest object called `req` by convention,
* and the HttpResponse object called `res`.

The HttpRequest object is for handling inbound server data and the HttpResponse object for handling outbound server data.

### Inbound Data

Data can be sent into the ExpressJS server using the URL or using HTML forms.

When using the URL data can be send in using a parameter, `/my-root/:the_param` or a query string like this `/my-root/the_url?param=30&username=avee`

Parameters are read out of the `HttpRequest` object like this: `req.params.the_param` and query parameters are read like this: `req.params.username` and `req.params.the_url`.

Form data can be read from `req.body` once middleware has been configured to extract the form data from the Http POST requests.

### Outbound data

Data can be send out of the server using:

* `res.send` - send text to the client can be HTML.
* `res.json` - send JSON data to the client. Used for API's.
* `res.render` - this needs a view engine configured for this to work.

### GET

Using get routes you can use URL to communicate with the web server.

You can add a parameter to GET routes like this:

```javascript
app.get('/settings/:costType', function(){
    let costType = req.params.costType;

    let cost = 0;
    //lookup cost for costType
    if (costType === 'sms'){
        cost = settings.smsCost;
    } else if (costType === 'call') {
        cost = settings.callCost;
    }

    req.render('cost', {
        costType,
        cost
    });
});
```

Routes can have more than one parameter in the URL.

> **Note:** POST routes can also contain URL parameters

### POST

Using POST routes you can send more data to the server over and above that in the URL.
You can POST data to the server using an HTML form.

You can create a basic form like this to send call & sms costs to the server.

```html
<form class="" action="/settings" method="post">
    <input type="text" name="smsCost" placeholder="enter sms cost">
    <input type="text" name="callCost" placeholder="enter call cost">
    <input type="text" name="callCost" placeholder="enter warning level">
    <input type="text" name="callCost" placeholder="enter critical level">
    <input type="submit">
</form>
```

If the you enter data in the form the form will send data to the server. This data can then be processed on the server.

For form variables to be processed by ExpressJS you need to add some from processing middleware like [body-parser](https://www.npmjs.com/package/body-parser).

To set it up import it: `var bodyParser = require('body-parser');`

The set it up like this:

```javascript
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
```

This will ensure that form variables can be read from the `req.body` variable.

```javascript

app.post('/settings', function(req, res){
    let smsCost = req.body.smsCost;
    let callCost = req.body.callCost;
    let warningLevel = req.body.warningLevel;
    let criticalLevel = req.body.criticalLevel;

    var settings = {
      smsCost,
      callCost,
      warningLevel,
      criticalLevel
    };

    // process data
    globalSetings = settings;

    // note that data can be sent to the template
    res.render('home', {settings})
});
```

## Static resources

To using static resources such as CSS and client-side JavaScript more middleware and a folder is needed.

Create a `public` folder in your project.

Add use the built-in `static` middleware from ExpressJS like this:

`app.use(express.static('public'));`

Your server instance will now find `css`, `js` and other resources stored in the `public` folder.

## Setup a server

Setup a simple ExpressJS server with a few routes that allow users to:

* Select the call or sms radio button.
* Update the appropriate total and the global total when the ADD button in pressed.
* Configure sms and call costs.
* Configure a warning and critical level.

Use this HTML as a [template](./public/index.html) for your screens.

Create a folder called `settings-bill-expressjs`. Create a GitHub repo with the same name for the project.

If the total cost exceed the warning level show the total cost in orange, if it exceeds the critical level show it in red and prevent any new costs from being added.

> **Note:** use the `res.redirect('/target-route')` route to redirect to a GET route.

### Routes to create

Route name | Action |Description
-----------|-------|------------
`/`        | GET   | show the home screen - show the prices set and a html form to enter action call/sms.
`/settings` | POST  | set the settings - sms & call price and the warning & critical level
`/action`  | POST  | record an action of `sms` or `call` and the appropriate price based on the settings entered & a timestamp when record has been entered.
`/actions`  | GET  | show all the actions - display the timestamps using [fromNow](https://momentjs.com/docs/#/displaying/fromnow/) and display a total cost for all the actions on the screen.
`/actions/:type`  | GET  | display all the `sms` or `call` actions - display the timestamps using [fromNow](https://momentjs.com/docs/#/displaying/fromnow/) and display a total cost for the selected action.

### Deploy the Heroku

Deploy your application to [Heroku](https://www.heroku.com/nodejs).
