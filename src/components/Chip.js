import React, {Component} from 'react';


export class Chip extends Component {
    render() {
        return (
            <div className="role-chip" onClick={() => this.props.onClick()}>
                {this.props.label}
            </div>
        )
    }
}

