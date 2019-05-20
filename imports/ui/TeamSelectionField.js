import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { Meteor } from 'meteor/meteor';
import Draft from "./Draft";
import {Teams} from "../api/epl";
import PlayerModal from './PlayerModal.js';
import {Container, Menu, Card, Segment, Grid, Icon, Button, Label, Table, Dropdown, List,Image,Checkbox} from 'semantic-ui-react'


function TeamSelectionField(props) {


    let totalPlayer = function (roster, playersAPI) {

        let total = 0;

        for (x of roster) {

            total += playersAPI.find(function (element) {
                return element.id === x;
            }).now_cost

        }

        return total

    };

    let numberPerPosition = (arr) => {

        let counts = {};
        arr.forEach(function(x) { counts[`position_${x.element_type}`] = (counts[`position_${x.element_type}`] || 0)+1; });
        console.log(arr)
        console.log(counts)
        return counts
    }

    let teamArray = (myRoster,elementsFromApi) => {

        return elementsFromApi.filter((player) => myRoster.includes(player.id))

    }

    return (
        <div>
            <Segment style={{overflow: 'auto',backgroundSize: 'cover',backgroundImage:'url(https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Soccer_Field_Transparant.svg/1200px-Soccer_Field_Transparant.svg.png)',backgroundPosition:'center' }}>
                <Label style={{marginBottom: '10px'}} ribbon>Total Team Cost:
                    ${totalPlayer((Teams.find({user: Meteor.user()._id}).fetch())[0].roster, props.eplInfo.elements)}</Label>
                <div style={{textAlign: 'center'}}>
                    <Grid>
                        <Grid.Row columns={numberPerPosition(teamArray(props.roster,props.eplInfo.elements)).position_1}>
                            {teamArray(props.roster,props.eplInfo.elements).filter(x => x.element_type === 1).map((player, index) =>

                                <Grid.Column key={player.id}>
                                    <div>
                                        <Image style={{textAlign: '-webkit-center'}} wrapped size='tiny' src={`https://platform-static-files.s3.amazonaws.com/premierleague/photos/players/110x140/p${player.code}.png`}/>
                                    </div>
                                    <Label style={{marginTop: '3px',color:'white',backgroundColor:'teal'}} basic>
                                        <PlayerModal
                                            info={player}
                                            team={props.eplInfo.teams.filter(x => x.code === props.eplInfo.elements.filter(x => x.id === player.id)[0].team_code)[0].name}
                                            owner={props.teams.filter(x => x.roster.includes(player.id))[0].teamName}/>
                                    </Label>
                                    <div style={{marginTop: '5px'}}>
                                        <Button circular color='red' icon='close' onClick={() => props.removePlayer(player.id)}/>
                                    </div>
                                </Grid.Column>
                            )}

                        </Grid.Row>

                        <Grid.Row columns={numberPerPosition(teamArray(props.roster,props.eplInfo.elements)).position_2}>
                            {teamArray(props.roster,props.eplInfo.elements).filter(x => x.element_type === 2).map((player, index) =>

                                <Grid.Column key={player.id}>
                                    <div>
                                        <Image style={{textAlign: '-webkit-center'}} wrapped size='tiny'
                                               src={`https://platform-static-files.s3.amazonaws.com/premierleague/photos/players/110x140/p${player.code}.png`}/>
                                    </div>
                                    <Label style={{marginTop: '3px',color:'white',backgroundColor:'teal'}} basic>
                                        <PlayerModal
                                            info={player}
                                            team={props.eplInfo.teams.filter(x => x.code === props.eplInfo.elements.filter(x => x.id === player.id)[0].team_code)[0].name}
                                            owner={props.teams.filter(x => x.roster.includes(player.id))[0].teamName}/>
                                    </Label>
                                    <div style={{marginTop: '5px'}}>
                                        <Button circular color='red' icon='close' onClick={() => props.removePlayer(player.id)}/>
                                    </div>
                                </Grid.Column>
                            )}
                        </Grid.Row>

                        <Grid.Row columns={numberPerPosition(teamArray(props.roster,props.eplInfo.elements)).position_3}>
                            {teamArray(props.roster,props.eplInfo.elements).filter(x => x.element_type === 3).map((player, index) =>

                                <Grid.Column key={player.id}>
                                    <div>
                                        <Image style={{textAlign: '-webkit-center'}} wrapped size='tiny'
                                               src={`https://platform-static-files.s3.amazonaws.com/premierleague/photos/players/110x140/p${player.code}.png`}/>
                                    </div>
                                    <Label style={{marginTop: '3px',color:'white',backgroundColor:'teal'}} basic>
                                        <PlayerModal
                                            info={player}
                                            team={props.eplInfo.teams.filter(x => x.code === props.eplInfo.elements.filter(x => x.id === player.id)[0].team_code)[0].name}
                                            owner={props.teams.filter(x => x.roster.includes(player.id))[0].teamName}/>
                                    </Label>
                                    <div style={{marginTop: '5px'}}>
                                        <Button circular color='red' icon='close' onClick={() => props.removePlayer(player.id)}/>
                                    </div>
                                </Grid.Column>
                            )}
                        </Grid.Row>

                        <Grid.Row columns={numberPerPosition(teamArray(props.roster,props.eplInfo.elements)).position_4}>
                            {teamArray(props.roster,props.eplInfo.elements).filter(x => x.element_type === 4).map((player, index) =>

                                <Grid.Column key={player.id}>
                                    <div>
                                        <Image style={{textAlign: '-webkit-center'}} wrapped size='tiny'
                                               src={`https://platform-static-files.s3.amazonaws.com/premierleague/photos/players/110x140/p${player.code}.png`}/>
                                    </div>
                                    <Label style={{marginTop: '3px',color:'white',backgroundColor:'teal'}} basic>
                                        <PlayerModal
                                            info={player}
                                            team={props.eplInfo.teams.filter(x => x.code === props.eplInfo.elements.filter(x => x.id === player.id)[0].team_code)[0].name}
                                            owner={props.teams.filter(x => x.roster.includes(player.id))[0].teamName}/>
                                    </Label>
                                    <div style={{marginTop: '5px'}}>
                                        <Button circular color='red' icon='close' onClick={() => props.removePlayer(player.id)}/>
                                    </div>
                                </Grid.Column>
                            )}
                        </Grid.Row>

                    </Grid>

                </div>

            </Segment>
        </div>
    )
}

export default TeamSelectionField
