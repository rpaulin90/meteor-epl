import React, { Component } from 'react'
import { Menu, Segment,Icon } from 'semantic-ui-react'
import {Meteor} from "meteor/meteor";
import {Teams} from "../api/epl";
import { Link } from 'react-router-dom'
import AccountsUIWrapper from './AccountsUIWrapper.js';


function Nav(props) {




    return (
        <div>
            <Menu compact icon='labeled'>
                <Menu.Item>
                    <Icon name='home' />
                    <Link to={'/'}>Home</Link>
                </Menu.Item>

                <Menu.Item
                >
                    <Icon name='user circle outline' />
                    <AccountsUIWrapper />
                </Menu.Item>

            </Menu>

        </div>
    )
}

export default Nav

