import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import AddEntry from "./components/AddEntry";
import {createStore} from "redux";
import {Provider} from "react-redux";
import reducer from './reducers'


const store = createStore(reducer);

export default function App() {
    return (
        <Provider store={store}>
            <View style={{flex: 1}}>
                <AddEntry/>
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
