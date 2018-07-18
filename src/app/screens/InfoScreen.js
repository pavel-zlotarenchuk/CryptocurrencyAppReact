import React, {Component} from 'react';
import {ActivityIndicator, Image, StyleSheet, Text, View, Alert} from 'react-native';
import Line from '../components/chart/Line';
import {Range, RANGES} from '../redux/Chart';
import Switcher from "../components/range/Switcher";
import ApiManager from '../api/ApiManager'
import Permissions from 'react-native-permissions'

export class InfoScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            coinKey: props.navigation.state.params.data.symbol,
            range: RANGES[0],
            isLoading: true,
            prices: []
        }
    }

    componentDidMount() {
        // Example use permission
        // this.alertForPermission()
    }

    render() {
        if (this.state.isLoading) {
            this.getRates(this.state.coinKey, this.state.range)
            return (
                <View style={styles.containerLoading}>
                    <ActivityIndicator/>
                    <Text>Loading...</Text>
                </View>
            );
        }
        return this.renderScreen()
    }

    renderScreen() {
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
                <View style={styles.imageContainer}>
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

                <View style={styles.containerRanges}>
                    <Switcher
                        ranges={RANGES}
                        current={this.state.range}
                        onSelectRange={(range: Range) => {
                            this.state.range = range
                            this.state.isLoading = true
                            this.state.prices = []
                            if (null != this.state.coinKey) {
                                this.getRates(this.state.coinKey, range)
                            }
                        }}
                    />
                </View>

                <View style={styles.containerChart}>
                    {this.state.isLoading && <View pointerEvents="box-none" style={styles.loading}>
                        <ActivityIndicator size="large"/>
                    </View>}
                    {this.state.prices.length > 0 && <Line
                        values={this.state.prices}
                    />}
                </View>
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

    getRates(coinKey: string, range: Range) {
        ApiManager.getDataChart(coinKey, range, (responseJson) => {
            var data = responseJson.Data
            for (var i = 0; i < data.length; i++) {
                this.state.prices[i] = data[i].high
            }
            this.setState({
                isLoading: false
            }, function () {
                this.renderScreen()
            })
        })
    }

    // Example use permission
    alertForPermission() {
        Permissions.request('camera', { type: ['alert', 'badge'] }).then(
            response => {
                this.setState({ cameraPermission: response })
            },
        )
    }
};

export default InfoScreen;

const styles = StyleSheet.create({
    containerLoading: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    text: {
        paddingLeft: 10,
        fontSize: 23,
        textAlign: 'left',
        color: '#000',
    },
    image: {
        width: 60,
        height: 60
    },
    imageContainer: {
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 10,
        flexDirection: 'row'
    },
    containerChart: {
        paddingTop: 20,
        paddingBottom: 10,
        flex: 38, // take 38% of the screen height
        backgroundColor: '#FFFFFF',
    },
    loading: {
        ...StyleSheet.absoluteFillObject, // overlay the chart
        alignItems: 'center',             // center horizontally
        justifyContent: 'center',         // center vertically
        zIndex: 1,                        // show in front of the chart
    },
    containerRanges: {
        backgroundColor: '#673AB7',
    }

});
