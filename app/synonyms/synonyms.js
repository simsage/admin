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
        width: '1024px',
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
        width: '800px',
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
    busy: {
        display: 'block',
        position: 'fixed',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        zIndex: '9999',
        borderRadius: '10px',
        opacity: '0.8',
        backgroundSize: '100px',
        background: "url('../images/busy.gif') 50% 50% no-repeat rgb(255,255,255)"
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
    getSynonyms() {
        const paginated_list = [];
        if (Api.defined(this.props.synonym_list)) {
            const first = this.state.page * this.state.page_size;
            const last = first + this.state.page_size;
            for (const i in this.props.synonym_list) {
                if (i >= first && i < last) {
                    paginated_list.push(this.props.synonym_list[i]);
                }
            }
        }
        return paginated_list;
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
            this.props.findSynonyms();
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
    render() {
        return (
            <div>
                {
                    this.state.busy &&
                    <div style={styles.busy} />
                }

                <SynonymEdit open={this.state.synonym_edit}
                             synonym={this.state.synonym}
                             onSave={(item) => this.save(item)}
                             onError={(err) => this.props.setError("Error", err)} />

                {
                    this.props.selected_knowledgebase_id.length > 0 &&

                    <div style={styles.findBox}>
                        <div style={styles.floatLeftLabel}>find synonyms</div>
                        <div style={styles.searchFloatLeft}>
                            <input type="text" value={this.props.synonym_filter} autoFocus={true} style={styles.text}
                                   onKeyPress={(event) => this.handleSearchTextKeydown(event)}
                                   onChange={(event) => {
                                       this.props.setSynonymFilter(event.target.value)
                                   }}/>
                        </div>
                        <div style={styles.floatLeft}>
                            <img style={styles.search}
                                 onClick={() => this.props.findSynonyms()}
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
                                    <TableCell style={styles.smallTableHeaderStyle}>id</TableCell>
                                    <TableCell style={styles.tableHeaderStyle}>synonyms</TableCell>
                                    <TableCell style={styles.actionTableHeaderStyle}>actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    this.getSynonyms().map((synonym) => {
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
                                        {this.props.selected_knowledgebase_id.length > 0 &&
                                        <a style={styles.imageButton} onClick={() => this.newSynonym()}><img
                                            style={styles.addImage} src="../images/add.svg" title="new synonym"
                                            alt="new synonym"/></a>
                                        }
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell colSpan={3}>
                                        <TablePagination
                                            rowsPerPageOptions={[5, 10, 25]}
                                            component="div"
                                            count={this.props.synonym_list.length}
                                            rowsPerPage={this.state.page_size}
                                            page={this.state.page}
                                            backIconButtonProps={{
                                                'aria-label': 'Previous Page',
                                            }}
                                            nextIconButtonProps={{
                                                'aria-label': 'Next Page',
                                            }}
                                            onChangePage={(event, page) => this.changePage(page)}
                                            onChangeRowsPerPage={(event) => this.changePageSize(event.target.value)}
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

        synonym_list: state.appReducer.synonym_list,
        synonym_filter: state.appReducer.synonym_filter,

        selected_knowledgebase_id: state.appReducer.selected_knowledgebase_id,

        busy: state.appReducer.busy,
    };
};

export default connect(
    mapStateToProps,
    dispatch => bindActionCreators(appCreators, dispatch)
)(Synonyms);

