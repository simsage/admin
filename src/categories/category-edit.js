import React, {Component} from 'react';

import {Api} from '../common/api'

import '../css/category.css';


export class CategoryEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            has_error: false,
            open: props.open,
            categorizationLabel: props.category && props.category.categorizationLabel ? props.category.categorizationLabel : "",
            rule: props.category && props.category.rule ? props.category.rule : "",
        };
    }
    componentDidCatch(error, info) {
        this.setState({ has_error: true });
        console.log(error, info);
    }

    // mirrors RockUtils.isValidMetadataName(str) on server-side
    isValidLabel(str) {
        if (str && str.length > 0) {
            for (let i = 0; i < str.length; i++) {
                if (!((str[i] >= 'a' && str[i] <= 'z') || (str[i] >= 'A' && str[i] <= 'Z') ||
                      (str[i] >= '0' && str[i] <= '9') || str[i] === '-' || str[i] === '_')) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }

    handleSave() {
        if (this.props.onSave) {
            if (this.state.categorizationLabel.trim().length > 1 && (this.state.rule.trim().length > 2 || this.state.rule.trim() === "()")) {
                if (!this.isValidLabel(this.state.categorizationLabel)) {
                    this.props.onError("Invalid characters in metadata label.  A label can only contain numbers (0..9), letters (a..z, A..Z) or underscore (_) or hyphen (-).");
                } else {
                    this.props.onSave({categorizationLabel: this.state.categorizationLabel, rule: this.state.rule});
                }
            } else if (this.props.onError) {
                this.props.onError("categorization label and rule cannot be empty");
            }
        }
    }
    handleCancel() {
        if (this.props.onSave) {
            this.props.onSave(null);
        }
    }
    UNSAFE_componentWillReceiveProps(props) {
        if (props.category) {
            const cat = props.category;
            this.setState({
                open: props.open,
                categorizationLabel: cat.categorizationLabel && Api.defined(cat.categorizationLabel) ? cat.categorizationLabel : "",
                rule: cat.rule && Api.defined(cat.rule) ? cat.rule : "",
            })
        }
    }
    render() {
        if (this.state.has_error) {
            return <h1>category-edit.js: Something went wrong.</h1>;
        }
        if (!this.state.open)
            return (<div />);
        return (
            <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline"}}>
                <div className="modal-dialog modal-dialog-centered modal-xl category-page" role="document">
                    <div className="modal-content shadow p-3 mb-5 bg-white rounded">

                        <div className="modal-header">Edit category</div>
                        <div className="modal-body">
                            <div>

                                <div className="control-row">
                                    <span className="label-2">category label</span>
                                    <span className="text">
                                        <input type="text" className="form-control"
                                               autoFocus={true}
                                               onChange={(event) => this.setState({categorizationLabel: event.target.value})}
                                               placeholder={"display name"}
                                               value={this.state.categorizationLabel} />
                                    </span>
                                </div>

                                <div className="control-row">
                                    <span className="label-2">rule</span>
                                    <span className="text">
                                        <textarea className="input-area category-text-area-width"
                                                  onChange={(event) => this.setState({rule: event.target.value})}
                                                  placeholder={"SimSage rule defining the matching criteria (or () for catch-all if nothing else matches rule)"}
                                                  rows={4}
                                                  value={this.state.rule}
                                        />
                                    </span>
                                </div>

                            </div>

                            <br clear="both" />
                            <br clear="both" />
                            <br clear="both" />

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
