import React, {useEffect} from "react";
import {Text, View} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {fetchCalenderResults} from "../utils/api";
import {addEntry, receiveEntries} from "../actions";
import {getDailyReminderMessage, timeToString} from "../utils/helpers";
import UdacityFitnessCalender from 'udacifitness-calendar';


export default function History() {
    const dispatch = useDispatch();

    useEffect(() => {
        fetchCalenderResults()
            .then((entries) => dispatch(receiveEntries(entries))) // receive entries
            .then(({entries}) => {
                if (!entries[timeToString()]) { // no logged data for today
                    dispatch(addEntry({
                        [timeToString()]: getDailyReminderMessage()
                    }));
                }
            })
    }, [dispatch]);

    const entries = useSelector((state) => state) || null;

    function renderItem({today, ...metrics}, formattedDate, key) {
        return (
            <View>
                <Text>{today ? JSON.stringify(today) : JSON.stringify(metrics)}</Text>
            </View>
        );
    }

    function renderEmptyDay(formattedDate) {
        return (
            <View>
                <Text>No Data for today</Text>
            </View>
        )
    }

    return (
        entries && <UdacityFitnessCalender items={entries} renderItem={renderItem} renderEmptyDate={renderEmptyDay}/>
        // <Text>{JSON.stringify(entries)}</Text>
    );
}
