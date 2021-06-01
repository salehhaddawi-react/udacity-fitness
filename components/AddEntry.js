import React, {useState} from "react";
import {View, Text, Button} from "react-native";
import {getDailyReminderMessage, getMetricMetaInfo, timeToString} from "../utils/helpers";
import UdacitySlider from "./UdacitySlider";
import UdacitySteppers from "./UdacitySteppers";
import DateHeader from "./DateHeader";
import TextButton from "./TextButton";
import {Ionicons} from "@expo/vector-icons";
import {removeEntry, submitEntry} from "../utils/api";
import {useDispatch, useSelector} from "react-redux";
import {addEntry} from "../actions";

export default function AddEntry() {
    const dispatch = useDispatch();

    const alreadyLoggedEntry = () => {
        const entries = useSelector((state) => state);

        const key = timeToString();

        return entries[key] && typeof entries[key].today === 'undefined';
    }

    const [state, setState] = useState({
        run: 0,
        bike: 0,
        swim: 0,
        sleep: 0,
        eat: 0
    });

    const increment = (metric) => {
        const {max, step} = getMetricMetaInfo(metric);

        const count = state[metric] + step;

        setState((prevState) => ({
            ...prevState,
            [metric]: count > max ? max : count
        }))
    }

    const decrement = (metric) => {
        const {step} = getMetricMetaInfo(metric);

        const count = state[metric] - step;

        setState((prevState) => ({
            ...prevState,
            [metric]: count < 0 ? 0 :  count
        }))
    }

    const slide = (metric, value) => {
        setState({
            ...state,
            [metric]: value
        });
    }

    const submit = () => {
        const key = timeToString();
        const entry = state;

        setState({
            run: 0,
            bike: 0,
            swim: 0,
            sleep: 0,
            eat: 0
        });

        // TODO: update Redux
        dispatch(addEntry({
            [key]: entry
        }));

        // TODO: navigate to home

        // TODO: save to 'DB'
        submitEntry({ entry, key });

        // TODO: clear local notifications
    }

    const reset = () => {
        const key = timeToString();

        // TODO: update Redux
        dispatch(addEntry({
            [key]: getDailyReminderMessage()
        }));

        // TODO: navigate to home

        // TODO: update 'DB'
        removeEntry(key);
    }

    const metaInfo = getMetricMetaInfo();

    if (alreadyLoggedEntry()) {
        return (
            <View>
                <Ionicons name="ios-happy-outline" size={100} />
                <Text>You already Logged your data for today</Text>
                <TextButton onPress={reset}>
                    Reset
                </TextButton>
            </View>
        );
    }

    return (
        <View>
            <DateHeader date={new Date().toLocaleDateString()}/>
            {Object.keys(metaInfo).map(key => {
                const {getIcon, type, ...rest} = metaInfo[key];
                const value = state[key];

                return (
                    <View key={key}>
                        {getIcon()}
                        {type === 'slider' ?
                            <UdacitySlider value={value} onChange={(val) => slide(key, val)} {...rest}/> :
                            <UdacitySteppers value={value} onIncrement={() => increment(key)} onDecrement={() => decrement(key)} {...rest} />
                        }
                    </View>
                )
            })}
            <Button onPress={submit} title={'Submit'}/>
        </View>
    );
}
