import React from 'react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import {SynSetEdit} from "./synset-edit";
import TablePagination from "@material-ui/core/TablePagination";

import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {appCreators} from "../actions/appActions";


const styles = {
    tableStyle: {
        minWidth: '800px',
        width: '900px',
    },
    smallTableHeaderStyle: {
        background: '#555',
        fontSize: '0.95em',
        color: '#fff',
        minWidth: '20px',
    },
    actionTableHeaderStyle: {
        background: '#555',
        fontSize: '0.95em',
        color: '#fff',
        minWidth: '100px',
    },
    tableHeaderStyle: {
        background: '#555',
        fontSize: '0.95em',
        color: '#fff',
        minWidth: '400px',
        width: '600px',
    },
    searchTableHeaderStyle: {
        background: '#555',
        fontSize: '0.95em',
        color: '#fff',
        minWidth: '200px',
        width: '340px',
    },
    knowledgeSelect: {
        padding: '5px',
        marginBottom: '40px',
    },
    lhs: {
        float: 'left',
        width: '150px',
        marginTop: '-10px',
        color: '#aaa',
    },
    rhs: {
        float: 'left',
    },
    label: {
        padding: '10px',
        color: '#555',
    },
    gridWidth: {
        width: '900px',
    },
    hr: {
        border: '0.1px solid #f0f0f0',
        width: '100%',
    },
    imageButton: {
        float: 'right',
        padding: '10px',
        color: '#888',
        cursor: 'pointer',
    },
    addImage: {
        width: '25px',
    },
    linkButton: {
        float: 'left',
        padding: '10px',
        color: '#888',
        cursor: 'pointer',
    },
    dlImageSize: {
        width: '24px',
    },
    search: {
        marginTop: '2px',
        marginLeft: '15px',
        width: '18px',
        color: '#000',
    },
    floatLeftLabel: {
        float: 'left',
        marginRight: '6px',
        marginTop: '4px',
        fontSize: '0.9em',
        fontWeight: '500',
    },
    searchFloatLeft: {
        float: 'left',
    },
    text: {
        padding: '4px',
        width: '280px',
    },
    floatLeft: {
        float: 'left',
    },
    manualUploadSection: {
        marginTop: '50px',
    },
    findBox: {
        padding: '10px',
        marginBottom: '5px',
        float: 'right',
    },
};


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
    render() {
        return (
            <div>
                <SynSetEdit open={this.state.synSet_edit}
                            synSet={this.state.synSet}
                            onSave={(item) => this.save(item)}
                            onError={(err) => this.props.setError("Error", err)} />

                {
                    this.props.selected_knowledgebase_id.length > 0 &&

                    <div style={styles.findBox}>
                        <div style={styles.floatLeftLabel}>filter syn-sets</div>
                        <div style={styles.searchFloatLeft}>
                            <input type="text" value={this.props.synset_filter} autoFocus={true} style={styles.text}
                                   onKeyPress={(event) => this.handleSynSetFilterKeydown(event)}
                                   onChange={(event) => {
                                       this.props.setSynSetFilter(event.target.value)
                                   }}/>
                        </div>
                        <div style={styles.floatLeft}>
                            <img style={styles.search}
                                 onClick={() => this.props.findSynSets()}
                                 src="../images/dark-magnifying-glass.svg" title="search" alt="search"/>
                        </div>
                    </div>
                }

                <br clear="both" />

                {
                    this.props.selected_knowledgebase_id.length > 0 &&
                    <Paper>
                        <Table style={styles.tableStyle}>
                            <TableHead>
                                <TableRow>
                                    <TableCell style={styles.smallTableHeaderStyle}>syn-set</TableCell>
                                    <TableCell style={styles.actionTableHeaderStyle}>actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    this.props.synset_list.map((synSet) => {
                                        return (
                                            <TableRow key={synSet.word}>
                                                <TableCell>
                                                    <div style={styles.label}>{synSet.word}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div style={styles.linkButton} onClick={() => this.editSynSet(synSet)}>
                                                        <img src="../images/edit.svg" style={styles.dlImageSize} title="edit syn-set" alt="edit"/>
                                                    </div>
                                                    <div style={styles.linkButton} onClick={() => this.deleteSynSetAsk(synSet)}>
                                                        <img src="../images/delete.svg" style={styles.dlImageSize} title="remove syn-set" alt="remove"/>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })
                                }
                                <TableRow>
                                    <TableCell/>
                                    <TableCell>
                                        {this.props.selected_knowledgebase_id.length > 0 &&
                                        <a style={styles.imageButton} onClick={() => this.newSynSet()}><img
                                            style={styles.addImage} src="../images/add.svg" title="new syn-set"
                                            alt="new syn-set"/></a>
                                        }
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell colSpan={2}>
                                        <TablePagination
                                            rowsPerPageOptions={[5, 10, 25]}
                                            component="div"
                                            count={this.props.synset_total_size}
                                            rowsPerPage={this.props.synset_page_size}
                                            page={this.props.synset_page}
                                            backIconButtonProps={{
                                                'aria-label': 'Previous Page',
                                            }}
                                            nextIconButtonProps={{
                                                'aria-label': 'Next Page',
                                            }}
                                            onChangePage={(event, page) => this.props.setSynSetPage(page)}
                                            onChangeRowsPerPage={(event) => this.props.setSynSetPageSize(event.target.value)}
                                        />
                                    </TableCell>
                                </TableRow>

                            </TableBody>

                        </Table>


                    </Paper>
                }

            </div>
        )
    }
}

const mapStateToProps = function(state) {
    return {
        error: state.appReducer.error,
        error_title: state.appReducer.error_title,

        synset_list: state.appReducer.synset_list,
        synset_filter: state.appReducer.synset_filter,
        synset_page: state.appReducer.synset_page,
        synset_page_size: state.appReducer.synset_page_size,
        synset_total_size: state.appReducer.synset_total_size,

        selected_knowledgebase_id: state.appReducer.selected_knowledgebase_id,
    };
};

export default connect(
    mapStateToProps,
    dispatch => bindActionCreators(appCreators, dispatch)
)(SynSets);

