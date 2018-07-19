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
import ApiManager from '../api/ApiManager';

export class ListScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
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
        ApiManager.getAllCoins((responseJson) => {
            let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            this.setState({
                dataAll: responseJson,
                dataSource: ds.cloneWithRows(responseJson),
                refreshing: false
            }, function () {
                this.loadImages()
            });
        })
    }

    loadImages() {
        ApiManager.getImages((responseJson) => {
            this.setState({
                isLoading: false,
                refreshing: false,
                dataAll: responseJson,
                dataImages: responseJson.Data
            }, function () {
                this.renderListView()
            });
        })
    }

    listViewItemSeparator() {
        return (
            <View style={styles.separator}/>
        );
    }

    render() {
        if (this.state.isLoading) {
            return (
                <View style={styles.container}>
                    <ActivityIndicator/>
                    <Text style={{color: '#fff'}}>Loading...</Text>
                </View>
            );
        }
        return this.renderListView()
    }

    renderListView() {
        return (
            <View style={styles.container}>
                <ListView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this.onRefresh.bind(this)}
                        />}
                    dataSource={this.state.dataSource}
                    //    renderSeparator={this.listViewItemSeparator}
                    renderRow={(rowData) => this.renderRow(rowData)}/>
            </View>
        );
    }

    renderRow(rowData) {
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

        var percentDay = this.setSign(rowData.percent_change_24h)
        var percentHour = this.setSign(rowData.percent_change_1h)

        var priceUsd = ''
        for (var i = 0; i < 7; i++){
            if (i <= rowData.price_usd.length - 1) {
                priceUsd += rowData.price_usd[i]
            } else {
                priceUsd += '0'
            }
        }

        var coinKey = rowData.symbol
        var urlImage
        for (var key in this.state.dataImages) {
            if (key == coinKey) {
                urlImage = `https://www.cryptocompare.com${this.state.dataImages[key].ImageUrl}`
            }
        }
        if (urlImage == null) {
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
                underlayColor='transparent'>
                <View style={styles.cell}>
                    <View style={styles.rowContainer}>
                        <Image style={styles.imageCoin}
                               source={{uri: urlImage}}
                        />
                        <View style={{flex: 1}}>
                            <Text style={styles.textLeftUp}> {rowData.symbol} |
                                <Text style={{fontWeight: 'normal'}}> {rowData.name}</Text>
                            </Text>
                            <View style={styles.containerTime}>
                                <Image style={{width: 28, height: 18}} source={require('../../../asset/ic_24h.png')}/>
                                <Text style={styles.textDown}> {percentDay}% </Text>
                            </View>
                        </View>
                        <View style={styles.textContainer}>
                            <View style={{alignItems: 'flex-start', width: 80}}>
                                <Text style={styles.textRightUp}>${priceUsd} </Text>
                                <View style={{flexDirection: 'row', paddingTop: 6}}>
                                    <Image style={{width: 18, height: 18}}
                                           source={require('../../../asset/ic_1h.png')}/>
                                    <Text style={styles.textDown}>  {percentHour}% </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableHighlight>
            //     </Swipeout>
        )
            ;
    }

    setSign(value){
        if (value > 0){
            return `+ ${Math.abs(value)}`
        } else if (value < 0){
            return `- ${Math.abs(value)}`
        } else {
            return Math.abs(value)
        }
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

    // Example return value from native code
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
        alignItems: 'center',
        backgroundColor: '#1A2035'
    },
    cell: {
        flex: 1,
        marginRight: 8,
        marginLeft: 8,
        marginTop: 8,
        padding: 6,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#252D47',
        borderRadius: 15
    },
    separator: {
        height: 8,
        width: "100%",
        backgroundColor: "#1A2035"
    },
    imageCoin: {
        width: 40,
        height: 40,
        borderRadius: 10
    },
    containerTime: {
        flexDirection: 'row',
        paddingLeft: 12,
        paddingTop: 6
    },
    textLeftUp: {
        color: '#CDCCDD',
        marginLeft: 8,
        fontSize: 16,
    },
    textDown: {
        color: '#5F698D'
    },
    textRightUp: {
        color: '#CDCCDD',
        marginRight: 4,
        fontSize: 16,
    },
    thumb: {
        width: 60,
        height: 60,
        marginRight: 10
    },
    textContainer: {
        flex: 1,
        alignItems: 'flex-end'
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
