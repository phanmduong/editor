import React, {Component} from 'react';
import {
    Text,
    TouchableOpacity,
    View,
    Platform,
    Alert,
    StyleSheet,
    Dimensions,
    KeyboardAvoidingView,
    Keyboard,
    AsyncStorage
} from 'react-native';
// NATIVE-BASE LIBRARY
import {Container, Content, Item, Input, Left, Right} from 'native-base';
// ICON LIBRARY
import IconDefault from '../../commons/IconDefault';
// DATE PICKER LIBRARY FOR ANDROID AND IOS
import DatePicker from 'react-native-datepicker'
// TIME LIBRARY
import moment from 'moment';
// FUNCTION OF EDITOR
import * as editorFunction from './editorFunction';
// MODAL PROCESS UPLOAD SERVER
import ModalProcess from "./ModalProcess";
import WebViewBridge from 'react-native-webview-bridge-updated';
import {injectScript, UPLOAD_ERROR} from "./constants";
import {formatData} from "./editorFunction";

let isKeyboardShow = true;

class EditorContainer extends Component {
    constructor() {
        super();
        let now = moment().format("MMMM / DD / YYYY");
        this.state = {
            date: now,
            status: {
                public: false,
                color: color.disableColor,
                label: "NON - PUBLIC"
            },
            isUploading: false,
        };
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

            const status = post.public && post.public ? {
                    public: true,
                    color: color.mainColor,
                    label: "PUBLIC"
                }
                :
                {
                    public: false,
                    color: color.mainColor,
                    label: "NON - PUBLIC"
                }

            this.setState({
                date: post.date,
                status: status,
            });

            const {webviewbridge} = this.refs;
            setTimeout(function () {
                webviewbridge.sendToBridge(JSON.stringify(data));
            }, 500);
        }

        catch (error) {
        }
    };

    componentWillMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardWillShow.bind(this));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardWillHide.bind(this));
    }

    componentDidMount() {
        //if params has id then edit post else new post
        const {params} = this.props.navigation.state;
        const diaty = params ? params.diaty : null;
        if (diaty) {
            this.getData(diaty);
        }
    }

    keyboardWillShow() {
        if (isKeyboardShow) {
            isKeyboardShow = false;
            console.log("show");
            const {webviewbridge} = this.refs;
            const data = {
                message: "keyboardShow",
            };
            webviewbridge.sendToBridge(JSON.stringify(data));
        }
    }

    keyboardWillHide() {
        isKeyboardShow = true;
        console.log("hide");
        const {webviewbridge} = this.refs;
        const data = {
            message: "keyboardHide",
        };
        webviewbridge.sendToBridge(JSON.stringify(data));
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

// FUNCTION CHOICE IMAGE
    choiceImage() {
        editorFunction.choiceImage(this.openLibrary, this.completeHandler, this.progressHandler, this.error)
    }

// OPEN LIBRARY SELECT
    openLibrary = (url, typeLibrary) => {
        let data = {
            link: url,
        };

        console.log(data);
        console.log(typeLibrary);

        const {webviewbridge} = this.refs;

        if (typeLibrary == 'image') {
            data.message = 'image';
            console.log(data);
            webviewbridge.sendToBridge(JSON.stringify(data));
        } else {
            data.message = 'video';
            webviewbridge.sendToBridge(JSON.stringify(data));
        }
        this.setState({
            isUploading: true,
        });
    };

    /**
     * Handle when upload server complete
     **/
    completeHandler = (event) => {
        try {
            this.setState({isUploading: false});
            console.log(event.currentTarget.response);
            var data = JSON.parse(event.currentTarget.response);
            const {webviewbridge} = this.refs;
            data = {
                link: data.link,
            };

            console.log(data.link);
            data.message = 'setSource';
            webviewbridge.sendToBridge(JSON.stringify(data));
        } catch (err) {
            this.error();
        }
    };

    /**
     * Progress upload server
     **/
    progressHandler = (event) => {
    };


    /**
     * Error when upload server error
     **/
    error = (error) => {
        this.setState({isUploading: false});
        const {webviewbridge} = this.refs;
        let data = {
            link: UPLOAD_ERROR
        };

        console.log(data.link);
        data.message = 'setSource';
        webviewbridge.sendToBridge(JSON.stringify(data));
    };

    /**
     * FUNCTION CHOICE VIDEO
     */

    choiceVideo() {
        editorFunction.choiceVideo(this.openLibrary, this.completeHandler, this.progressHandler, this.error)
    }

    /**
     * FUNCTION CHANGE STATUS PUBLIC <-> NON-PUBLIC
     */
    changeStatus() {
        this.closeKeyboard();
        const {status} = this.state;
        status.public
            ?
            this.setState({status: {public: false, color: color.mainColor, label: "NON - PUBLIC"}})
            :
            this.setState({status: {public: true, color: color.mainColor, label: "PUBLIC"}})
    }

    /**
     * Close keyboard
     */
    closeKeyboard = () => {
        const data = {message: 'blur'};
        const {webviewbridge} = this.refs;
        webviewbridge.sendToBridge(JSON.stringify(data));
        Keyboard.dismiss();
    };

    /**
     * Event call save content post
     **/
    saveEditor = () => {
        const data = {message: 'save'};
        const {webviewbridge} = this.refs;
        webviewbridge.sendToBridge(JSON.stringify(data));
    };

    saveSelecton = () => {
        console.log("ok");
        if (!isKeyboardShow) {
            const {webviewbridge} = this.refs;
            const data = {message: 'save selection'};
            webviewbridge.sendToBridge(JSON.stringify(data));
        }
    }

    /**
     * Save content post local
     **/
    async saveLocal(content) {
        if (this.state.isUploading) {
            Alert.alert(
                'Notification',
                'File uploading'
            )
            return;
        }
        let data = {
            title: this.state.title,
            public: this.state.status.public,
            date: this.state.date,
            content: content
        };
        try {
            await
                AsyncStorage.setItem('@Editor:editor', JSON.stringify(data));
            Alert.alert(
                'Notification',
                'Save successfull'
            )
        } catch (error) {
        }
    }
    ;

    /**
     * Receive event editor
     **/
    onBridgeMessage(data) {
        data = JSON.parse(data);

        switch (data.message) {
            case "save":
                console.log(data.content);
                this.saveLocal(data.content);
                break;
        }
    }

    render() {
        const {status} = this.state;
        const {goBack} = this.props.navigation;
        const isIOS = Platform.OS === 'ios';
        const pageSource = isIOS ? require('./editor.html') : {uri: 'file:///android_asset/editor.html'};

        return (

            <Container style={styles.wrapperContainer}>
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => this.closeKeyboard()}
                >
                    {/*HEADER*/}
                    <View
                        onPress={this.closeKeyboard}
                        style={[styles.wrapperHeader, styles.paddingLeftRight, styles.wrapperRowSpaceBetween, styles.shadow]}>
                        {/*BACK BUTTON*/}
                        <TouchableOpacity
                            style={styles.wrapperRowCenter}
                            onPress={() => goBack(null)}
                        >
                            <IconDefault
                                name={"Entypo|chevron-left"}
                                style={{paddingLeft: 0}}
                            />
                            <Text style={[styles.textButton]}>BACK</Text>
                        </TouchableOpacity>
                        {/*END BACK BUTTON*/}

                        {/*SAVE BUTTON*/}
                        <TouchableOpacity
                            onPress={() => this.saveEditor()}
                        >
                            <Text style={[styles.textButton, {color: color.mainColor}]}>SAVE</Text>
                        </TouchableOpacity>
                        {/*END SAVE BUTTON*/}
                    </View>
                    {/*END HEADER*/}

                    {/*BODY*/}
                    <View style={styles.wrapperBody}>
                        <View style={[styles.wrapperRowSpaceBetween]}>

                            {/*DATA PICKER*/}
                            <Left style={styles.wrapperRowCenter}>
                                <DatePicker
                                    style={{width: deviceWidth / 2}}
                                    numberOfLines={1}
                                    date={this.state.date}
                                    mode="date"
                                    placeholder="Select Date"
                                    format="MMMM / DD / YYYY"
                                    confirmBtnText="Confirm"
                                    cancelBtnText="Cancel"
                                    customStyles={{
                                        dateInput: {
                                            borderWidth: 0,
                                            alignItems: 'flex-start',
                                            width: 200
                                        },
                                        dateText: {
                                            color: color.mainColor,
                                            fontSize: 13,
                                        }
                                    }}
                                    onDateChange={(date) => {
                                        this.setState({date: date})
                                    }}
                                    onOpenModal={() => {
                                        this.closeKeyboard();
                                    }}
                                    iconComponent={
                                        <IconDefault
                                            name={"FontAwesome|calendar"}
                                            color={color.mainColor}
                                            size={12}
                                            style={{paddingLeft: 0}}
                                        />}
                                />

                            </Left>
                            {/*END DATA PICKER*/}

                            {/*SET PUBLIC BUTTON*/}
                            <Right>
                                <TouchableOpacity
                                    style={[styles.wrapperRowCenter, styles.buttonPublic, {borderColor: status.color}]}
                                    onPress={() => this.changeStatus()}
                                >
                                    <IconDefault
                                        size={13}
                                        name={"FontAwesome|globe"}
                                        color={status.color}
                                        style={{padding: 3}}
                                    />
                                    <Text
                                        style={[styles.textButtonDisable, {
                                            color: status.color,
                                            fontSize: 13
                                        }]}>{status.label}</Text>
                                </TouchableOpacity>
                            </Right>
                            {/*END SET PUBLIC BUTTON*/}

                        </View>
                        {/*END TOP NAV*/}
                    </View>
                </TouchableOpacity>
                {/*CONTENT*/}

                <KeyboardAvoidingView behavior={isIOS ? 'padding' : null} style={{flex: 1}}>
                    <View style={style.containerEditor}>
                        <TouchableOpacity style={{flex: 1}} activeOpacity={1} onPress={this.saveSelecton}>
                            <WebViewBridge

                                style={{marginBottom: -10, borderWidth: 0}}
                                scrollEnabled={false}
                                ref="webviewbridge"
                                onBridgeMessage={this.onBridgeMessage.bind(this)}
                                injectedJavaScript={injectScript}
                                source={pageSource}/>
                        </TouchableOpacity>
                        {/*FOOTER*/}
                        <View style={[styles.wrapperRowCenter, styles.wrapperBottom]}>
                            {/*CHOICE IMAGE BUTTON*/}
                            <TouchableOpacity
                                activeOpacity={this.state.isUploading ? 1 : 0.6}
                                style={{paddingRight: 10}}
                                onPress={() => {
                                    if (!this.state.isUploading) {
                                        this.choiceImage()
                                    }
                                }}
                            >
                                <IconDefault
                                    name={"Entypo|folder-images"}
                                    size={20}
                                    color={color.disableColor}
                                />
                            </TouchableOpacity>
                            {/*END CHOICE IMAGE BUTTON*/}

                            {/*CHOICE VIDEO BUTTON*/}
                            <TouchableOpacity
                                activeOpacity={this.state.isUploading ? 1 : 0.6}
                                onPress={() => {
                                    if (!this.state.isUploading) {
                                        this.choiceVideo()
                                    }
                                }}
                            >
                                <IconDefault
                                    name={"Entypo|folder-video"}
                                    size={20}
                                    color={color.disableColor}
                                />
                            </TouchableOpacity>
                            {/*END CHOICE VIDEO BUTTON*/}
                        </View>
                    </View>
                    {/*END CONTENT*/}
                    {/*END BODY*/}


                </KeyboardAvoidingView>

                {/*END FOOTER*/}

            </Container>
        );
    }
}

export default (EditorContainer)

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
    wrapperBody: {
        marginHorizontal: 10,
        marginTop: 10,
        backgroundColor: color.background,

    },
    wrapperBottom: {
        width: deviceWidth,
        borderTopWidth: 1,
        borderColor: "#ccc",
        flexDirection: 'row',
        padding: 10,
        bottom: 0,
        backgroundColor: '#FFFFFF'
    },
    wrapperRowSpaceBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    wrapperRowCenter: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    paddingLeftRight: {
        paddingLeft: 10,
        paddingRight: 10,
    },
    marginLeftRight: {
        marginLeft: 10,
        marginRight: 10,
    },
    marginTopBottom: {
        marginTop: 10,
        marginBottom: 10,
    },
    imageFullWidth: {
        height: deviceHeight / 3,
        backgroundColor: color.background
    },
    textButton: {
        color: color.textColor,
        fontSize: 14,
    },
    textButtonDisable: {
        color: color.disableColor,
        fontSize: 14,
    },
    buttonPublic: {
        borderRadius: 50,
        borderWidth: 1,
        borderColor: color.disableColor,
        paddingLeft: 7,
        paddingRight: 10,
        paddingVertical: 3
    },
    containerEditor: {
        flex: 1,
        backgroundColor: color.background
    },
    textTitle: {
        marginHorizontal: 7,
        paddingVertical: 5,
        borderBottomWidth: 1,
        borderColor: '#cccccc'
    },
    shadow: isIOS
        ?
        {
            shadowColor: color.shadowColor,
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 0.3,
        }
        :
        {
            elevation: 1,
        },

}
const styles = StyleSheet.create(style)