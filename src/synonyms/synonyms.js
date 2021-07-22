import React from 'react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import {Api} from '../common/api'
import {SynonymEdit} from "./synonym-edit";
import TablePagination from "@material-ui/core/TablePagination";

import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {appCreators} from "../actions/appActions";


const styles = {
    tableStyle: {
        minWidth: '800px',
        width: '900px',
    },
    tableLight: {
    },
    tableDark: {
        background: '#d0d0d0',
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
        border: '1px solid #808080',
        borderRadius: '4px',
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
                id: Api.createGuid(),
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

                    <div style={styles.findBox}>
                        <div style={styles.floatLeftLabel}>find synonyms</div>
                        <div style={styles.searchFloatLeft}>
                            <input type="text" value={this.props.synonym_filter} autoFocus={true} style={styles.text} className={theme}
                                   onKeyPress={(event) => this.handleSearchTextKeydown(event)}
                                   onChange={(event) => {
                                       this.props.setSynonymFilter(event.target.value)
                                   }}/>
                        </div>
                        <div style={styles.floatLeft}>
                            <img style={styles.search}
                                 onClick={() => this.props.getSynonyms()}
                                 src="../images/dark-magnifying-glass.svg" title="search" alt="search"/>
                        </div>
                    </div>
                }

                <br clear="both" />

                {
                    this.isVisible() &&
                    <Paper>
                        <Table style={styles.tableStyle}>
                            <TableHead>
                                <TableRow>
                                    <TableCell className='table-header'>id</TableCell>
                                    <TableCell className='table-header'>synonyms</TableCell>
                                    <TableCell className='table-header'>actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody style={theme === 'light' ? styles.tableLight : styles.tableDark}>
                                {
                                    this.getSynonymList().map((synonym) => {
                                        return (
                                            <TableRow key={synonym.id}>
                                                <TableCell>
                                                    <div style={styles.label}>{synonym.id}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div style={styles.label}>{synonym.words}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div style={styles.linkButton} onClick={() => this.editSynonym(synonym)}>
                                                        <img src="../images/edit.svg" style={styles.dlImageSize} title="edit synonym" alt="edit"/>
                                                    </div>
                                                    <div style={styles.linkButton} onClick={() => this.deleteSynonymAsk(synonym)}>
                                                        <img src="../images/delete.svg" style={styles.dlImageSize} title="remove synonym" alt="remove"/>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })
                                }
                                <TableRow>
                                    <TableCell/>
                                    <TableCell/>
                                    <TableCell>
                                        {this.isVisible() &&
                                        <div style={styles.imageButton} onClick={() => this.newSynonym()}><img
                                            style={styles.addImage} src="../images/add.svg" title="new synonym"
                                            alt="new synonym"/></div>
                                        }
                                    </TableCell>
                                </TableRow>

                            </TableBody>

                        </Table>

                        <TablePagination
                            style={theme === 'light' ? styles.tableLight : styles.tableDark}
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
                            onChangePage={(event, page) => this.props.setSynonymPage(page)}
                            onChangeRowsPerPage={(event) => this.props.setSynonymPageSize(event.target.value)}
                        />

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

