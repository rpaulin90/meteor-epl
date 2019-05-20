import React from 'react';
import { Router, Route, Switch,Redirect } from 'react-router';
const createBrowserHistory = require("history").createBrowserHistory
import { Meteor } from 'meteor/meteor';
// route components
import App from '../ui/App.js';
import Draft from '../ui/Draft.js';
import Team from '../ui/Team.js';



const browserHistory = createBrowserHistory();

const NoMatch = ({ location }) => (
    <div>
        <h3>No match for <code>{location.pathname}</code></h3>
    </div>
)

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
        Meteor.user() !== null
            ? <Component {...props} />
            : <Redirect to='/' />
    )} />
)
export const renderRoutes = () => (

    <Router history={browserHistory}>
        <Switch>
            <Route exact path="/" component={App}/>
            <PrivateRoute exact path="/Draft" component={Draft}/>
            <PrivateRoute exact path="/Team" component={Team}/>
            <Route component={NoMatch}/>
        </Switch>
    </Router>
);

