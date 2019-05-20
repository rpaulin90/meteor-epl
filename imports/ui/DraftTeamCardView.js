import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { Meteor } from 'meteor/meteor';
import Draft from "./Draft";
import {Teams} from "../api/epl";
import PlayerModal from './PlayerModal.js';
import {Container, Menu, Card, Segment, Grid, Icon, Button, Label, Table, Dropdown, List,Checkbox} from 'semantic-ui-react'


function DraftTeamCardView(props) {

    let allPlayersSelected = (teamsArr) => {

        return teamsArr.reduce(function (x, y) {

            return x.roster.concat(y.roster)

        })

    };

    let totalPlayer = function (roster, playersAPI) {

        let total = 0;

        for (x of roster) {

            total += playersAPI.find(function (element) {
                return element.id === x;
            }).now_cost

        }

        return total

    };

    return (
        <div>
            <Segment style={{height: '100%', overflow: 'auto'}}>
                <Label style={{marginBottom: '10px'}} ribbon>Total Team Cost:
                    ${totalPlayer((Teams.find({user: Meteor.user()._id}).fetch())[0].roster, props.eplInfo.elements)}</Label>
                <div>
                    {props.roster.map((player, index) =>
                        <Card key={player} style={{margin: 'auto', marginBottom: '10px'}}>
                            <Card.Content>
                                <Card.Header>
                                    <Label attached='top right'>{`Pick #${index + 1}`}</Label>
                                    <PlayerModal
                                        info={props.eplInfo.elements.filter(x => x.id === player)[0]}
                                        team={props.eplInfo.teams.filter(x => x.code === props.eplInfo.elements.filter(x => x.id === player)[0].team_code)[0].name}
                                        owner={props.teams.filter(x => x.roster.includes(player))[0].teamName}/>

                                </Card.Header>
                                <Card.Meta>
                                                        <span
                                                            className='date'>{props.eplInfo.teams.filter(x => x.code === props.eplInfo.elements.filter(x => x.id === player)[0].team_code)[0].name}</span>
                                </Card.Meta>
                                <Card.Description>
                                    <List>
                                        <List.Item>
                                            <List.Icon name='dollar'/>
                                            <List.Content>{props.eplInfo.elements.filter(x => x.id === player)[0].now_cost}</List.Content>
                                        </List.Item>
                                        <List.Item>
                                            <List.Icon name='street view'/>
                                            <List.Content>{

                                                props.eplInfo.elements.filter(x => x.id === player)[0].element_type === 1 ?

                                                    'GK'

                                                    : props.eplInfo.elements.filter(x => x.id === player)[0].element_type === 2 ?

                                                    'DF'

                                                    :

                                                    props.eplInfo.elements.filter(x => x.id === player)[0].element_type === 3 ?

                                                        'MF'

                                                        :

                                                        props.eplInfo.elements.filter(x => x.id === player)[0].element_type === 4 ?

                                                            'FW'

                                                            :

                                                            ''

                                            }</List.Content>
                                        </List.Item>
                                        <List.Item>
                                            <List.Icon name='newspaper outline'/>
                                            <List.Content>{props.eplInfo.elements.filter(x => x.id === player)[0].news}</List.Content>
                                        </List.Item>
                                    </List>
                                </Card.Description>
                            </Card.Content>
                        </Card>
                    )}
                </div>

            </Segment>
        </div>
    )
}

export default DraftTeamCardView
