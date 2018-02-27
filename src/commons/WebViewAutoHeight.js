import React from 'react';
import {WebView, View, Text, Dimensions} from "react-native";
import PropTypes from 'prop-types';

const BODY_TAG_PATTERN = /\<\/ *body\>/;

var script = `
;(function() {
var wrapper = document.createElement("div");
wrapper.id = "height-wrapper";

while (document.body.firstChild) {
    wrapper.appendChild(document.body.firstChild);
}
document.body.appendChild(wrapper);
var i = 0;
function updateHeight() {
    document.title = wrapper.clientHeight;
    window.location.hash = ++i;
}
updateHeight();
window.addEventListener("load", function() {
    updateHeight();
    setTimeout(updateHeight, 1000);
});
window.addEventListener("resize", updateHeight);
}());
`;


const style = `
<style>

#height-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
}
img, video{
width: 100%;
height: auto;
}
</style>
<script >
${script}
</script>
`;

const codeInject = (html) => html.replace(BODY_TAG_PATTERN, style + "</body>");

let {height, width} = Dimensions.get('window');

class WebViewAutoHeight extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            realContentHeight: this.props.minHeight
        };
        this.handleNavigationChange = this.handleNavigationChange.bind(this);
    }

    handleNavigationChange(navState) {
        if (navState.title) {
            const realContentHeight = parseInt(navState.title, 10) || 0;
            this.setState({realContentHeight});
        }
        if (typeof this.props.onNavigationStateChange === "function") {
            this.props.onNavigationStateChange(navState);
        }
    }

    render() {
        const {source, style, ...otherProps} = this.props;
        const html = '<!DOCTYPE html><html><head><meta charset=UTF-8"/></head><body>'
            +
            source
            +
            '</body></html>';


        if (!html) {
            throw new Error("WebViewAutoHeight supports only source.html");
        }

        if (!BODY_TAG_PATTERN.test(html)) {
            throw new Error("Cannot find </body> from: " + html);
        }

        return (
            <View>
                <WebView
                    {...otherProps}
                    source={{html: codeInject(html)}}
                    scrollEnabled={false}
                    style={{...style, ...{height: this.state.realContentHeight, width: width}}}
                    javaScriptEnabled
                    onNavigationStateChange={this.handleNavigationChange}
                />
            </View>
        );
    }

};

WebViewAutoHeight.propTypes = {
    source: PropTypes.string.isRequired,
    injectedJavaScript: PropTypes.string,
    minHeight: PropTypes.number,
    onNavigationStateChange: PropTypes.func,
    style: WebView.propTypes.style,
};

export default WebViewAutoHeight;