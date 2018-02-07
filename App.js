/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    KeyboardAvoidingView, Button, Dimensions
} from 'react-native';
import WebViewBridge from 'react-native-webview-bridge-updated';

const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
    android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export let wid = Dimensions.get('window').width;
export let hei = Dimensions.get('window').height;

const injectScript = `
  (function () {
                    if (WebViewBridge) {
 
                      WebViewBridge.onMessage = function (message) {
                        if (message === "insert image") {
                                 insertImage('https://scontent-hkg3-1.xx.fbcdn.net/v/t1.0-9/20882394_501087773575159_2904880066878499843_n.png?oh=6c36068a6b807f2aee12d1b3ff3c2d62&oe=5ADCF712');

                        }
                        if (message === "insert video") {
                                 insertVideo('https://www.w3schools.com/html/mov_bbb.mp4');

                        }
                      };
                
                      WebViewBridge.send("hello from webview");
                    }
                  }())
`;

export default class App extends Component<{}> {


    onBridgeMessage(message) {
        const {webviewbridge} = this.refs;


        switch (message) {
            case "hello from webview":
                webviewbridge.sendToBridge("hello from react-native");
                break;
            case "got the message inside webview":
                console.log("we have got a message from webview! yeah");
                break;
        }
    }


    render() {
        const pageSource = require('./editor.html');

        return (
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'position' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? undefined : 200}
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#656367',
                    position: 'relative',
                }}>
                <View style={{flex: 1}}>
                    <View style={{flex: 1, width: wid}}>
                        <WebViewBridge
                            ref="webviewbridge"
                            onBridgeMessage={this.onBridgeMessage.bind(this)}
                            injectedJavaScript={injectScript}
                            source={pageSource}/>
                    </View>

                    <Button onPress={() => {
                        const {webviewbridge} = this.refs;
                        webviewbridge.sendToBridge("insert image");
                    }} title='image'/>
                    <Button onPress={() => {
                        const {webviewbridge} = this.refs;
                        webviewbridge.sendToBridge("insert video");
                    }} title='video'/>
                </View>
            </KeyboardAvoidingView>


        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});
