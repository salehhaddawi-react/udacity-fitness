import React, {useEffect, useState} from "react";
import {View, Text, ActivityIndicator, TouchableOpacity, StyleSheet, Animated} from "react-native";
import {Foundation} from '@expo/vector-icons';
import {purple, white} from "../utils/colors";
import {calculateDirection} from "../utils/helpers";
import * as Location from 'expo-location'
import {shouldUseNativeDriver} from "react-native-web/dist/vendor/react-native/Animated/NativeAnimatedHelper";


export default function Live () {
    const [status, setStatus] = useState('undetermined');
    const [coords, setCoords] = useState({});
    const [direction, setDirection] = useState('');
    const [bounce, setBounce] = useState(new Animated.Value(1));

    shouldUseNativeDriver(true);

    useEffect(() => {
        Location.getForegroundPermissionsAsync()
            .then(({ status }) => {
                if (status === 'granted') {
                    return setLocation();
                }

                setStatus(status);
            })
            .catch((e) => {
                console.warn('Error while asking location permission: '+ e);

                setStatus('undetermined')
            });
    }, []);

    const askPermission = () => {
        Location.getForegroundPermissionsAsync()
            .then(({ status }) => {
                if (status === 'granted') {
                    setLocation();
                }

                setStatus(status);
            })
            .catch((e) => {
                console.warn('Error while asking location permission:', e);
            })
    }

    const setLocation = () => {
        Location.watchPositionAsync({
            enableHighAccuracy: true,
            timeInterval: 1,
            distanceInterval: 1
        }, ({ coords }) => {
            const newDirection = calculateDirection(coords.heading)

            if (newDirection !== direction) {
                Animated.sequence([
                    Animated.timing(bounce, {toValue: 1.04, duration: 200, useNativeDriver: true}),
                    Animated.spring(bounce, {toValue: 1, friction: 4, useNativeDriver: true}),
                ]).start();
            }

            setStatus('granted');
            setCoords(coords);
            setDirection(newDirection);
        });
    }

    if (status === 'denied') {
        return (
            <View style={styles.center}>
                <Foundation name={'alert'} size={50} />
                <Text>You denied your location. You can fix this by visiting your settings and enabling location services for this app</Text>
            </View>
        );
    }

    if (status === 'undetermined') {
        return (
            <View style={styles.center}>
                <Foundation name={'alert'} size={50} />
                <Text>You need to enable location service for this app</Text>
                <TouchableOpacity style={styles.button} onPress={askPermission}>
                    <Text style={styles.buttonText}>Enable</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (status === 'granted') {
        return (
            <View style={styles.container}>
                <View style={styles.directionContainer}>
                    <Text style={styles.header}>You're heading</Text>
                    <Animated.Text style={[styles.direction, {transform: [{scale: bounce}]}]}>
                        {direction}
                    </Animated.Text>
                </View>
                <View style={styles.metricContainer}>
                    <View style={styles.metric}>
                        <Text style={[styles.header, {color: white}]}>
                            Altitude
                        </Text>
                        <Text style={[styles.subHeader, {color: white}]}>
                            {Math.round(coords.altitude)} meters
                        </Text>
                    </View>
                    <View style={styles.metric}>
                        <Text style={[styles.header, {color: white}]}>
                            Speed
                        </Text>
                        <Text style={[styles.subHeader, {color: white}]}>
                            {(coords.speed * 2.2369).toFixed(2)} MPH
                        </Text>
                    </View>
                </View>
            </View>
        );
    }

    return <ActivityIndicator style={{margin: 30}} />
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between'
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 30,
        marginRight: 30,
    },
    button: {
        padding: 10,
        backgroundColor: purple,
        alignSelf: 'center',
        borderRadius: 5,
        margin: 20,
    },
    buttonText :{
        color: white,
        fontSize: 20,
    },
    directionContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    header: {
        fontSize: 35,
        textAlign: 'center',
    },
    direction: {
        color: purple,
        fontSize: 120,
        textAlign: 'center',
    },
    metricContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: purple,
    },
    metric: {
        flex: 1,
        paddingTop: 15,
        paddingBottom: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginTop: 20,
        marginBottom: 20,
        marginLeft: 10,
        marginRight: 10,
    },
    subHeader: {
        fontSize: 25,
        textAlign: 'center',
        marginTop: 5,
    },
})

