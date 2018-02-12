import React, {Component} from 'react';
import {
    TouchableOpacity,
    Text,
    View,
    Platform,
    StyleSheet,
    Dimensions,
} from 'react-native';
// NATIVE-BASE LIBRARY
import {Container, Content} from 'native-base';
// ICON LIBRARY
import IconDefault from '../../commons/IconDefault';
// TIME LIBRARY
import WebViewAutoHeight from '../../commons/WebViewAutoHeight';

class PostDetailContainer extends Component {
    render() {
        const {navigate} = this.props.navigation;
        const {goBack} = this.props.navigation;

        return (
            <Container style={styles.wrapperContainer}>
                {/*HEADER*/}
                <View
                    style={[styles.wrapperHeader, styles.paddingLeftRight, styles.wrapperRowSpaceBetween, styles.shadow]}>
                    <View style={styles.wrapperHeaderTitle}>
                        <Text style={[styles.textButton]} numberOfLines={1}>Title of post</Text>
                    </View>
                    {/*SAVE BUTTON*/}
                    <TouchableOpacity
                        onPress={() => navigate('EditorContainer')}
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

                {/*BODY*/}
                 <Content style={styles.wrapperBody}>
                    <WebViewAutoHeight
                        source={'<p></p><p style="text-align:start;"><span style="color: rgb(0,0,0);background-color: rgb(255,255,255);font-size: 14px;">Ngày 13/7 vừa qua, Cisco tuyên bố ý định mua lại Observable Networks, một công ty an ninh mạng chuyên về bảo mật cho dữ liệu đám mây. Kể từ tháng 6, Symantec cũng đã thu mua 3 công ty bảo mật là Skycure, Fireglass và Watchful Software. Trong khi đó, Microsoft đã chi tới 100 triệu USD để mua lại Hexadit</span></p><img src="https://www.w3schools.com/howto/img_fjords.jpg" alt="" style="height: 100%;width: 100%"/><p><span style="color: rgb(0,0,0);background-color: rgb(255,255,255);font-size: 14px;">Hexadite giờ đã nằm trong tay của Microsoft.</span></p><p style="text-align:start;"><span style="color: rgb(0,0,0);background-color: rgb(255,255,255);font-size: 14px;">Đại diện của Microsoft khẳng định: “Chưa bao giờ bảo mật và an ninh mạng lại gặp nhiều thách thức như hiện nay khi các cuộc tấn công sử dụng công nghệ ngày càng cao và không giới hạn đối tượng, Chúng tôi luôn ủng hộ và sẽ đầu tư nhiều hơn nữa vào các nền tảng số cho các doanh nghiệp cũng như tối ưu hóa việc vận hành trong một môi trường an toàn”.</span></p><p style="text-align:start;"><span style="color: rgb(0,0,0);background-color: rgb(255,255,255);font-size: 14px;">Với cơ hội phong phú và hậu thuẫn mạnh mẽ, các startup bảo mật hứa hẹn sẽ tạo nên một làn sóng mới trong thời gian tới.</span><br></p>'}/>
                </Content>
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
    wrapperHeaderTitle:{
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
}
const styles = StyleSheet.create(style)