import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { Meteor } from 'meteor/meteor';

function Counter(props) {
    const [count, setCount] = useState(60);
    const [delay, setDelay] = useState(1000);
    const [isRunning, setIsRunning] = useState(props.userOnTurn);

    useInterval(() => {
        setIsRunning(props.userOnTurn)
        // Your custom logic here
        if(count > 0){
            setCount(Math.floor((60000 - ( (new Date()).getTime() - props.startTimeMS ))/1000))
        }
        else{setCount(60)}

        //setCount(count + 1);
        //setCount(Math.floor((60000 - ( (new Date()).getTime() - props.startTimeMS ))/1000))
    }, isRunning ? delay : null);

    return <h1>{count}</h1>;
}

function useInterval(callback, delay) {
    const savedCallback = useRef();

    // Remember the latest function.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        function tick() {
            savedCallback.current();
        }
        if (delay !== null) {
            let id = Meteor.setInterval(tick, delay);
            if(delay === 'none'){Meteor.clearInterval(id);}
            return () => Meteor.clearInterval(id);
        }

    }, [delay]);
}

export default Counter
