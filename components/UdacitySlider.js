import React from "react";
import {View, Text} from "react-native";
import Slider from '@react-native-community/slider';

export default function UdacitySlider({ max, unit, step, value, onChange}) {
    return (
        <View>
            <Slider
                step={step}
                value={value}
                minimumValue={0}
                maximumValue={max}
                onValueChange={onChange}
            />

            <Text>{value}</Text>
            <Text>{unit}</Text>
        </View>
    );
}
