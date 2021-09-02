import React from 'react';

import {SynSetEdit} from "./synset-edit";

import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {appCreators} from "../actions/appActions";
import {Pagination} from "../common/pagination";

import '../css/synset.css';


export class SynSets extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            synSet: {},
            synSet_edit: false,

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
    deleteSynSetAsk(synSet) {
        if (synSet) {
            this.props.openDialog("are you sure you want to remove id " + synSet.word + "?",
                                    "Remove SynSet", (action) => { this.deleteSynSet(action) });
            this.setState({synSet: synSet});
        }
    }
    deleteSynSet(action) {
        if (action && this.state.synSet) {
            this.props.deleteSynSet(this.state.synSet.lemma);
        }
        if (this.props.closeDialog) {
            this.props.closeDialog();
        }
        this.setState({synSet_edit: false, synSet: {}});
    }
    handleSynSetFilterKeydown(event) {
        if (event.key === "Enter") {
            this.props.findSynSets();
        }
    }
    editSynSet(synSet) {
        this.setState({synSet_edit: true, synSet: synSet});
    }
    newSynSet() {
        this.setState({synSet_edit: true, synSet: {
                word: "",
                lemma: "",
                wordCloudCsvList: [],
            }});
    }
    save(synSet) {
        if (synSet) {
            if (synSet.word.trim().length > 0 && synSet.wordCloudCsvList.length > 1) {
                const list = synSet.wordCloudCsvList;
                let validList = true;
                for (const item of list) {
                    if (item.trim().length === 0) {
                        validList = false;
                    }
                }
                if (validList) {
                    this.props.saveSynSet(synSet);
                    this.setState({synSet_edit: false, synSet: {}});
                } else {
                    this.props.setError("Error Saving SynSet", "syn-set word-cloud items must not be empty.");
                }
            } else {
                this.props.setError("Error Saving SynSet", "syn-set cannot be empty and need more than one item");
            }
        } else {
            this.setState({synSet_edit: false, synSet: {}});
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
            <div className="synset-page">
                <SynSetEdit open={this.state.synSet_edit}
                            theme={theme}
                            synSet={this.state.synSet}
                            onSave={(item) => this.save(item)}
                            onError={(err) => this.props.setError("Error", err)} />

                {
                    this.isVisible() &&

                    <div className="filter-find-box">
                        <span className="filter-label">find synsets</span>
                        <span className="filter-find-text">
                            <input type="text" value={this.props.synset_filter} autoFocus={true}
                                   onKeyPress={(event) => this.handleSynSetFilterKeydown(event)}
                                   onChange={(event) => {
                                       this.props.setSynSetFilter(event.target.value)
                                   }}/>
                        </span>
                        <span className="filter-find-image">
                            <img className="image-size"
                                 onClick={() => this.props.findSynSets()}
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
                                    <th className='table-header'>syn-set</th>
                                    <th className='table-header'>actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.props.synset_list.map((synSet) => {
                                        return (
                                            <tr key={synSet.word}>
                                                <td>
                                                    <div className="synset-label">{synSet.word}</div>
                                                </td>
                                                <td>
                                                    <div className="link-button" onClick={() => this.editSynSet(synSet)}>
                                                        <img src="../images/edit.svg" className="image-size" title="edit syn-set" alt="edit"/>
                                                    </div>
                                                    <div className="link-button" onClick={() => this.deleteSynSetAsk(synSet)}>
                                                        <img src="../images/delete.svg" className="image-size" title="remove syn-set" alt="remove"/>
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
                                        <div className="image-button" onClick={() => this.newSynSet()}><img
                                            className="image-size" src="../images/add.svg" title="new syn-set"
                                            alt="new syn-set"/></div>
                                        }
                                    </td>
                                </tr>

                            </tbody>

                        </table>

                        <Pagination
                            rowsPerPageOptions={[5, 10, 25]}
                            theme={theme}
                            component="div"
                            count={this.props.synset_total_size}
                            rowsPerPage={this.props.synset_page_size}
                            page={this.props.synset_page}
                            onChangePage={(page) => this.props.setSynSetPage(page)}
                            onChangeRowsPerPage={(rows) => this.props.setSynSetPageSize(rows)}
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

        synset_list: state.appReducer.synset_list,
        synset_filter: state.appReducer.synset_filter,
        synset_page: state.appReducer.synset_page,
        synset_page_size: state.appReducer.synset_page_size,
        synset_total_size: state.appReducer.synset_total_size,

        selected_organisation_id: state.appReducer.selected_organisation_id,
        selected_organisation: state.appReducer.selected_organisation,
        selected_knowledgebase_id: state.appReducer.selected_knowledgebase_id,
    };
};

export default connect(
    mapStateToProps,
    dispatch => bindActionCreators(appCreators, dispatch)
)(SynSets);

