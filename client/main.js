import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import '../imports/startup/accounts-config.js';

import App from '../imports/ui/App.js';

import { renderRoutes } from '../imports/routes/routes.js';

Meteor.startup(() => {
    render(renderRoutes(), document.getElementById('render-target'));
});

// Meteor.startup(() => {
//     render(<App />, document.getElementById('render-target'));
// });