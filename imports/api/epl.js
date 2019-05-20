import { HTTP } from 'meteor/http'
import { Meteor } from 'meteor/meteor';
import {check} from "meteor/check";
import {Mongo} from "meteor/mongo";
import { AccountsCommon } from 'meteor/accounts-base'
var generateName = require('sillyname');


export const Teams = new Mongo.Collection('teams');
export const League = new Mongo.Collection('league');

if (Meteor.isServer) {
    // This code only runs on the server
    // Only publish tasks that are public or belong to the current user
    Meteor.publish('teams', function playerPublication() {
        return Teams.find({})
    });
    insertTeamDetails = function(userId){
        var TeamDetails = {
            user:userId,
            roster:[],
            firstTeam:[],
            bench:[],
            teamName:generateName().concat(`s`)
        }

        Teams.insert(TeamDetails,function(error,result){
            if(error){
                console.log(error);
            }else{
                console.log(result);
            }
        });
    }

    Accounts.onCreateUser(function(options,user){
        var userId = user._id;
        insertTeamDetails(userId);
        return user;
    });


}

let myVar;

Meteor.methods({
    returnHTTP(args) {
        if (Meteor.isServer) {
            return HTTP.call('GET', 'https://fantasy.premierleague.com/drf/bootstrap-static')
        }
    },

    returnPlayerAPIHTTP(player_id) {

        if (Meteor.isServer) {
            return HTTP.call('GET', `https://fantasy.premierleague.com/drf/element-summary/${player_id}`)
            //console.log(player_id)
        }
    },

    'setTimer'(){

        if (Meteor.isServer) {
            myVar = Meteor.setTimeout(function(){ console.log(("Hello")) }, 3000);
        }

    },
    'keep.going'(){

        if (Meteor.isServer) {
            Meteor.clearTimeout(myVar);
            let league_ = League.find({}, {sort: {createdAt: -1}}).fetch()


            myVar = Meteor.setTimeout(function () {

                if(league_[0].turnNumber === league_[0].draftOrder.length-1){
                    League.update({_id: league_[0]._id}, {
                        $set: {
                            turnNumber: league_[0].turnNumber + 1,
                            userOnTurn: false
                        }
                    });

                }
                if(league_[0].turnNumber < league_[0].draftOrder.length-1){

                    let startTime = (new Date()).getTime()
                    League.update({_id: league_[0]._id}, {
                        $set: {
                            turnNumber: league_[0].turnNumber + 1,
                            userOnTurn: league_[0].draftOrder[league_[0].turnNumber + 1]._id,
                            startTimeMS: startTime
                        }
                    });
                    Meteor.call('keep.going')

                }

            }, 60000);
        }

    },

    'choose.player'(args) {
        if (Meteor.isServer) {
            Meteor.clearTimeout(myVar);

            if(args.league.turnNumber < args.league.draftOrder.length-1){
                let nextTurn = args.league.turnNumber + 1
                let startTime = (new Date()).getTime()

                League.update({_id: args.league._id}, {
                    $set: {
                        turnNumber: nextTurn,
                        userOnTurn: args.league.draftOrder[args.league.turnNumber + 1]._id,
                        startTimeMS: startTime
                    }
                });
                Meteor.call('keep.going')
            }
///
            // Make sure the user is logged in before inserting a task
            if (!this.userId) {
                throw new Meteor.Error('not-authorized');
            }

            Teams.update({user: this.userId}, {
                $push: {
                    roster: args.id,
                    bench: args.id
                }
            });

            // if(args.league.turnNumber < args.league.draftOrder.length-1){
            //     let nextTurn = args.league.turnNumber + 1
            //
            //     League.update({_id: args.league._id}, {
            //         $set: {
            //             turnNumber: nextTurn,
            //             userOnTurn: args.league.draftOrder[args.league.turnNumber + 1]._id,
            //             startTimeMS: (new Date()).getTime()
            //         }
            //     });
            //
            // }
            if(args.league.turnNumber === args.league.draftOrder.length-1){
                let nextTurn = args.league.turnNumber + 1

                League.update({_id: args.league._id}, {
                    $set: {
                        turnNumber: nextTurn,
                        userOnTurn: false
                    }
                });
            }

        }

    },

    'start.draft'(users){

        if (Meteor.isServer) {
            function shuffle(array) {
                let currentIndex = array.length, temporaryValue, randomIndex;

                // While there remain elements to shuffle...
                while (0 !== currentIndex) {

                    // Pick a remaining element...
                    randomIndex = Math.floor(Math.random() * currentIndex);
                    currentIndex -= 1;

                    // And swap it with the current element.
                    temporaryValue = array[currentIndex];
                    array[currentIndex] = array[randomIndex];
                    array[randomIndex] = temporaryValue;
                }

                return array;
            }

// Used like so

            let shuffles = shuffle(users)

            let arr = [].concat(shuffles);

            let reverseArr = [].concat(shuffles)

            let startTime = (new Date()).getTime()

            reverseArr.reverse()

            while(arr.length < (reverseArr.length*14)){

                arr = arr.concat(reverseArr);
                reverseArr.reverse()

            }

            League.insert({
                started: true,
                createdAt: new Date(),
                draftOrder: arr,
                userOnTurn: arr[0]._id,
                turnNumber: 0,
                startTimeMS: startTime

            });

            Meteor.call('keep.going')

        }

    },

    'next.turn'(){
        if (Meteor.isServer) {
            let league_ = League.find({}, {sort: {createdAt: -1}}).fetch()
            League.update({_id: league_[0]._id}, {
                $set: {
                    turnNumber: league_[0].turnNumber + 1,
                    userOnTurn: league_[0].draftOrder[league_[0].turnNumber + 1]._id,
                    nextTurnDate: (Date.now() + 60000)

                }
            });
            Meteor.call('keep.going')
        }
    },

    'select.player.from.bench'(player){
        if (Meteor.isServer) {
            if (!this.userId) {
                throw new Meteor.Error('not-authorized');
            }

            Teams.update({user: this.userId}, {
                $push: {
                    firstTeam: player
                },
                $pull: {
                    bench: player
                },
            });
        }
    },

    'remove.player.from.firstTeam'(player){
        if (Meteor.isServer) {
            if (!this.userId) {
                throw new Meteor.Error('not-authorized');
            }

            Teams.update({user: this.userId}, {
                $pull: {
                    firstTeam: player
                },
                $push: {
                    bench: player
                }
            });
        }
    }
})

