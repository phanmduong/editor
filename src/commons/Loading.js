import React, {Component} from 'react';
import {
    View
} from 'react-native';
import {Spinner} from 'native-base';

class Loading extends Component{
    render(){
        return(
            <View style={{flexDirection: 'center', justifyContent: 'center'}}>
                <Spinner color={'gray'}/>
            </View>
        );
    }
}

export default Loading;