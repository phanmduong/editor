import React, {Component} from 'react';
import {AppRegistry, View} from 'react-native';
import App from './src/App';

 
export default class Rouly extends Component {
    render() {
        return (
            <View style={{flex: 1}}>
                <App/>
            </View>
        )
    }
}

console.disableYellowBox = true;
AppRegistry.registerComponent('rouly', () => Rouly);

