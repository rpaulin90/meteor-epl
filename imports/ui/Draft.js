import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom'
import {withTracker} from 'meteor/react-meteor-data';
import Toggle from 'react-toggle'
// import { Tasks } from '../api/tasks.js';
import {League} from '../api/epl.js';
import {Teams} from '../api/epl.js';
import AccountsUIWrapper from './AccountsUIWrapper.js';
import PlayerModal from './PlayerModal.js';
import Counter from './DraftCountdown.js';
import DraftPlayerList from './DraftPlayerList.js';
import DraftTeamCardView from './DraftTeamCardView.js';
import DraftTeamFieldView from './DraftTeamFieldView.js';
import Nav from './Nav.js';
import Countdown from 'react-countdown-now';
import {Meteor} from 'meteor/meteor';
import {Container, Menu, Card, Segment, Grid, Icon, Button, Label, Table, Dropdown, List,Checkbox,Message,Header} from 'semantic-ui-react'
import Team from "./Team";


function Draft(props) {

    const [eplInfo, setEplInfo] = useState('');

    const [filterTeam, setFilterTeam] = useState('all');

    const [teamView, setTeamView] = useState(true);


    useEffect(() => {

        async function fetchData() {

            await Meteor.call("returnHTTP", (err, res) => {
                setEplInfo(res.data);
                console.log(res.data)
            })
        }

        fetchData();

    }, []);


    function selectPlayer(id, league, teams) {

        let args = {
            id,
            league,
            teams
        };

        Meteor.call('choose.player', args)

    }


    let startDraft = (users) => {


        Meteor.call('start.draft', users)


    };

    //let skipToNextTurn = () => Meteor.call()

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

    let amINext = function (currentTurn, draftOrder, myId) {

        return (draftOrder[currentTurn + 1]._id === myId)
    };

    let currentTurnIsOutOfMoney = function (roster, players) {

        if (!players) {
            return false
        } else {

            return (!players.find(player => totalPlayer(roster, players) + (player.now_cost) <= 1000))
        }

    };

    let skipToNextTurn = () => Meteor.call('next.turn')


    let handleDomainsSelectChange = (e, data) => setFilterTeam(data.value);

    let dropDownTeams = (teamsArray) => {

        let dropDownArr = [];

        dropDownArr.push({
            key: 'all',
            text: 'All Teams',
            value: 'all',
        })

        for (let team of teamsArray) {

            dropDownArr.push({
                key: team.id,
                text: team.name,
                value: team.code,
            })

        }

        return dropDownArr

    }


    return (

        <div style={{padding: '20px'}}>
            <Nav/>
            <Segment style={{border:'none',boxShadow: 'none'}} clearing>
                <Header as='h2' icon textAlign='center'>
                    <Icon name='handshake outline' circular/>
                    <Header.Content>The Draft Room</Header.Content>
                </Header>
            </Segment>

            {props.league[0] === undefined

                ?


                <div>
                    <Button onClick={() => startDraft(props.users)}>start draft</Button>

                </div>


                :


                ''


            }
            {/* if current user for current turn can't choose a player that will not take him over $100, then the next user in line should be able to select if they are ready to pick their next player or wait for the timer to end to get to their turn*/}


            {
                props.league[0] === undefined ? '' :

                    !!props.league.length && props.league[0].userOnTurn !== props.currentUser._id && (props.league[0].turnNumber < props.league[0].draftOrder.length - 1) && (amINext(props.league[0].turnNumber, props.league[0].draftOrder, props.currentUser._id) || (amINext(props.league[0].turnNumber + 1, props.league[0].draftOrder, props.currentUser._id) && props.league[0].draftOrder[props.league[0].turnNumber + 1]._id === props.league[0].userOnTurn)) && currentTurnIsOutOfMoney(props.teams.find(x => x.user === props.league[0].userOnTurn).roster, eplInfo.elements) ?

                        <Button onClick={() => skipToNextTurn()}>Skip</Button>

                        :

                        ''

            }

            {
                props.league[0] === undefined ? '' :



                    !!props.league.length && (props.league[0].turnNumber === props.league[0].draftOrder.length) ?


                            <Message info>
                                <Message.Header>The draft has ended</Message.Header>
                                <Link to={'/Team'}>You may now set up your lineup for the next gameweek</Link>
                            </Message>


                        :
                        ''
            }

            {eplInfo === null ? 'game being updated' :
                eplInfo !== ''

                ?


                <div>
                    <Grid>
                        <Grid.Row columns={2}>
                            <Grid.Column>
                                <Dropdown
                                    style={{margin: '15px 0', width: '90%'}}
                                    placeholder='Select a Team'
                                    fluid
                                    selection
                                    options={dropDownTeams(eplInfo.teams)}
                                    value={filterTeam}
                                    onChange={handleDomainsSelectChange}/>
                            </Grid.Column>
                            <Grid.Column>
                                {props.league[0] === undefined

                                    ?


                                    ''


                                    :

                                    <Segment style={{border:'none',boxShadow: 'none'}} clearing>
                                        <Header as='h2' floated='right'>

                                            <Icon name='dollar' />

                                            <Header.Content>
                                                {eplInfo != '' ? `${1000-totalPlayer((Teams.find({user: Meteor.user()._id}).fetch())[0].roster,eplInfo.elements)}` : ''}
                                            </Header.Content>

                                            <Icon name='ellipsis vertical' />
                                            <Icon name='stopwatch' />
                                            <Header.Content>
                                                <Counter startTimeMS={props.league[0].startTimeMS} userOnTurn={props.league[0].userOnTurn}/>
                                            </Header.Content>
                                        </Header>

                                    </Segment>


                                }
                            </Grid.Column>
                        </Grid.Row>

                    </Grid>



                    <Grid stackable columns={2}>

                        <Grid.Column width={6} style={{minHeight: '750px', height: '100vh', overflow: 'auto'}}>

                            <DraftPlayerList
                                eplInfo={eplInfo}
                                league={props.league[0]}
                                currentUser={props.currentUser}
                                teams={props.teams}
                                roster={(Teams.find({user: Meteor.user()._id}).fetch())[0].roster}
                                filterTeam={filterTeam}
                            />

                        </Grid.Column>
                        <Grid.Column width={10} style={{minHeight: '750px', height: '100vh', overflow: 'auto'}}>
                            <div style={{height: '100%', overflow: 'auto'}}>
                                <div>
                                    {/*{teamView ? <Icon size='large' style={{marginLeft: '5px',display: 'contents'}} name='list'/> : <Icon size='large' style={{marginLeft: '5px',display: 'contents'}} name='users'/> }*/}
                                    <label>
                                        <Toggle
                                            defaultChecked={teamView}
                                            icons={{
                                                checked: <Icon style={{position: 'absolute',top: '0.4em'}} name='list'/>,
                                                unchecked: <Icon style={{position: 'absolute',top: '0.4em',right: '-0.4em',color:'limegreen'}} name='users'/> ,
                                            }}
                                            onChange={() => setTeamView(!teamView)} />
                                        {/*<span>Custom icons</span>*/}
                                    </label>
                                    {/*<Checkbox style={{marginLeft: '5px'}} toggle onChange={() => setTeamView(!teamView)} />*/}
                                </div>
                                {
                                    teamView ?

                                        <DraftTeamCardView
                                            eplInfo={eplInfo}
                                            league={props.league[0]}
                                            currentUser={props.currentUser}
                                            teams={props.teams}
                                            roster={(Teams.find({user: Meteor.user()._id}).fetch())[0].roster}
                                            filterTeam={filterTeam}
                                        />

                                        :

                                        <DraftTeamFieldView
                                            eplInfo={eplInfo}
                                            league={props.league[0]}
                                            currentUser={props.currentUser}
                                            teams={props.teams}
                                            roster={(Teams.find({user: Meteor.user()._id}).fetch())[0].roster}
                                            filterTeam={filterTeam}
                                        />

                                }


                            </div>



                        </Grid.Column>
                    </Grid>
                </div>


                :

                ''

            }
        </div>

    );
}


export default withTracker(() => {
    // Meteor.subscribe('tasks');
    Meteor.subscribe('league');
    Meteor.subscribe('teams');

    return {
        league: League.find({}, {sort: {createdAt: -1}}).fetch(),
        currentUser: Meteor.user(),
        users: Meteor.users.find().fetch(),
        teams: Teams.find({}).fetch(),
        //userTeam: Teams.find({user: Meteor.user()._id}).fetch()
    };
})(Draft);