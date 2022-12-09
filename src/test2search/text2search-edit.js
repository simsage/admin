import React, {Component} from 'react';

import '../css/synonyms.css';


export class Text2SearchEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            has_error: false,
            open: props.open,
            onSave: props.onSave,
            onError: props.onError,
            searchPart: props.text2search && props.text2search.searchPart ? props.text2search.searchPart : "",
            type: props.text2search && props.text2search.type ? props.text2search.type : "",
            matchWords: props.text2search && props.text2search.matchWords ? props.text2search.matchWords : "",
        };
    }
    componentDidCatch(error, info) {
        this.setState({ has_error: true });
        console.log(error, info);
    }
    handleSave() {
        if (this.state.onSave) {
            this.state.onSave({searchPart: this.state.searchPart, type: this.state.type, matchWords: this.state.matchWords});
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
            onSave: props.onSave,
            onError: props.onError,
            searchPart: props.text2search && props.text2search.searchPart ? props.text2search.searchPart : "",
            type: props.text2search && props.text2search.type ? props.text2search.type : "",
            matchWords: props.text2search && props.text2search.matchWords ? props.text2search.matchWords : "",
        })
    }
    render() {
        if (this.state.has_error) {
            return <h1>text2search-edit.js: Something went wrong.</h1>;
        }
        if (!this.state.open)
            return (<div />);
        return (
            <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline"}}>
                <div className={"modal-dialog modal-dialog-centered modal-xl"} role="document">
                    <div className="modal-content shadow p-3 mb-5 bg-white rounded synonym-page">

                        <div className="modal-header">Edit</div>
                        <div className="modal-body">
                            <div>

                                <div className="edit-row">
                                    <span className="label-area">search part</span>
                                    <span className="input-area">
                                        <input type="text" className="input-area"
                                                  autoFocus={true}
                                                  onChange={(event) => this.setState({searchPart: event.target.value})}
                                                  placeholder="search part (entity: entity-type, sort(), group(), source(), empty (), or doc(metadata,value))"
                                                  spellCheck={false}
                                                  value={this.state.searchPart}
                                        />
                                    </span>
                                </div>

                                <div className="edit-row">
                                    <span className="label-area">type</span>
                                    <span className="input-area">
                                        <input type="text" className="input-area"
                                               onChange={(event) => this.setState({type: event.target.value})}
                                               placeholder="type (and or sub)"
                                               spellCheck={false}
                                               value={this.state.type}
                                        />
                                    </span>
                                </div>

                                <div className="edit-row">
                                    <span className="label-area">match words csv</span>
                                    <span className="input-area">
                                        <textarea className="input-area"
                                                  onChange={(event) => this.setState({matchWords: event.target.value})}
                                                  placeholder="match words csv (list of comma separated items for language matching, try not to use single words)"
                                                  spellCheck={false}
                                                  rows={10}
                                                  value={this.state.matchWords}
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

export default Text2SearchEdit;
