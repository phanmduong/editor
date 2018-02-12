import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
    Keyboard
} from 'react-native';
import WebViewBridge from 'react-native-webview-bridge-updated';

export let wid = Dimensions.get('window').width;
export let hei = Dimensions.get('window').height;

const injectScript = `
  (function () {
                    if (WebViewBridge) {
 
                      WebViewBridge.onMessage = function (dataReceive) {
                        var data = JSON.parse(dataReceive);
                        if (data.message === "image") {
                                 insertImage(data.link);
                        }
                        if (data.message === "video") {
                                 insertVideo(data.link);
                        }
                        if (data === "reset height screen"){
                        test();
                        }
                        
                      };
                    }
                  }())
`;

export default class Editor extends Component<{}> {
    constructor(props) {
        super(props);

        // this.keyboardDidShow = this.keyboardDidShow.bind(this);
        // this.keyboardDidHide = this.keyboardDidHide.bind(this);
    }

    // componentWillMount() {
    //     Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
    //     Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);
    // }
    //
    // keyboardDidShow() {
    //     const {webviewbridge} = this.refs;
    //     console.log("Ádsadsa");
    //     webviewbridge.sendToBridge("reset height screen");
    // }
    //
    // keyboardDidHide() {
    //     const {webviewbridge} = this.refs;
    //     console.log("Ádsads321321a");
    //     webviewbridge.sendToBridge("reset height screen");
    //
    // }

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

    componentDidMount() {
        const {webviewbridge} = this.refs;
        this.props.refEditor(webviewbridge);
    }


    render() {
        const pageSource = require('./editor.html');

        return (
            <View style={{flex: 1}}>
                <WebViewBridge
                    ref="webviewbridge"
                    onBridgeMessage={this.onBridgeMessage.bind(this)}
                    injectedJavaScript={injectScript}
                    source={pageSource}/>
            </View>
        );
    }
}