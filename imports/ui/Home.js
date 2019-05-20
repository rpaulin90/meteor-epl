import React, { useState, useEffect } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom'
// import { Tasks } from '../api/tasks.js';
import {League, Teams} from '../api/epl.js';
import AccountsUIWrapper from './AccountsUIWrapper.js';
import Nav from './Nav.js';
import Countdown from 'react-countdown-now';
import { Meteor } from 'meteor/meteor';
import { Container,Menu,Card,Segment,Grid,Icon,Header } from 'semantic-ui-react'
// import {League} from "../api/epl";


function Home(props) {


    return (

        <div style={{padding: '20px'}}>

            <div>
                {/*<Menu pointing secondary>*/}
                    {/*<Menu.Menu>*/}
                        {/*<Menu.Item*/}
                            {/*name='friends'>*/}
                            {/*<AccountsUIWrapper />*/}
                        {/*</Menu.Item>*/}


                    {/*</Menu.Menu>*/}


                {/*</Menu>*/}
                <Nav/>

            </div>
<h3>{props.currentTeam[0].teamName}</h3>
            <div style={{margin: "50px"}}>
                <Grid stackable columns={3}>
                    <Grid.Column>
                        <a href='/Draft'>
                            {/*<Segment*/}
                                {/*style={{textAlign: "center", backgroundColor: '#37033b', color: 'white'}}>*/}
                                {/*<Icon.Group size='huge'>*/}
                                    {/*<Icon size='big' name='circle outline'/>*/}
                                    {/*<Icon name='handshake'/>*/}
                                {/*</Icon.Group>*/}
                                {/*<h3>Draft Room</h3>*/}
                            {/*</Segment>*/}
                            <Segment style={{}} clearing>
                                <Header as='h2' icon textAlign='center'>
                                    <Icon name='handshake outline' circular/>
                                    <Header.Content>Draft Room</Header.Content>
                                </Header>
                            </Segment>
                        </a>
                    </Grid.Column>
                    <Grid.Column>
                        <a href="/Team">
                            <Segment style={{}} clearing>
                                <Header as='h2' icon textAlign='center'>
                                    <Icon name='clipboard outline' circular/>
                                    <Header.Content>Team</Header.Content>
                                </Header>
                            </Segment>
                            {/*<Segment*/}
                                {/*style={{textAlign: "center", backgroundColor: '#37033b', color: 'white'}}>*/}
                                {/*<Icon.Group size='huge'>*/}
                                    {/*<Icon size='big' name='circle outline'/>*/}
                                    {/*<Icon name='clipboard outline'/>*/}
                                {/*</Icon.Group>*/}
                                {/*<h3>Team</h3>*/}
                            {/*</Segment>*/}
                        </a>
                    </Grid.Column>
                    <Grid.Column>
                        <a href="#">
                            <Segment style={{}} clearing>
                                <Header as='h2' icon textAlign='center'>
                                    <Icon name='exchange' circular/>
                                    <Header.Content>Transfers</Header.Content>
                                </Header>
                            </Segment>
                            {/*<Segment*/}
                                {/*style={{textAlign: "center", backgroundColor: '#37033b', color: 'white'}}>*/}
                                {/*<Icon.Group size='huge'>*/}
                                    {/*<Icon size='big' name='circle outline'/>*/}
                                    {/*<Icon name='exchange'/>*/}
                                {/*</Icon.Group>*/}
                                {/*<h3>Transfers</h3>*/}
                            {/*</Segment>*/}
                        </a>
                    </Grid.Column>
                </Grid>
            </div>
        </div>

    );
}


export default withTracker(() => {
    // Meteor.subscribe('tasks');
    Meteor.subscribe('teams');

    return {
        currentUser: Meteor.user(),
        allTeams: Teams.find({}).fetch(),
        currentTeam: Teams.find({user: Meteor.user()._id}).fetch(),
    };
})(Home);