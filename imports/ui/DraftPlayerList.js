import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { Meteor } from 'meteor/meteor';
import Draft from "./Draft";
import {Teams} from "../api/epl";
import PlayerModal from './PlayerModal.js';
import {Container, Menu, Card, Segment, Grid, Icon, Button, Label, Table, Dropdown, List} from 'semantic-ui-react'


function DraftPlayerList(props) {

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

        return total / 10

    };

    function selectPlayer(id, league, teams) {

        let args = {
            id,
            league,
            teams
        };

        Meteor.call('choose.player', args)

    }


    return (
        <div style={{height: '100%'}}>
            <div style={{height: '100%', overflow: 'auto',fontSize:'smaller'}}>
                <Table unstackable>
                    <Table.Body>
                        <Table.Row>
                            <Table.Cell/>
                            <Table.Cell>Player</Table.Cell>
                            <Table.Cell>Pos</Table.Cell>
                            <Table.Cell>Cost</Table.Cell>
                        </Table.Row>
                        {props.eplInfo.elements.filter(x => props.filterTeam === 'all' ? true : x.team_code === props.filterTeam).map((player) =>
                            <Table.Row key={player.id}>

                                {/*if

                                    - league has started
                                    - it's the user's turn
                                    - the player from elements array has not been selected
                                    - the cost from the player from elements array would not take the user's total team's cost over $100

                                    then show a button to be able to select the player

                                    else if

                                    - the player from elements array has been selected

                                    show the name of the team that owns that player

                                    else

                                    show nothing

                                    */}

                                <Table.Cell width={2}>
                                    {
                                        props.league == undefined ? '' :

                                            props.league.userOnTurn === props.currentUser._id && !allPlayersSelected(props.teams).includes(player.id) && (totalPlayer(props.roster, props.eplInfo.elements) + player.now_cost) <= 1000 ?

                                                <Button style={{margin: '3px'}}
                                                        onClick={() => selectPlayer(player.id, props.league, props.teams)}>
                                                    Select
                                                </Button>

                                                : allPlayersSelected(props.teams).includes(player.id) ?

                                                `${props.teams.filter(x => x.roster.includes(player.id))[0].teamName}`

                                                :

                                                ''
                                    }
                                </Table.Cell>
                                <Table.Cell width={2}>
                                    <PlayerModal
                                        info={props.eplInfo.elements.filter(x => x.id === player.id)[0]}
                                        team={props.eplInfo.teams.filter(x => x.code === props.eplInfo.elements.filter(x => x.id === player.id)[0].team_code)[0].name}
                                        owner={props.teams.filter(x => x.roster.includes(player.id)).length > 0 ? props.teams.filter(x => x.roster.includes(player.id))[0].teamName : ''}/>
                                </Table.Cell>
                                <Table.Cell width={2}>{
                                    player.element_type === 1 ?

                                        'GK'

                                        : player.element_type === 2 ?

                                        'DF'

                                        :

                                        player.element_type === 3 ?

                                            'MF'

                                            :

                                            player.element_type === 4 ?

                                                'FW'

                                                :

                                                ''
                                }</Table.Cell>
                                <Table.Cell width={2}>{`$${player.now_cost}`}</Table.Cell>
                            </Table.Row>
                        )}
                    </Table.Body>
                </Table>
            </div>
        </div>
    )
}

export default DraftPlayerList
