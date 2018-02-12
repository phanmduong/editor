import React, {Component} from 'react';
import Icon from './Icon';

class IconDefault extends Component{
    render(){
        return(
            <Icon
                name={this.props.name}
                size={this.props.size ? this.props.size : 15}
                color={this.props.color ? this.props.color : "#000"}
                style={[{padding: 5, },this.props.style]}
            />
        );
    }
}

export default IconDefault;