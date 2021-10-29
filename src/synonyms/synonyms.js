import React from 'react';

import {SynonymEdit} from "./synonym-edit";

import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {appCreators} from "../actions/appActions";
import {Pagination} from "../common/pagination";

import '../css/synonyms.css';


export class Synonyms extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            synonym: {},
            synonym_edit: false,

            openDialog: props.openDialog,
            closeDialog: props.closeDialog,

            // pagination
            page_size: 5,
            page: 0,
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
    changePage(page) {
        this.setState({page: page});
    }
    changePageSize(page_size) {
        this.setState({page_size: page_size});
    }
    getSynonymList() {
        return this.props.synonym_list;
    }
    deleteSynonymAsk(synonym) {
        if (synonym) {
            this.props.openDialog("are you sure you want to remove id " + synonym.id + "?<br/><br/>(" + synonym.words + ")",
                                    "Remove Synonym", (action) => { this.deleteSynonym(action) });
            this.setState({synonym: synonym});
        }
    }
    deleteSynonym(action) {
        if (action && this.state.synonym) {
            this.props.deleteSynonym(this.state.synonym.id);
        }
        if (this.props.closeDialog) {
            this.props.closeDialog();
        }
        this.setState({synonym_edit: false, synonym: {}});
    }
    handleSearchTextKeydown(event) {
        if (event.key === "Enter") {
            this.props.getSynonyms();
        }
    }
    editSynonym(synonym) {
        this.setState({synonym_edit: true, synonym: synonym});
    }
    newSynonym() {
        this.setState({synonym_edit: true, synonym: {
                id: "",
                words: "",
            }});
    }
    save(synonym) {
        if (synonym) {
            if (synonym.words.length > 0 && synonym.words.indexOf(",") > 0) {
                this.props.saveSynonym(synonym);
                this.setState({synonym_edit: false, synonym: {}});
            } else {
                this.props.setError("Error Saving Synonym", "synonym cannot be empty and need more than one item");
            }
        } else {
            this.setState({synonym_edit: false, synonym: {}});
        }
    }
    isVisible() {
        return this.props.selected_organisation_id && this.props.selected_organisation_id.length > 0 &&
            this.props.selected_organisation && this.props.selected_organisation.length > 0 &&
            this.props.selected_knowledgebase_id && this.props.selected_knowledgebase_id.length > 0;
    }
    render() {
        const theme = this.props.theme;
        return (
            <div>
                <SynonymEdit open={this.state.synonym_edit}
                             theme={theme}
                             synonym={this.state.synonym}
                             onSave={(item) => this.save(item)}
                             onError={(err) => this.props.setError("Error", err)} />

                {
                    this.isVisible() &&

                    <div className="filter-find-box">
                        <span className="filter-label">find synonyms</span>
                        <span className="filter-find-text">
                            <input type="text" value={this.props.synonym_filter} autoFocus={true} className={"filter-text-width " + theme}
                                   onKeyPress={(event) => this.handleSearchTextKeydown(event)}
                                   onChange={(event) => {
                                       this.props.setSynonymFilter(event.target.value)
                                   }}/>
                        </span>
                        <span className="filter-find-image">
                            <img className="image-size"
                                 onClick={() => this.props.getSemantics()}
                                 src="../images/dark-magnifying-glass.svg" title="search" alt="search"/>
                        </span>
                    </div>
                }

                <br clear="both" />

                {
                    this.isVisible() &&
                    <div>
                        <table className="table">
                            <thead>
                                <tr className='table-header'>
                                    <th className='table-header'>id</th>
                                    <th className='table-header synonym-column-width'>synonyms</th>
                                    <th className='table-header'>actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.getSynonymList().map((synonym) => {
                                        return (
                                            <tr key={synonym.id}>
                                                <td>
                                                    <div>{synonym.id}</div>
                                                </td>
                                                <td>
                                                    <div>{synonym.words}</div>
                                                </td>
                                                <td>
                                                    <div className="link-button" onClick={() => this.editSynonym(synonym)}>
                                                        <img src="../images/edit.svg" className="image-size" title="edit synonym" alt="edit"/>
                                                    </div>
                                                    <div className="link-button" onClick={() => this.deleteSynonymAsk(synonym)}>
                                                        <img src="../images/delete.svg" className="image-size" title="remove synonym" alt="remove"/>
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
                                        <div onClick={() => this.newSynonym()}><img
                                            className="image-size" src="../images/add.svg" title="new synonym"
                                            alt="new synonym"/></div>
                                        }
                                    </td>
                                </tr>

                            </tbody>

                        </table>

                        <Pagination
                            theme={theme}
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={this.props.num_synonyms}
                            rowsPerPage={this.props.synonym_page_size}
                            page={this.props.synonym_page}
                            backIconButtonProps={{
                                'aria-label': 'Previous Page',
                            }}
                            nextIconButtonProps={{
                                'aria-label': 'Next Page',
                            }}
                            onChangePage={(page) => this.props.setSynonymPage(page)}
                            onChangeRowsPerPage={(rows) => this.props.setSynonymPageSize(rows)}
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

        synonym_list: state.appReducer.synonym_list,
        synonym_filter: state.appReducer.synonym_filter,
        synonym_page: state.appReducer.synonym_page,
        synonym_page_size: state.appReducer.synonym_page_size,
        num_synonyms: state.appReducer.num_synonyms,

        selected_organisation_id: state.appReducer.selected_organisation_id,
        selected_organisation: state.appReducer.selected_organisation,
        selected_knowledgebase_id: state.appReducer.selected_knowledgebase_id,
    };
};

export default connect(
    mapStateToProps,
    dispatch => bindActionCreators(appCreators, dispatch)
)(Synonyms);

