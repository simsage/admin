import React, {Component} from 'react';

import '../css/semantics.css';


export class SemanticEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            has_error: false,
            open: props.open,
            semantic: props.semantic,
            onSave: props.onSave,
            onError: props.onError,
            word: props.semantic && props.semantic.word ? props.semantic.word: "",
            semantic_str: props.semantic && props.semantic.semantic ? props.semantic.semantic: "",
        };
    }
    componentDidCatch(error, info) {
        this.setState({ has_error: true });
        console.log(error, info);
    }
    handleSave() {
        if (this.state.onSave) {
            this.state.onSave({"word": this.state.word, "prevWord": "", "semantic": this.state.semantic_str});
        }
    }
    handleCancel() {
        if (this.state.onSave) {
            this.state.onSave(null);
        }
    }
    UNSAFE_componentWillReceiveProps(props) {
        this.setState({
            open: props.open,
            semantic: props.semantic,
            onSave: props.onSave,
            onError: props.onError,
            word: props.semantic && props.semantic.word ? props.semantic.word: "",
            semantic_str: props.semantic && props.semantic.semantic ? props.semantic.semantic: "",
        })
    }
    render() {
        if (this.state.has_error) {
            return <h1>semantic-edit.js: Something went wrong.</h1>;
        }
        if (!this.state.open)
            return (<div />);
        return (
            <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline"}}>
                <div className={"modal-dialog modal-dialog-centered modal-lg"} role="document">
                    <div className="modal-content shadow p-3 mb-5 bg-white rounded">

                        <div className="modal-header">Edit Semantic</div>
                        <div className="modal-body">
                            <div>

                                <div className="control-row">
                                    <span className="label-2">word</span>
                                    <span className="text">
                                        <input type="text" className="form-control"
                                            autoFocus={true}
                                            onChange={(event) => this.setState({word: event.target.value})}
                                            placeholder="word"
                                            value={this.state.word}
                                        />
                                    </span>
                                </div>

                                <div className="control-row">
                                    <span className="label-2">semantic</span>
                                    <span className="text">
                                        <input type="text" className="form-control"
                                            onChange={(event) => this.setState({semantic_str: event.target.value})}
                                            placeholder="semantic"
                                            value={this.state.semantic_str}
                                        />
                                    </span>
                                </div>

                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-primary btn-block"  onClick={() => this.handleCancel()}>Cancel</button>
                            <button className="btn btn-primary btn-block"  onClick={() => this.handleSave()}>Save</button>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}

export default SemanticEdit;
