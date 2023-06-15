import React from 'react';

import {CategoryEdit} from "./category-edit";

import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {appCreators} from "../actions/appActions";

import '../css/synset.css';
import {Pagination} from "../common/pagination";

const empty_category = {
    categorizationLabel: "",
    rule: "",
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
    }
    deleteCategorizationRuleAsk(category) {
        if (category && category.categorizationLabel) {
            this.props.openDialog("are you sure you want to remove category: " + category.categorizationLabel + "?",
                                    "Remove Document Categorization rule", (action) => { this.deleteCategorizationRule(action) });
            this.setState({category: category});
        }
    }
    deleteCategorizationRule(action) {
        if (action && this.state.category && this.state.category.categorizationLabel) {
            this.props.deleteCategorizationRule(this.state.category.categorizationLabel);
        }
        if (this.props.closeDialog) {
            this.props.closeDialog();
        }
        this.setState({category_edit: false, category: create_empty_category()});
    }
    editCategorizationRule(category) {
        this.setState({category_edit: true, category: category});
    }
    newCategorizationRule() {
        this.setState({category_edit: true, category: create_empty_category()});
    }
    saveCategorizationRule(category) {
        if (category) {
            if (category.categorizationLabel.trim().length > 1 && (category.rule.trim().length > 2 || category.rule.trim() === "()")) {
                this.props.saveCategorizationRule(category);
                this.setState({category_edit: false, category: create_empty_category()});
            } else {
                this.props.setError("Error Saving document categorization rule", "categorization label, and rule cannot be empty");
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
        const categorization_list = this.props.categorization_list ? this.props.categorization_list : [];
        const theme = this.props.theme;
        return (
            <div className="synset-page">
                <CategoryEdit open={this.state.category_edit}
                              category={this.state.category}
                              onSave={(item) => this.saveCategorizationRule(item)}
                              onError={(err) => this.props.setError("Error", err)} />

                {
                    this.isVisible() &&
                    <div>
                        <table className="table">
                            <thead>
                                <tr className='table-header'>
                                    <th className='table-header'>category label</th>
                                    <th className='table-header'>actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    categorization_list.map((category, i) => {
                                        return (
                                            <tr key={i}>
                                                <td>
                                                    <div className="synset-label">{category.categorizationLabel} </div>
                                                </td>
                                                <td>
                                                    <div className="link-button" onClick={() => this.editCategorizationRule(category)}>
                                                        <img src="images/edit.svg" className="image-size" title="edit syn-set" alt="edit"/>
                                                    </div>
                                                    <div className="link-button" onClick={() => this.deleteCategorizationRuleAsk(category)}>
                                                        <img src="images/delete.svg" className="image-size" title="remove syn-set" alt="remove"/>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                                <tr>
                                    <td/>
                                    <td>
                                        {this.isVisible() &&
                                        <div className="image-button" onClick={() => this.newCategorizationRule()} title="add a new categorization label"><img
                                            className="image-size" src="images/add.svg"
                                            alt="new"/>&nbsp;new</div>
                                        }
                                    </td>
                                </tr>

                            </tbody>

                        </table>

                        <Pagination
                            theme={theme}
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={this.props.num_categorizations}
                            rowsPerPage={this.props.categorization_page_size}
                            page={this.props.categorization_page}
                            backIconButtonProps={{
                                'aria-label': 'Previous Page',
                            }}
                            nextIconButtonProps={{
                                'aria-label': 'Next Page',
                            }}
                            onChangePage={(page) => this.props.setCategorizationPage(page)}
                            onChangeRowsPerPage={(rows) => this.props.setCategorizationPageSize(rows)}
                        />


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

        categorization_list: state.appReducer.categorization_list,

        selected_organisation_id: state.appReducer.selected_organisation_id,
        selected_organisation: state.appReducer.selected_organisation,
        selected_knowledgebase_id: state.appReducer.selected_knowledgebase_id,
        num_categorizations: state.appReducer.num_categorizations,
        categorization_page: state.appReducer.categorization_page,
        categorization_page_size: state.appReducer.categorization_page_size,
    };
};

export default connect(
    mapStateToProps,
    dispatch => bindActionCreators(appCreators, dispatch)
)(Categories);

