import React, {Component} from 'react';

import '../css/synonyms.css';


export class SynonymEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            has_error: false,
            open: props.open,
            synonym: props.synonym,
            onSave: props.onSave,
            onError: props.onError,
            words: props.synonym && props.synonym.words ? props.synonym.words : "",
        };
    }
    componentDidCatch(error, info) {
        this.setState({ has_error: true });
        console.log(error, info);
    }
    handleSave() {
        if (this.state.onSave) {
            const syn = this.state.synonym;
            syn.words = this.state.words;
            this.state.onSave(syn);
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
            synonym: props.synonym,
            onSave: props.onSave,
            onError: props.onError,
            words: props.synonym && props.synonym.words ? props.synonym.words : "",
        })
    }
    render() {
        if (this.state.has_error) {
            return <h1>synonym-edit.js: Something went wrong.</h1>;
        }
        if (!this.state.open)
            return (<div />);
        return (
            <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline"}}>
                <div className={"modal-dialog modal-dialog-centered modal-xl"} role="document">
                    <div className="modal-content shadow p-3 mb-5 bg-white rounded synonym-page">

                        <div className="modal-header">Edit Synonym</div>
                        <div className="modal-body">
                            <div>

                                <div className="edit-row">
                                    <span className="label-area">synonyms</span>
                                    <span className="input-area">
                                        <textarea className="input-area"
                                                  autoFocus={true}
                                                  onChange={(event) => this.setState({words: event.target.value})}
                                                  placeholder="words"
                                                  spellCheck={false}
                                                  rows={10}
                                                  value={this.state.words}
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

export default SynonymEdit;
