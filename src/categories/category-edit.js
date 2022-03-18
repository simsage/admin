import React, {Component} from 'react';

import {Api} from '../common/api'

import '../css/category.css';


export class CategoryEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            has_error: false,
            open: props.open,

            displayName: "",
            metadata: "",
            categorizationList: [{category: "", wordCloud: ""}],
        };
    }
    componentDidCatch(error, info) {
        this.setState({ has_error: true });
        console.log(error, info);
    }
    handleSave() {
        if (this.props.onSave) {
            if (this.state.displayName.trim().length > 0 && this.state.metadata.trim().length > 0 && this.state.categorizationList.length > 0) {
                this.props.onSave({displayName: this.state.displayName, metadata: this.state.metadata, categorizationList: this.state.categorizationList});
            } else if (this.props.onError) {
                this.props.onError("display-name, metadata, and category-list cannot be empty");
            }
        }
    }
    handleCancel() {
        if (this.props.onSave) {
            this.props.onSave(null);
        }
    }
    UNSAFE_componentWillReceiveProps(props) {
        const categorizationList = props.category && Api.defined(props.category.categorizationList) ? props.category.categorizationList : [];
        if (categorizationList.length === 0) {
            categorizationList.push({category: "", wordCloud: ""});
        }
        this.setState({
            open: props.open,

            displayName: props.category && Api.defined(props.category.displayName) ? props.category.displayName : "",
            metadata: props.category && Api.defined(props.category.metadata) ? props.category.metadata : "",
            categorizationList: categorizationList,
        })
    }
    newCategory() {
        const cl = this.state.categorizationList;
        cl.push({category: "", wordCloud: ""});
        this.setState({categorizationList: cl});
    }
    deleteCategory(index) {
        const newList = [];
        const cl = this.state.categorizationList;
        for (let i = 0; i < cl.length; i++) {
            if (i !== index) {
                newList.push(cl[i]);
            }
        }
        this.setState({categorizationList: newList});
    }
    getCategory(index) {
        const cl = this.state.categorizationList;
        if (index >= 0 && index < cl.length) {
            return cl[index].category;
        }
        return "";
    }
    setCategory(index, text) {
        const cl = this.state.categorizationList;
        if (index >= 0 && index < cl.length) {
            cl[index].category = text;
            this.setState({categorizationList: cl});
        }
    }
    getWC(index) {
        const cl = this.state.categorizationList;
        if (index >= 0 && index < cl.length) {
            return cl[index].wordCloud;
        }
        return "";
    }
    setWC(index, text) {
        const cl = this.state.categorizationList;
        if (index >= 0 && index < cl.length) {
            cl[index].wordCloud = text;
            this.setState({categorizationList: cl});
        }
    }
    render() {
        if (this.state.has_error) {
            return <h1>category-edit.js: Something went wrong.</h1>;
        }
        const categorizationList = this.state.categorizationList;
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
                                    <span className="label-2">display name</span>
                                    <span className="text">
                                        <input type="text" className="form-control"
                                               autoFocus={true}
                                               onChange={(event) => this.setState({displayName: event.target.value})}
                                               placeholder={"display name"}
                                               value={this.state.displayName} />
                                    </span>
                                </div>

                                <div className="control-row">
                                    <span className="label-2">metadata name</span>
                                    <span className="text">
                                        <input type="text" className="form-control"
                                               onChange={(event) => this.setState({metadata: event.target.value})}
                                               placeholder={"metadata name (key)"}
                                               value={this.state.metadata} />
                                    </span>
                                </div>

                                {
                                    categorizationList && categorizationList.map((item, index) => {
                                        return (
                                            <div key={index} className="category-list">
                                                <div className="category-row">
                                                    <span className="label-area">description / value</span>
                                                    <span className="category-text-area-width">
                                                        <input type="text" className="form-control"
                                                               onChange={(event) => this.setCategory(index, event.target.value)}
                                                               placeholder={"metadata value"}
                                                               value={this.getCategory(index)} />
                                                    </span>
                                                </div>

                                                <div className="category-row">
                                                    <span className="label-area">{"word cloud "}</span>
                                                    <span className="category-area-width">
                                                        <textarea className="input-area category-text-area-width"
                                                                  onChange={(event) => this.setWC(index, event.target.value)}
                                                                  placeholder={"word-cloud for identifying members of this category"}
                                                                  rows={4}
                                                                  value={this.getWC(index)}
                                                        />
                                                    </span>
                                                    {
                                                        index > 0 &&
                                                        <div className="category-trashcan"
                                                             onClick={() => this.deleteCategory(index)}>
                                                            <img src="../images/delete.svg" className="image-size" title="remove category" alt="remove category"/>
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                        )
                                    })
                                }

                            </div>

                            <br clear="both" />

                            <div className="new-syn-button" onClick={() => this.newCategory()}>
                                <img src="../images/add.svg" title="add a new category" className="image-size" alt="add a new category"/>
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
