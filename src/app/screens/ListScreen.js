import React from 'react'
import {
    ActivityIndicator,
    Image,
    ListView,
    Platform,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableHighlight,
    View
} from 'react-native'
import ToastExample from '../modules/ToastExample';
import Printer from '../modules/PrinterManager';

export class ListScreen extends React.Component {
    static navigationOptions = {
        title: 'List',
    };

    constructor(props) {
        super(props);
        this.state = {
            items: [],
            isLoading: true
        };
    }

    isIOS() {
        if (Platform.OS == 'ios')
            return true
    }

    isAndroid() {
        if (Platform.OS == 'android')
            return true
    }

    componentDidMount() {
        return fetch('https://api.coinmarketcap.com/v1/ticker')
            .then((response) => response.json())
            .then((responseJson) => {
                let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                this.setState({
                    //isLoading: false,
                    dataAll: responseJson,
                    dataSource: ds.cloneWithRows(responseJson)
                }, function () {
                    this.setState({refreshing: false});
                    this.loadImages()
                });
            })
            .catch((error) => {
                console.error(error);
            });
    }

    loadImages() {
        return fetch('https://www.cryptocompare.com/api/data/coinlist').then((response) => response.json())
            .then((responseJson) => {
                let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                this.setState({
                    isLoading: false,
                    dataAll: responseJson,
                    dataImages: responseJson.Data
                }, function () {
                    this.setState({refreshing: false});
                    this.renderListView()
                });
            })
            .catch((error) => {
                console.error(error);
            });
    }

    listViewItemSeparator() {
        return (
            <View
                style={{
                    height: .5,
                    width: "100%",
                    backgroundColor: "#000",
                }}
            />
        );
    }

    render() {
        if (this.state.isLoading) {
            return (
                <View style={styles.container}>
                    <ActivityIndicator/>
                    <Text>Loading...</Text>
                </View>
            );
        }
        return this.renderListView()
    }

    renderListView() {
        return (
            <View>
                <ListView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this.onRefresh.bind(this)}
                        />}
                    dataSource={this.state.dataSource}
                    renderSeparator={this.listViewItemSeparator}
                    renderRow={(rowData, sectionID, rowID, highlightRow) => this.renderRow(rowData, sectionID, rowID, highlightRow)}/>
            </View>
        );
    }

    renderRow(rowData, sectionID, rowID, highlightRow) {
        let swipeBtns = [
            {
                text: 'Delete',
                backgroundColor: 'red',
                underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
                //    onPress: (rowID) => {this.delete(rowID)}
            },
            {
                text: 'Duplicate',
                backgroundColor: 'blue',
                underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
                //    onPress: () => { this.duplicateNote(rowData) }
            }
        ];

        var percentDay = rowData.percent_change_24h
        var percentHour = rowData.percent_change_1h
        var color24h = percentDay > 0
        var color1h = percentHour > 0
        var greenColor = '#09a619'
        var redColor = '#ff2320'

        var coinKey = rowData.symbol
        var urlImage
        for (var key in this.state.dataImages) {
            if (key == coinKey) {
                urlImage = `https://www.cryptocompare.com${this.state.dataImages[key].ImageUrl}`
            }
        }
        if (urlImage == null){
            urlImage = 'https://facebook.github.io/react-native/docs/assets/favicon.png'
        }

        return (
            // <Swipeout
            //     right={swipeBtns}
            //     autoClose='true'
            //     backgroundColor='transparent'>
            <TouchableHighlight
                onPress={this.openSecondActivity.bind(this, rowData, urlImage)}
                //onPress={this.returnValue.bind(this, rowData)}
                onLongPress={this.longPress.bind(this, rowData)}
                underlayColor='blue'>
                <View style={styles.cell}>
                    <View style={styles.rowContainer}>
                        <Image style={styles.image}
                               source={{uri: urlImage}}
                        />
                        <View style={styles.textContainer}>
                            <Text style={styles.textLeftUp}> {rowData.symbol} |
                                <Text style={{fontWeight: 'normal'}}> {rowData.name}</Text>
                            </Text>
                            <Text style={styles.textLeftDown}> 24h:
                                <Text style={{color: color24h ? greenColor : redColor}}> {percentDay}% </Text>
                            </Text>
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.textRightUp}>${rowData.price_usd} </Text>
                            <Text style={styles.textRightDown}>1h:
                                <Text style={{color: color1h ? greenColor : redColor}}>  {percentHour}% </Text>
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableHighlight>
            //     </Swipeout>
        )
            ;
    }

    onRefresh() {
        this.setState({refreshing: true});
        this.componentDidMount()
    }

    openSecondActivity(rowData, urlImage) {
        this.props.navigation.navigate('InfoScreen', {data: rowData, image: urlImage})
    }

    longPress(rowData) {
        this.showMessage(rowData.id + '')
        //    alert(rowData.id)
    }

    returnValue(rowData) {
        if (this.isIOS()) {
            Printer.getValue(rowData.id, function (error, data) {
                if (error) {
                    console.error(error)
                } else {
                    // for (var i = 0; i < data.length; i++) {
                    //     console.log(data[i])
                    // }

                    for (var i in data) {
                        console.log(data[i])
                    }
                }
            })
        } else if (this.isAndroid()) {
            ToastExample.getValue(rowData.id,
                function (error) {
                    console.error(error)
                },
                function (data) {
                    for (var i in data) {
                        console.log(data[i])
                    }
                })
        }
    }

    showMessage(message: String) {
        if (this.isIOS()) {
            Printer.showAlert(message)
        } else if (this.isAndroid()) {
            ToastExample.show('Android native toast\n' + message, ToastExample.SHORT);

        }
    }
}

export default ListScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    cell: {
        flex: 1,
        padding: 4,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF'
    },
    image: {
        width: 40,
        height: 40
    },
    textLeftUp: {
        fontWeight: 'bold',
        marginLeft: 6,
        fontSize: 16,
    },
    textLeftDown: {
        marginLeft: 2,
        marginTop: 4,
        fontSize: 16
    },
    textRightUp: {
        fontWeight: 'bold',
        textAlign: 'right',
        marginRight: 2,
        fontSize: 16,
    },
    textRightDown: {
        textAlign: 'right',
        marginRight: 2,
        marginTop: 4,
        fontSize: 16
    },
    thumb: {
        width: 60,
        height: 60,
        marginRight: 10
    },
    textContainer: {
        flex: 1
    },
    separator: {
        height: 1,
        backgroundColor: '#dddddd'
    },
    price: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#48BBEC'
    },
    title: {
        fontSize: 20,
        color: '#656565'
    },
    rowContainer: {
        flexDirection: 'row',
        padding: 10
    }
});