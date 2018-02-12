import React from 'react';
import * as Progress from 'react-native-progress';
import Modal from 'react-native-modalbox';
import {Text, StyleSheet} from "react-native";

class ModalProcess extends React.Component {
    constructor(props, context) {
        super(props, context);

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.openModal !== this.props.openModal && nextProps.openModal) {
            this._modal.open();
        }
        if (nextProps.openModal !== this.props.openModal && !nextProps.openModal) {
            this._modal.close();
        }
    }

    render() {
        return (
            <Modal
                style={styles.modal}
                position={"center"}
                ref={(modal) => {
                    this._modal = modal
                }}
                isDisabled={false}
                backdropPressToClose={false}
                swipeToClose={false}
            >
                <Progress.Circle
                    size={150}
                    progress={this.props.progress}
                    color="#C50000"
                    showsText
                    formatText={(progressValue) => {
                        return parseInt(progressValue * 100) + '%';
                    }}
                />
                <Text style={{fontSize: 20, marginTop: 16}}>
                    Uploading...
                </Text>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 300,
        width: 300
    }
});

export default ModalProcess;