import React, { useState, useEffect } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
// import { Tasks } from '../api/tasks.js';
// import { Players } from '../api/epl.js';
import AccountsUIWrapper from './AccountsUIWrapper.js';
import { Meteor } from 'meteor/meteor';
import { Container,Menu,Card,Segment } from 'semantic-ui-react'
import Home from './Home.js'


function App(props) {

    return (

        <div>
            {props.currentUser ?

                <Home/>

                :


                <Card style={{backgroundColor: '#37033b', color: 'white',position: "fixed",top: "50%",left:"50%",transform: "translate(-50%, -50%)"}}>
                    <Card.Content style={{textAlign: "center"}}>
                        <AccountsUIWrapper />
                    </Card.Content>
                </Card>


            }
        </div>

    );
}


export default withTracker(() => {
    // Meteor.subscribe('tasks');
    // Meteor.subscribe('players');

    return {
        currentUser: Meteor.user()
    };
})(App);