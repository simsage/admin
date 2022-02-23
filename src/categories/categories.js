import React from 'react';

import {CategoryEdit} from "./category-edit";

import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {appCreators} from "../actions/appActions";

import '../css/synset.css';

const empty_category = {
    metadata: "",
    category: "",
    wordCloud: ""
}

function create_empty_category() {
    return JSON.parse(JSON.stringify(empty_category));
}

export class Categories extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            category: empty_category,
            category_edit: false,

            openDialog: props.openDialog,
            closeDialog: props.closeDialog,
        };
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({
            openDialog: nextProps.openDialog,
            closeDialog: nextProps.closeDialog,
        });
    }
    componentDidCatch(error, info) {
        this.props.setError(error, info);
        console.log(error, info);
    }
    deleteCategoryAsk(category) {
        if (category && category.category && category.metadata) {
            this.props.openDialog("are you sure you want to remove category: " + category.metadata + "=" + category.category + "?",
                                    "Remove SynSet", (action) => { this.deleteCategory(action) });
            this.setState({category: category});
        }
    }
    deleteCategory(action) {
        if (action && this.state.category) {
            this.props.deleteCategory(this.state.category.category, this.state.category.metadata);
        }
        if (this.props.closeDialog) {
            this.props.closeDialog();
        }
        this.setState({category_edit: false, category: create_empty_category()});
    }
    editCategory(category) {
        this.setState({category_edit: true, category: category});
    }
    newCategory() {
        this.setState({category_edit: true, category: create_empty_category()});
    }
    save(category) {
        if (category) {
            if (category.metadata.trim().length > 0 && category.wordCloud.length > 1 && category.category.length > 0) {
                this.props.saveCategory(category);
                this.setState({category_edit: false, category: create_empty_category()});
            } else {
                this.props.setError("Error Saving document classification", "metadata, category, and/or word-cloud cannot be empty");
            }
        } else {
            this.setState({category_edit: false, category: create_empty_category()});
        }
    }
    isVisible() {
        return this.props.selected_organisation_id && this.props.selected_organisation_id.length > 0 &&
            this.props.selected_organisation && this.props.selected_organisation.length > 0 &&
            this.props.selected_knowledgebase_id && this.props.selected_knowledgebase_id.length > 0;
    }
    render() {
        const category_list = this.props.category_list ? this.props.category_list : [];
        return (
            <div className="synset-page">
                <CategoryEdit open={this.state.category_edit}
                              category={this.state.category}
                              onSave={(item) => this.save(item)}
                              onError={(err) => this.props.setError("Error", err)} />

                {
                    this.isVisible() &&
                    <div>
                        <table className="table">
                            <thead>
                                <tr className='table-header'>
                                    <th className='table-header'>metadata</th>
                                    <th className='table-header'>category</th>
                                    <th className='table-header'>actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    category_list.map((category, i) => {
                                        return (
                                            <tr key={i}>
                                                <td>
                                                    <div className="synset-label">{category.metadata} </div>
                                                </td>
                                                <td>
                                                    <div className="synset-label">{category.category}</div>
                                                </td>
                                                <td>
                                                    <div className="link-button" onClick={() => this.editCategory(category)}>
                                                        <img src="../images/edit.svg" className="image-size" title="edit syn-set" alt="edit"/>
                                                    </div>
                                                    <div className="link-button" onClick={() => this.deleteCategoryAsk(category)}>
                                                        <img src="../images/delete.svg" className="image-size" title="remove syn-set" alt="remove"/>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                                <tr>
                                    <td/>
                                    <td/>
                                    <td>
                                        {this.isVisible() &&
                                        <div className="image-button" onClick={() => this.newCategory()} title="add a new categpry"><img
                                            className="image-size" src="../images/add.svg"
                                            alt="new"/>&nbsp;new</div>
                                        }
                                    </td>
                                </tr>

                            </tbody>

                        </table>

                    </div>
                }

            </div>
        )
    }
}

const mapStateToProps = function(state) {
    return {
        error: state.appReducer.error,
        error_title: state.appReducer.error_title,
        theme: state.appReducer.theme,

        category_list: state.appReducer.category_list,

        selected_organisation_id: state.appReducer.selected_organisation_id,
        selected_organisation: state.appReducer.selected_organisation,
        selected_knowledgebase_id: state.appReducer.selected_knowledgebase_id,
    };
};

export default connect(
    mapStateToProps,
    dispatch => bindActionCreators(appCreators, dispatch)
)(Categories);

