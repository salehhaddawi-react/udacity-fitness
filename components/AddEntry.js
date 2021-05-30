import React, {useState} from "react";
import {View, Text, TouchableOpacity, Button} from "react-native";
import {getMetricMetaInfo, timeToString} from "../utils/helpers";
import UdacitySlider from "./UdacitySlider";
import UdacitySteppers from "./UdacitySteppers";
import DateHeader from "./DateHeader";
import TextButton from "./TextButton";
import {Ionicons} from "@expo/vector-icons";

export default function AddEntry(props) {
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

        // TODO: navigate to home

        // TODO: save to DB

        // TODO: clear local notifications
    }

    const reset = () => {
        const key = timeToString();

        // TODO: update Redux

        // TODO: navigate to home

        // TODO: update DB
    }

    const metaInfo = getMetricMetaInfo();

    if (props.alreadyLogged) {
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
            <Text>{JSON.stringify(state)}</Text>
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
