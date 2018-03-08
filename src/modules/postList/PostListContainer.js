import React, {Component} from 'react';
import {
    Image,
    Text,
    TouchableOpacity,
    View,
    Platform,
    StyleSheet,
    Dimensions, AsyncStorage,
} from 'react-native';
// NATIVE-BASE LIBRARY
import {Container, Content} from 'native-base';
// ICON LIBRARY
import IconDefault from '../../commons/IconDefault';

class PostListContainer extends Component {
    constructor() {
        super();
        this.state = {
            title: ''
        }
    }

    componentWillMount() {
        this.getData();
    }

    async getData() {
        try {
            var post = await AsyncStorage.getItem('@Editor:editor');

            post = JSON.parse(post);

            this.setState({
                title: post ? post.title : ''
            });

        }

        catch (error) {
        }
    };

    render() {
        const {navigate} = this.props.navigation;
        return (
            <Container style={styles.wrapperContainer}>
                {/*HEADER*/}
                <View
                    style={[styles.wrapperHeader, styles.paddingLeftRight, styles.wrapperRowSpaceBetween, styles.shadow]}>
                    <TouchableOpacity style={styles.wrapperRowCenter}>
                        <Text>LOGO</Text>
                    </TouchableOpacity>
                    {/*SAVE BUTTON*/}
                    <TouchableOpacity
                        onPress={() => navigate('EditorContainer')}
                    >
                        <IconDefault
                            name={"Ionicons|ios-create-outline"}
                            size={25}
                            style={{paddingRight: 0}}
                        />
                    </TouchableOpacity>
                    {/*END SAVE BUTTON*/}
                </View>
                {/*END HEADER*/}

                {/*BODY*/}
                <Container style={styles.wrapperBody}>
                    {/*CONTENT*/}
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => navigate('PostDetailContainer', {
                                id: 1,
                            }
                        )}
                    >
                        <View style={styles.imagePost}>
                            <Image
                                resizeMode={'cover'}
                                source={{uri: 'https://www.w3schools.com/howto/img_fjords.jpg'}}
                                style={[styles.imagePost]}
                            />
                        </View>
                        <View style={styles.marginTopBottom}>
                            <Text style={styles.textTitlePost}>{this.state.title}</Text>
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={() => navigate('EditorContainer', {
                                        diaty: "data"
                                    }
                                )}
                            >
                                <Text style={{fontSize: 20}}>Edit</Text>
                            </TouchableOpacity>

                        </View>
                    </TouchableOpacity>
                    {/*END CONTENT*/}
                </Container>
                {/*END BODY*/}


            </Container>
        );
    }
}

export default (PostListContainer)

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
    marginLeftRight: {
        marginLeft: 10,
        marginRight: 10,
    },
    marginTopBottom: {
        marginTop: 10,
        marginBottom: 10,
    },
    imagePost: {
        borderRadius: 15,
        height: deviceHeight / 3,
        backgroundColor: color.background
    },
    textTitlePost: {
        fontWeight: 'bold'
    }

}
const styles = StyleSheet.create(style)