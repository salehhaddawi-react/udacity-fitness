import AsyncStorage from "@react-native-async-storage/async-storage";
import {CALENDAR_STORAGE_KEY} from "./calendar";

export function submitEntry ({ entry, key }) {
    AsyncStorage.mergeItem(CALENDAR_STORAGE_KEY, JSON.stringify({
        [key]: entry
    }))
}

export function removeEntry (key) {
    AsyncStorage.getItem(CALENDAR_STORAGE_KEY).then(results => {
        const data = JSON.parse(results);
        data[key] = undefined;
        delete data[key];

        AsyncStorage.setItem(CALENDAR_STORAGE_KEY, JSON.stringify(data));
    })
}
