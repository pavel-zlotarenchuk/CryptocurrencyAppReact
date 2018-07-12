import React, {Component} from 'react';
import {StackNavigator} from 'react-navigation';

import List from './src/app/screens/ListScreen'
import Info from './src/app/screens/InfoScreen'

const AppNavigator = StackNavigator({
    ListScreen: {
        screen: List,
        navigationOptions: {
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