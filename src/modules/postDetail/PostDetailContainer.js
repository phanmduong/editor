import React, {Component} from 'react';
import {
    TouchableOpacity,
    Text,
    View,
    Platform,
    StyleSheet,
    Dimensions, AsyncStorage,
} from 'react-native';
// NATIVE-BASE LIBRARY
import {Container, Content} from 'native-base';
// ICON LIBRARY
import IconDefault from '../../commons/IconDefault';
// TIME LIBRARY
import {injectScript} from "../editor/constants";
import WebViewBridge from 'react-native-webview-bridge-updated';
import {formatData} from "../editor/editorFunction";
import moment from "moment/moment";

class PostDetailContainer extends Component {
    constructor() {
        super();
        let now = moment().format("MMMM / DD / YYYY");
        this.state = {
            date: now,
            public: '',
        }
    }

    /**
     * Get data post
     **/
    async getData() {
        try {
            var post = await AsyncStorage.getItem('@Editor:editor');

            post = JSON.parse(post);
            const data = {
                message: "content",
                content: post.content ? formatData(post.content) : ''
            };

            this.setState({
                date: post.date,
                public: post.public,
            });

            const {webviewbridge} = this.refs;
            setTimeout(function () {
                webviewbridge.sendToBridge(JSON.stringify(data));
            }, 500);
        }

        catch (error) {
        }
    };

    componentDidMount() {
        const {params} = this.props.navigation.state;
        const postId = params ? params.id : null;
        if (postId) {
            this.getData();
        }
    }

    render() {
        const {navigate} = this.props.navigation;
        const {goBack} = this.props.navigation;
        const pageSource = isIOS ? require('./view.html') : {uri: 'file:///android_asset/view.html'};


        return (
            <Container style={styles.wrapperContainer}>
                {/*HEADER*/}
                <View
                    style={[styles.wrapperHeader, styles.paddingLeftRight, styles.wrapperRowSpaceBetween, styles.shadow]}>
                    <View style={styles.wrapperHeaderTitle}>
                        <Text style={[styles.textButton]} numberOfLines={1}>{this.state.title}</Text>
                    </View>
                    {/*SAVE BUTTON*/}
                    <TouchableOpacity
                        onPress={() => goBack(null)}
                    >
                        <IconDefault
                            name={"Ionicons|ios-close-outline"}
                            size={30}
                            style={{paddingRight: 0}}
                        />
                    </TouchableOpacity>
                    {/*END SAVE BUTTON*/}
                </View>
                {/*END HEADER*/}
                <View style={styles.status}>
                    <Text style={styles.textRed}>{this.state.date}</Text>
                    <Text style={styles.textRed}>{this.state.public ? 'Public' : 'non-public'}</Text>
                </View>
                {/*BODY*/}
                <View style={styles.wrapperBody}>
                    <WebViewBridge
                        scrollEnabled={false}
                        ref="webviewbridge"
                        injectedJavaScript={injectScript}
                        source={pageSource}/>
                </View>
                {/*END BODY*/}
            </Container>
        );
    }
}

export default (PostDetailContainer)

// WIDTH, HEIGHT DEVICE'S SCREEN
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

// IF DEVICE IS IOS
const isIOS = Platform.OS === 'ios';

// COLORS USED
const color = {
    background: '#FFF',
    disableColor: '#8e8e8e',
    textColor: '#000',
    shadowColor: 'rgba(0,0,0,0.5)',
    mainColor: '#dd066b'
}

// STYLE USED
const style = {
    wrapperContainer: {
        flex: 1,
        backgroundColor: color.background,
    },
    wrapperHeader: {
        height: isIOS ? 70 : 50,
        paddingTop: isIOS ? 20 : 0,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: color.background,
    },
    wrapperHeaderTitle: {
        flex: 1,
        width: deviceWidth - 60,
        justifyContent: 'center'
    },
    wrapperBody: {
        flex: 1,
        backgroundColor: color.background,
    },
    wrapperRowSpaceBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    paddingLeftRight: {
        paddingLeft: 10,
        paddingRight: 10,
    },
    textRed: {
        color: color.mainColor
    },
    status: {
        borderBottomWidth: 1,
        borderBottomColor: '#CCC'
    }
}
const styles = StyleSheet.create(style)