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
    ToastAndroid
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
import Editor from "./Editor";
import ModalProcess from "./ModalProcess";


class EditorContainer extends Component {
    constructor() {
        super();
        this.state = {
            imageSource: '',
            videoSource: '',
            date: '',
            status: {
                public: false,
                color: color.disableColor,
                label: "NON - PUBLIC"
            },
            progressUpload: 0,
            isUploading: false
        }
    }

    componentWillMount() {
        // GET TIME NOW
        let now = moment().format("MMMM / DD / YYYY");
        this.setState({date: now})
    }

    // FUNCTION CHOICE IMAGE
    choiceImage() {
        this.typeLibrary = 'image';
        editorFunction.choiceImage(this.openLibrary, this.completeHandler, this.progressHandler, this.error)
    }

    openLibrary = () => {
        console.log("open");
        this.setState({
            isUploading: true,
            processUpload: 0
        });
    };

    completeHandler = (event) => {
        this.setState({isUploading: false});
        var data = JSON.parse(event.currentTarget.response);
        data = {
            link: data.link,
        };

        console.log(data.link);

        if (this.typeLibrary === 'image') {
            data.message = 'image';
            this.editor.sendToBridge(JSON.stringify(data));
        } else {
            ToastAndroid.show(data.link, ToastAndroid.SHORT);
            data.message = 'video';
            this.editor.sendToBridge(JSON.stringify(data));
        }
    };

    progressHandler = (event) => {
        const percentComplete = event.loaded / event.total;
        console.log(percentComplete);
        this.setState({progressUpload: percentComplete})
    };

    error = (error) => {
        this.setState({isUploading: false});
        Alert.alert(
            'Notification',
            'Error'
        )
    };

    // FUNCTION CHOICE VIDEO
    choiceVideo() {
        this.typeLibrary = 'video';
        editorFunction.choiceVideo(this.openLibrary, this.completeHandler, this.progressHandler, this.error)
    }

    // FUNCTION CHANGE STATUS PUBLIC <-> NON-PUBLIC
    changeStatus() {
        const {status} = this.state;
        status.public
            ?
            this.setState({status: {public: false, color: color.disableColor, label: "NON - PUBLIC"}})
            :
            this.setState({status: {public: true, color: color.mainColor, label: "PUBLIC"}})
    }

    refEditor = (editor) => {
        this.editor = editor;
    };

    render() {
        const {navigate} = this.props.navigation;
        const {status, imageSource} = this.state;
        const {goBack} = this.props.navigation;

        return (
            <Container style={styles.wrapperContainer}>
                {/*HEADER*/}
                <View
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
                    <TouchableOpacity>
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
                                numberOfLines={1}
                                date={this.state.date}
                                mode="date"
                                placeholder="Select Date"
                                format="MMMM / DD / YYYY"
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                showIcon={false}
                                customStyles={{
                                    dateInput: {
                                        paddingLeft: 5,
                                        borderWidth: 0, alignItems: 'flex-start',
                                    },
                                    dateText: {
                                        color: color.mainColor,
                                        fontSize: 14,
                                        paddingRight: 5,
                                    }
                                }}
                                onDateChange={(date) => {
                                    this.setState({date: date})
                                }}
                            />
                            <IconDefault
                                name={"FontAwesome|calendar"}
                                color={color.mainColor}
                                style={{paddingLeft: 0}}
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
                                    name={"FontAwesome|globe"}
                                    color={status.color}
                                />
                                <Text
                                    style={[styles.textButtonDisable, {color: status.color}]}>{status.label}</Text>
                            </TouchableOpacity>
                        </Right>
                        {/*END SET PUBLIC BUTTON*/}

                    </View>
                    {/*END TOP NAV*/}
                </View>
                {/*CONTENT*/}
                <View style={style.containerEditor}>
                    <Editor
                        refEditor={this.refEditor}
                    />
                </View>
                {/*END CONTENT*/}
                {/*END BODY*/}


                {/*FOOTER*/}
                <KeyboardAvoidingView behavior={isIOS ? 'position' : null}>
                    <View style={[styles.wrapperRowCenter, styles.wrapperBottom]}>
                        {/*CHOICE IMAGE BUTTON*/}
                        <TouchableOpacity
                            activeOpacity={0.6}
                            style={{paddingRight: 10}}
                            onPress={() => this.choiceImage()}
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
                            activeOpacity={0.6}
                            onPress={() => this.choiceVideo()}
                        >
                            <IconDefault
                                name={"Entypo|folder-video"}
                                size={20}
                                color={color.disableColor}
                            />
                        </TouchableOpacity>
                        {/*END CHOICE VIDEO BUTTON*/}
                    </View>
                </KeyboardAvoidingView>
                {/*END FOOTER*/}

                <ModalProcess
                    progress={this.state.progressUpload}
                    openModal={this.state.isUploading}
                />

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
        margin: 10,
        backgroundColor: color.background,

    },
    wrapperBottom: {
        width: deviceWidth,
        borderTopWidth: 0.5,
        borderColor: 'rgba(0,0,0,0.2)',
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
        paddingLeft: 5,
        paddingRight: 10,
    },
    containerEditor: {
        flex: 1,
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