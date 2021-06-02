import React from 'react';
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

function UdacityStatusBar({ backgroundColor, ...props }) {
    return (
        <View style={{backgroundColor, height: Constants.statusBarHeight}}>
            <StatusBar translucent backgroundColor={backgroundColor} {...props} />
        </View>
    );
}


const store = createStore(reducer);

export default function App() {
    AsyncStorage.removeItem(CALENDAR_STORAGE_KEY)
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

/*

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
*/
