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
import TeamSelectionField from './TeamSelectionField.js';
import Nav from './Nav.js';
import Countdown from 'react-countdown-now';
import {Meteor} from 'meteor/meteor';
import {Container, Menu, Card, Segment, Grid, Icon, Button, Label, Table, Dropdown, List,Checkbox,Message,Header,Image} from 'semantic-ui-react'


function Team(props) {

    const [eplInfo, setEplInfo] = useState('');

    const [filterTeam, setFilterTeam] = useState('all');

    const [teamView, setTeamView] = useState(true);

    const [firstTeam, setFirstTeam] = useState([]);


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

    let makeFormation = (team) => {
        let gk = 0
        let df = 0
        let md = 0
        let fw = 0
        let firstTeam = []
        let bench = []

        for(let player of team){

            if(player.type === 1){
                if(gk===0){
                    gk++
                    firstTeam.push(player)
                }else{
                    bench.push(player)
                }

            }else if(player.type === 2){
                if(df<=4 && firstTeam.length <= 10){
                    df++
                    firstTeam.push(player)
                }else{
                    bench.push(player)
                }

            }else if(player.type === 3){
                if(md<=4 && firstTeam.length <= 10){
                    md++
                    firstTeam.push(player)
                }else{
                    bench.push(player)
                }

            }else if(player.type === 4){
                if(fw<=2 && firstTeam.length <= 10){
                    fw++
                    firstTeam.push(player)
                }else{
                    bench.push(player)
                }

            }

        }

        return {
            gk,df,md,fw,firstTeam,bench
        }

    }

    let addOrUpdateTeam = (player) => {

        Meteor.call('select.player.from.bench', player)

        // setFirstTeam([...firstTeam,player])
        //
        // return firstTeam

    }


    let removePlayerFromFirstTeam = (player) => {

        console.log('working ' + player)
        Meteor.call('remove.player.from.firstTeam', player)

        // setFirstTeam([...firstTeam,player])
        //
        // return firstTeam

    }

    let doubleKeeper = (allPlayers,player,firstTeam) => {

        let oneKeeper = (firstTeam, allPlayers) => {

            let arr = []

            for(let x of firstTeam){

                if(allPlayers.filter(y => y.id === x)[0].element_type === 1){
                    arr.push(x)
                }

            }

           return arr.length === 1

        }

        let isKeeper = (allPlayers,player) => {

            return allPlayers.filter(x => x.id === player)[0].element_type === 1

        }

        //console.log('truth! ' + !!(oneKeeper(firstTeam,allPlayers) && isKeeper(allPlayers, player)))

        return !!(oneKeeper(firstTeam,allPlayers) && isKeeper(allPlayers, player));



    }

    let noKeeperAndTenPlayers = (allPlayers,player,firstTeam) => {

        let noKeeper = (firstTeam, allPlayers) => {

            let arr = []

            for(let x of firstTeam){

                if(allPlayers.filter(y => y.id === x)[0].element_type === 1){
                    arr.push(x)
                }

            }

            return arr.length === 0

        }

        let isNotKeeper = (allPlayers,player) => {

            return allPlayers.filter(x => x.id === player)[0].element_type !== 1

        }

        //console.log('truth! ' + !!(oneKeeper(firstTeam,allPlayers) && isKeeper(allPlayers, player)))

        return !!(firstTeam.length === 10 && noKeeper(firstTeam,allPlayers) && isNotKeeper(allPlayers, player));



    }



    return (

        <div style={{padding: '20px'}}>
            <Nav/>
            <Segment style={{border:'none',boxShadow: 'none'}} clearing>
                <Header as='h2' icon textAlign='center'>
                    <Icon name='clipboard outline' circular/>
                    <Header.Content>Team</Header.Content>
                </Header>
            </Segment>


            {   eplInfo === null ? 'game being updated' :
                eplInfo !== '' && props.league[0] !== undefined

                ?


                <div>
                    <div>
                        <label>

                        </label>
                    </div>
                    <Grid stackable>
                        <Grid.Row columns={2}>
                            <Grid.Column>
                                <TeamSelectionField
                                    eplInfo={eplInfo}
                                    league={props.league[0]}
                                    currentUser={props.currentUser}
                                    teams={props.teams}
                                    roster={(Teams.find({user: Meteor.user()._id}).fetch())[0].firstTeam}
                                    removePlayer={removePlayerFromFirstTeam}
                                />
                            </Grid.Column>
                            <Grid.Column>
                                <List divided verticalAlign='middle'>

                                    {(Teams.find({user: Meteor.user()._id}).fetch())[0].bench.map((player) => {

                                        return (<List.Item key={player}>
                                            <List.Content floated='right'>
                                                {doubleKeeper(eplInfo.elements,player,(Teams.find({user: Meteor.user()._id}).fetch())[0].firstTeam) || noKeeperAndTenPlayers(eplInfo.elements,player,(Teams.find({user: Meteor.user()._id}).fetch())[0].firstTeam) || (Teams.find({user: Meteor.user()._id}).fetch())[0].firstTeam.length === 11 ?
                                                    <Button disabled>Select</Button>
                                                    :
                                                    <Button positive onClick={() => addOrUpdateTeam(player)}>Select</Button>
                                                }
                                            </List.Content>
                                            <Image avatar size='tiny' src={`https://platform-static-files.s3.amazonaws.com/premierleague/photos/players/110x140/p${eplInfo.elements.filter(x => x.id === player)[0].code}.png`} />
                                            <List.Content><PlayerModal
                                                info={eplInfo.elements.filter(x => x.id === player)[0]}
                                                team={eplInfo.teams.filter(x => x.code === eplInfo.elements.filter(x => x.id === player)[0].team_code)[0].name}
                                                owner={props.teams.filter(x => x.roster.includes(player))[0].teamName}/></List.Content>

                                        </List.Item>)

                                        })}

                                </List>
                            </Grid.Column>
                        </Grid.Row>
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
})(Team);