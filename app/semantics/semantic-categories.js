import React from 'react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import {SemanticCategoryEdit} from "./semantic-category-edit";

import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {appCreators} from "../actions/appActions";
import {hasOwnProperty} from "luxon/src/impl/util";
import Api from "../common/api";
import TablePagination from "@material-ui/core/TablePagination";
import Grid from "@material-ui/core/Grid";


const styles = {
    tableStyle: {
        minWidth: '800px',
        width: '900px',
    },
    smallTableHeaderStyle: {
        background: '#555',
        fontSize: '0.95em',
        color: '#fff',
        minWidth: '100px',
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
        minWidth: '300px',
        width: '400px',
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
    searchBox: {
        boxShadow: 'none',
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


export class SemanticCategories extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

            prevDisplayName: "",

            synonym: {},
            synonym_edit: false,

            openDialog: props.openDialog,
            closeDialog: props.closeDialog,

            // pagination and filter
            filter: "",
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
    deleteDisplayCategoryAsk(synonym) {
        if (synonym) {
            this.props.openDialog("are you sure you want to remove display category \"" + synonym.displayName + "\"?<br/><br/>(" + synonym.semanticList.join(",") + ")",
                                    "Remove Display Category", (action) => { this.deleteDisplayCategory(action) });
            this.setState({synonym: synonym});
        }
    }
    deleteDisplayCategory(action) {
        if (action && this.state.synonym) {
            this.props.deleteSemanticDisplayCategory(this.state.synonym.displayName);
        }
        if (this.props.closeDialog) {
            this.props.closeDialog();
        }
        this.setState({synonym_edit: false, synonym: {}});
    }
    handleSearchTextKeydown(event) {
        if (event.key === "Enter") {
            this.props.getSemanticDisplayCategories();
        }
    }
    editDisplayCategory(synonym) {
        this.setState({synonym_edit: true, prevDisplayName: synonym.displayName, synonym: synonym});
    }
    newDisplayCategory() {
        this.setState({synonym_edit: true, prevDisplayName: "", synonym: {displayName: "", synonymList: []}});
    }
    save(displayName, semanticList) {
        if (Api.defined(displayName) && Api.defined(semanticList)) {
            if (displayName.trim().length > 0 && semanticList.length > 0) {
                this.props.saveSemanticDisplayCategory(this.state.prevDisplayName, displayName, semanticList);
                this.setState({synonym_edit: false, synonym: {}});
            } else {
                this.props.setError("Error Saving Semantic Display Category",
                    "display-name cannot be empty, and the semantic-list needs at least one item in it.");
            }
        } else {
            this.setState({synonym_edit: false, synonym: {}});
        }
    }
    // get a list of semantics not yet used by any category
    getLeftOverSemanticList() {
        const existing = {};
        for (const sdc of this.props.semantic_display_category_list) {
            for (const semantic of sdc.semanticList) {
                existing[semantic.trim()] = true;
            }
        }
        const list = [];
        for (const semantic of this.props.defined_semantic_list) {
            if (!existing[semantic.trim()]) {
                list.push(semantic.trim());
            }
        }
        return list;
    }
    getSemanticDisplayList() {
        const list = [];
        const filter = this.state.filter.trim().toLowerCase();
        let i = 0;
        let start = this.state.page * this.state.page_size;
        let end = start + this.state.page_size;
        for (const item of this.props.semantic_display_category_list) {
            if (filter.length <= 1 || (filter.length > 1 && item.displayName.toLowerCase().indexOf(filter) >= 0)) {
                if (i >= start && i < end) {
                    list.push(item);
                }
                i += 1;
            }
        }
        return list;
    }
    render() {
        return (
            <div>
                <SemanticCategoryEdit open={this.state.synonym_edit}
                                      synonym={this.state.synonym}
                                      definedSemanticList={this.getLeftOverSemanticList()}
                                      onSave={(displayName, semanticList) => this.save(displayName, semanticList)}
                                      onError={(err) => this.props.setError("Error", err)} />

                {
                    this.props.selected_knowledgebase_id && this.props.selected_knowledgebase_id.length > 0 &&
                    <div>
                        <div style={styles.searchBox}>
                            <Grid item xs={12}>
                                <div style={styles.findBox}>
                                    <div style={styles.floatLeftLabel}>filter</div>
                                    <div style={styles.searchFloatLeft}>
                                        <input type="text" value={this.props.user_filter} autoFocus={true} style={styles.text}
                                               onKeyPress={(event) => this.handleSearchTextKeydown(event)}
                                               onChange={(event) => {
                                                   this.setState({filter: event.target.value})
                                               }}/>
                                    </div>
                                    <div style={styles.floatLeft}>
                                        <img style={styles.search}
                                             onClick={() => this.props.getSemanticDisplayCategories()}
                                             src="../images/dark-magnifying-glass.svg" title="filter" alt="filter"/>
                                    </div>
                                </div>
                            </Grid>
                        </div>
                        <Paper>
                            <Table style={styles.tableStyle}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={styles.smallTableHeaderStyle}>display name</TableCell>
                                        <TableCell style={styles.tableHeaderStyle}>synonyms</TableCell>
                                        <TableCell style={styles.actionTableHeaderStyle}>actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        this.getSemanticDisplayList().map((synonym) => {
                                            return (
                                                <TableRow key={synonym.displayName}>
                                                    <TableCell>
                                                        <div style={styles.label}>{synonym.displayName}</div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div style={styles.label}>{synonym.semanticList.join(",")}</div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div style={styles.linkButton} onClick={() => this.editDisplayCategory(synonym)}>
                                                            <img src="../images/edit.svg" style={styles.dlImageSize} title="edit display category" alt="edit"/>
                                                        </div>
                                                        <div style={styles.linkButton} onClick={() => this.deleteDisplayCategoryAsk(synonym)}>
                                                            <img src="../images/delete.svg" style={styles.dlImageSize} title="remove display category" alt="remove"/>
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
                                            <a style={styles.imageButton} onClick={() => this.newDisplayCategory()}><img
                                                style={styles.addImage} src="../images/add.svg" title="new display category"
                                                alt="new display category"/></a>
                                            }
                                        </TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell colSpan={3}>
                                            <TablePagination
                                                rowsPerPageOptions={[5, 10, 25]}
                                                component="div"
                                                count={this.props.semantic_display_category_list.length}
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

        semantic_display_category_list: state.appReducer.semantic_display_category_list,
        defined_semantic_list: state.appReducer.defined_semantic_list,

        selected_knowledgebase_id: state.appReducer.selected_knowledgebase_id,
    };
};

export default connect(
    mapStateToProps,
    dispatch => bindActionCreators(appCreators, dispatch)
)(SemanticCategories);

