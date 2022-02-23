import React, {Component} from 'react';

import {Api} from '../common/api'

import '../css/synset.css';


export class CategoryEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            has_error: false,
            open: props.open,

            metadata: "",
            category: "",
            wordCloud: "",
        };
    }
    componentDidCatch(error, info) {
        this.setState({ has_error: true });
        console.log(error, info);
    }
    handleSave() {
        if (this.props.onSave) {
            if (this.state.metadata.trim().length > 0 && this.state.wordCloud.trim().length > 1 && this.state.category.trim().length > 0) {
                this.props.onSave({metadata: this.state.metadata, category: this.state.category, wordCloud: this.state.wordCloud});
            } else if (this.props.onError) {
                this.props.onError("metadata, category and word-cloud cannot be empty");
            }
        }
    }
    handleCancel() {
        if (this.props.onSave) {
            this.props.onSave(null);
        }
    }
    UNSAFE_componentWillReceiveProps(props) {
        this.setState({
            open: props.open,

            metadata: props.category && Api.defined(props.category.metadata) ? props.category.metadata : "",
            category: props.category && Api.defined(props.category.category) ? props.category.category : "",
            wordCloud: props.category && Api.defined(props.category.wordCloud) ? props.category.wordCloud : "",
        })
    }
    render() {
        if (this.state.has_error) {
            return <h1>category-edit.js: Something went wrong.</h1>;
        }
        if (!this.state.open)
            return (<div />);
        return (
            <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline"}}>
                <div className={"modal-dialog modal-dialog-centered modal-xl"} role="document">
                    <div className="modal-content shadow p-3 mb-5 bg-white rounded">

                        <div className="modal-header">Edit category</div>
                        <div className="modal-body">
                            <div>

                                <div className="control-row">
                                    <span className="label-2">metadata name</span>
                                    <span className="text">
                                        <input type="text" className="form-control"
                                               autoFocus={true}
                                               onChange={(event) => this.setState({metadata: event.target.value})}
                                               placeholder={"metadata name (key)"}
                                               value={this.state.metadata} />
                                    </span>
                                </div>

                                <div className="control-row">
                                    <span className="label-2">category word</span>
                                    <span className="text">
                                        <input type="text" className="form-control"
                                               onChange={(event) => this.setState({category: event.target.value})}
                                               placeholder={"metadata value"}
                                               value={this.state.category} />
                                    </span>
                                </div>

                                <div className="edit-row">
                                    <span className="label-area">{"word cloud "}</span>
                                    <span className="input-area synset-area-width">
                                        <textarea className="input-area synset-text-area-width"
                                                  onChange={(event) => this.setState({wordCloud: event.target.value})}
                                                  placeholder={"word-cloud for this category"}
                                                  rows={4}
                                                  value={this.state.wordCloud}
                                        />
                                    </span>
                                </div>
                            </div>

                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-primary btn-block" onClick={() => this.handleCancel()}>Cancel</button>
                            <button className="btn btn-primary btn-block" onClick={() => this.handleSave()}>Save</button>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}

export default CategoryEdit;
