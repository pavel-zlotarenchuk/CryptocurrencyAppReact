import React, {Component} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';

export class InfoScreen extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {state} = this.props.navigation

        var percent7Day = state.params.data.percent_change_7d
        var percent24Hour = state.params.data.percent_change_24h
        var percentHour = state.params.data.percent_change_1h
        var color7d = percent7Day > 0
        var color24h = percent24Hour > 0
        var color1h = percentHour > 0
        var greenColor = '#09a619'
        var redColor = '#ff2320'

        var date = new Date(state.params.data.last_updated * 1000)
        var hours = this.getFromZero(date.getHours())
        var minutes = this.getFromZero(date.getMinutes())
        var seconds = this.getFromZero(date.getSeconds())
        var day = this.getFromZero(date.getDay())
        var month = this.getFromZero(date.getMonth())

        return (
            <View style={styles.container}>
                <View style={styles.imageComtainer}>
                    <Image style={styles.image}
                           source={{uri: state.params.image}}
                    />
                    <View style={{flex: 1}}>
                        <Text style={{textAlign: 'right', fontSize: 23, color: '#000'}}>1h:
                            <Text style={{color: color1h ? greenColor : redColor}}> {percentHour}%</Text>
                        </Text>
                        <Text style={{textAlign: 'right', fontSize: 23, color: '#000'}}>24h:
                            <Text style={{color: color24h ? greenColor : redColor}}> {percent24Hour}%</Text>
                        </Text>
                    </View>
                </View>
                <Text style={styles.text}>Id: {state.params.data.id}</Text>
                <Text style={styles.text}>Name: {state.params.data.name}</Text>
                <Text style={styles.text}>Symbol: {state.params.data.symbol}</Text>
                <Text style={styles.text}>Price USD: ${state.params.data.price_usd}</Text>
                <Text style={styles.text}>Percent change 7d:
                    <Text style={{color: color7d ? greenColor : redColor}}> {percent7Day}%</Text>
                </Text>
                <Text style={styles.text}>Last updated:{" "}
                    {hours}:{minutes}:{seconds}{" "}
                    {day}.{month}.{date.getFullYear()}
                </Text>
            </View>

        )
    }

    getFromZero(value) {
        if (value < 10) {
            return `0${value}`
        } else {
            return value
        }
    }

};

export default InfoScreen;

const styles = StyleSheet.create({
    container:
        {
            flex: 1,
            backgroundColor: '#FFFFFF'
        },
    text:
        {
            paddingLeft: 10,
            fontSize: 23,
            textAlign: 'left',
            color: '#000',
        },
    image: {
        width: 60,
        height: 60
    },
    imageComtainer: {
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 10,
        flexDirection: 'row'
    },
    rowViewContainer:
        {
            fontSize: 18,
            paddingRight: 10,
            paddingTop: 10,
            paddingBottom: 10,
        }

});