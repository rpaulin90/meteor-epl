import React, {useState, useEffect} from 'react';
import {withTracker} from 'meteor/react-meteor-data';
// import { Tasks } from '../api/tasks.js';
import {League} from '../api/epl.js';
import {Teams} from '../api/epl.js';
import AccountsUIWrapper from './AccountsUIWrapper.js';
import {Meteor} from 'meteor/meteor';
import { Button, Header, Image, Modal,List,Grid } from 'semantic-ui-react'


function PlayerModal(props) {

    const [playerAPIInfo, setPlayerAPIInfo] = useState('');
    const [apiCalled, setApiCalled] = useState(false);

    // useEffect(() => {
    //
    //     async function fetchData() {
    //         await setApiCalled(true);
    //         await Meteor.call("returnPlayerAPIHTTP",props.info.id, (err, res) => {
    //             //setPlayerAPIInfo(res.data);
    //             console.log(props.info.id)
    //         })
    //     }
    //
    //     fetchData();
    //
    // }, []); // Only re-run the effect if setAPiCalled is false

    let getPlayerInfo = (player_id) => {

        console.log(player_id)
        // async function fetchData() {
        //     await Meteor.call("returnPlayerAPIHTTP",player_id, (err, res) => {
        //         //setPlayerAPIInfo(res.data);
        //         console.log(res.data)
        //     })
        // }
        //
        // fetchData();

    }

    return (
    <Modal onOpen={()=> {
        Meteor.call("returnPlayerAPIHTTP",props.info.id, (err, res) => {
                 setPlayerAPIInfo(res.data);
                 console.log(res.data)
             })}
    } trigger={<a style={{cursor: 'pointer'}}>{props.info.web_name}</a>}>
        <Modal.Header>

            <Grid>
                <Grid.Row>
                    <Grid.Column style={{fontSize: '200%', margin: 'auto'}} textAlign='center' width={3}>
                        {`${props.info.squad_number}`}
                    </Grid.Column>
                    <Grid.Column style={{margin: 'auto'}} width={10}>
                        {`${props.info.first_name} ${props.info.second_name}`}
                    </Grid.Column>
                    <Grid.Column width={3}>
                        <Image wrapped size='tiny'
                               src={`https://platform-static-files.s3.amazonaws.com/premierleague/badges/t${props.info.team_code}.svg`}/>
                    </Grid.Column>
                </Grid.Row>
            </Grid>

        </Modal.Header>
        <Modal.Content image>
            <Image wrapped size='medium'
                   src={`https://platform-static-files.s3.amazonaws.com/premierleague/photos/players/110x140/p${props.info.code}.png`}/>
            <Modal.Description>
                <List>
                    <List.Item>
                        {props.owner ? <List.Content style={{color: 'blue'}}>{`Owner: ${props.owner}`}</List.Content>
                            :

                            <List.Content
                                style={{color: 'red'}}>{`Owner: ${props.owner ? props.owner : 'No Owner'}`}</List.Content>

                        }

                    </List.Item>
                    <List.Item>
                        <List.Content>{`Team: ${props.team}`}</List.Content>
                    </List.Item>
                    <List.Item>
                        <List.Content>{`Cost: $${props.info.now_cost}`}</List.Content>
                    </List.Item>
                    <List.Item>
                        <List.Content>
                            {`Position: ${
                                props.info.element_type === 1 ?

                                    'Goalkeeper'

                                    : props.info.element_type === 2 ?

                                    'Defender'

                                    :

                                    props.info.element_type === 3 ?

                                        'Midfielder'

                                        :

                                        props.info.element_type === 4 ?

                                            'Forward'

                                            :

                                            ''
                                }`}
                        </List.Content>
                    </List.Item>
                    <List.Item>
                        <List.Content>{`News: ${props.info.news}`}</List.Content>
                    </List.Item>
                    <List.Item>
                        <List.Content>{`Selected by ${props.info.selected_by_percent}% of users`}</List.Content>
                    </List.Item>
                    {
                        playerAPIInfo === '' ? '' :

                            <List.Item>
                                <List.Content>{playerAPIInfo.fixtures[0]}</List.Content>
                            </List.Item>

                    }
                </List>
            </Modal.Description>
        </Modal.Content>
    </Modal>
    )
}

export default PlayerModal
