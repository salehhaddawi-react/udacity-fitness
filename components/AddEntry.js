import React, {useState} from "react";
import {View, Text, TouchableOpacity, Platform, StyleSheet} from "react-native";
import {
    clearLocalNotifications,
    getDailyReminderMessage,
    getMetricMetaInfo,
    setLocalNotification,
    timeToString
} from "../utils/helpers";
import UdacitySlider from "./UdacitySlider";
import UdacitySteppers from "./UdacitySteppers";
import DateHeader from "./DateHeader";
import TextButton from "./TextButton";
import {Ionicons} from "@expo/vector-icons";
import {removeEntry, submitEntry} from "../utils/api";
import {useDispatch, useSelector} from "react-redux";
import {addEntry} from "../actions";
import {purple, white} from "../utils/colors";

function SubmitBtn ({ onPress }) {
    return (
        <TouchableOpacity style={Platform.OS === "ios" ? styles.iosSubmitBtn : styles.AndroidSubmitBtn} onPress={onPress}>
            <Text style={styles.submitBtnText}>SUBMIT</Text>
        </TouchableOpacity>
    );
}

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
        clearLocalNotifications().then(setLocalNotification)
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
            <View style={styles.center}>
                <Ionicons name={Platform.OS === 'ios' ? 'ios-happy-outline' : 'md-happy'} size={100} />
                <Text>You already Logged your data for today</Text>
                <TextButton onPress={reset} style={{padding: 10}}>
                    Reset
                </TextButton>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <DateHeader date={new Date().toLocaleDateString()}/>
            {Object.keys(metaInfo).map(key => {
                const {getIcon, type, ...rest} = metaInfo[key];
                const value = state[key];

                return (
                    <View key={key} style={styles.row}>
                        {getIcon()}
                        {type === 'slider' ?
                            <UdacitySlider value={value} onChange={(val) => slide(key, val)} {...rest}/> :
                            <UdacitySteppers value={value} onIncrement={() => increment(key)} onDecrement={() => decrement(key)} {...rest} />
                        }
                    </View>
                )
            })}
            <SubmitBtn onPress={submit} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: white
    },
    row: {
        flexDirection: "row",
        flex: 1,
        alignItems: "center"
    },
    iosSubmitBtn: {
        backgroundColor: purple,
        padding: 10,
        borderRadius: 7,
        height: 45,
        marginLeft: 40,
        marginRight: 40
    },
    AndroidSubmitBtn: {
        backgroundColor: purple,
        padding: 10,
        paddingLeft: 30,
        paddingRight: 30,
        height: 45,
        borderRadius: 2,
        alignSelf: "flex-end",
        justifyContent: "center",
        alignItems: "center"
    },
    submitBtnText: {
        color: white,
        fontSize: 22,
        textAlign: "center"
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 30,
        marginRight: 30
    }
});

