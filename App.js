import React, {useEffect} from 'react';
import {StyleSheet, Text, View, StatusBar} from 'react-native';
import AddEntry from "./components/AddEntry";
import {createStore} from "redux";
import {Provider} from "react-redux";
import reducer from './reducers'
import History from "./components/History";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {CALENDAR_STORAGE_KEY} from "./utils/calendar";
import {purple} from "./utils/colors";
import {Constants} from "react-native-unimodules";
import Live from "./components/Live";
import {setLocalNotification} from "./utils/helpers";

function UdacityStatusBar({ backgroundColor, ...props }) {
    return (
        <View style={{backgroundColor, height: Constants.statusBarHeight}}>
            <StatusBar translucent backgroundColor={backgroundColor} {...props} />
        </View>
    );
}


const store = createStore(reducer);

export default function App() {

    useEffect(() => {
        setLocalNotification();
    }, [])

    return (
        <Provider store={store}>
            <View style={{flex: 1}}>
                <UdacityStatusBar backgroundColor={purple} />
                <Live />
            </View>
        </Provider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'flex-start'
    },
    box: {
        width: 50,
        height: 50,
        backgroundColor: '#e76e63',
        margin: 10,
    }
})
