import React, {Component} from 'react';

import '../css/autocomplete.css';


export class AutoComplete extends Component {
    constructor(props) {
        super(props);
        this.state = {
            has_error: false,
        }
    }
    componentDidCatch(error, info) {
        this.setState({ has_error: true });
    }
    select(value) {
        if (this.props.onSelect) {
            if (value && value.length > 0) {
                for (const item of this.props.data_list) {
                    if (item.id === value) {
                        this.props.onSelect(item);
                        break;
                    }
                }
            } else {
                this.props.onSelect("");
            }
        }
    }
    render() {
        if (this.state.has_error) {
            return (<h1>auto-complete.js: Something went wrong.</h1>);
        }
        const value = (this.props.value && this.props.value !== "") ? this.props.value : "null";
        const list = this.props.data_list ? this.props.data_list : [];
        return (
            <div className="select-control">
                <span className="select-label">{this.state.label}</span>
                <span className="select-box">
                    <select className="form-select" value={value}
                            onChange={(event) => this.select(event.target.value)}>
                        <option value="null">not selected</option>
                        {
                            list.map((suggestion, index) => {
                                return (<option value={suggestion.id} key={index}>{suggestion.name}</option>);
                            })
                        }
                    </select>
                </span>
            </div>
        )
    }
}

export default AutoComplete;
