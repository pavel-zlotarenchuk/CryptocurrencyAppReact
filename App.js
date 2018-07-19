import React, {Component} from 'react';
import {StackNavigator} from 'react-navigation';

import List from './src/app/screens/ListScreen'
import Info from './src/app/screens/InfoScreen'
import {StyleSheet} from "react-native";

const AppNavigator = StackNavigator({
    ListScreen: {
        screen: List,
        navigationOptions: {
            headerStyle: {
                backgroundColor: "#252D47"
            },
            headerTitleStyle: {
                color: '#CDCCDD'
            },
            title: "List"
        }},
    InfoScreen: {
        screen: Info,
        navigationOptions: {
            title: "Info"
        }}
});

export default class App extends Component {
    render() {
        return (
            <AppNavigator/>
        );
    }
}

const styles = StyleSheet.create({
    back: {
        backgroundColor: "#4fff3f",
        color: "#3f41ff"
    }

});
