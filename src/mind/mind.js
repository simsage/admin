import React from 'react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import {Api} from '../common/api'
import {MindEdit} from "./mind-edit";

import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {appCreators} from "../actions/appActions";
import TablePagination from "@material-ui/core/TablePagination";
import ProgramUpload from "../common/program-upload";
import Button from "@material-ui/core/Button";
import Comms from "../common/comms";


const styles = {
    tableStyle: {
        minWidth: '900px',
        width: '900px',
    },
    tableLight: {
    },
    text: {
        border: '1px solid #808080',
        borderRadius: '4px',
        padding: '4px',
        width: '280px',
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
    queryMindLabel: {
        marginTop: '12px',
        padding: '10px',
        color: '#555',
        float: 'right',
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
    spacer: {
        marginTop: '20px',
    },
    uploader: {
        marginTop: '-20px',
        float: 'left',
    },
    export: {
        float: 'left',
    }
};


export class Mind extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mind_item: null,
            mind_edit: false,
        };
    }
    componentDidCatch(error, info) {
        this.props.setError(error, info);
        console.log(error, info);
    }
    componentDidMount() {
    }
    deleteMindItemAsk(mindItem) {
        if (mindItem) {
            this.props.openDialog("are you sure you want to remove id " + mindItem.id + "?<br/><br/>(" + mindItem.expression + ")",
                                    "Remove Mind Entry", (action) => { this.deleteMindItem(action) });
            this.setState({mind_item: mindItem});
        }
    }
    deleteMindItem(action) {
        if (action && Api.defined(this.state.mind_item)) {
            this.props.deleteMindItem(this.state.mind_item.id);
        }
        if (this.props.closeDialog) {
            this.props.closeDialog();
        }
    }
    deleteAllMindItemsAsk() {
        this.props.openDialog("are you sure you want to remove all mind-items of this knowledge-base?",
            "Remove All Mind Items", (action) => { this.deleteAllMindItems(action) });
    }
    deleteAllMindItems(action) {
        if (action) {
            this.props.deleteAllMindItems();
        }
        if (this.props.closeDialog) {
            this.props.closeDialog();
        }
    }
    handleSearchTextKeydown(event) {
        if (event.key === "Enter") {
            this.props.getMindItems();
        }
    }
    static toAnswer(mindItem) {
        let str = "";
        if (mindItem && mindItem.actionList) {
            for (const action of mindItem.actionList) {
                if (action && action.action === "browser.write" && action.parameters) {
                    for (const param of action.parameters) {
                        str = str + param.replace(/<br \/>/g, "\n");
                    }
                }
            }
        }
        return str;
    }
    editMindItem(mindItem) {
        this.setState({mind_edit: true, mind_item: mindItem});
    }
    newMindItem() {
        this.setState({mind_edit: true, mind_item: {
                id: '',
                preContext: "",
                postContext: "",
                expression: "",
                actionList: [],
                metadata: ""
            }
            });
    }
    mindDump() {
        window.open(Comms.get_mind_dump_url(this.props.selected_organisation_id, this.props.selected_knowledgebase_id), '_blank');
    }
    save(mindItem) {
        if (mindItem) {
            if (mindItem.expression.length > 0 && mindItem.actionList.length > 0) {
                this.props.saveMindItem(mindItem);
                this.setState({mind_edit: false});
            } else {
                this.props.setError("Error Saving Mind Entry", "mind-item must have an expression and actions");
            }
        } else {
            this.setState({mind_edit: false});
        }
    }
    getMindItemList() {
        if (this.props.mind_item_list) {
            return this.props.mind_item_list;
        }
        return [];
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
               <MindEdit open={this.state.mind_edit}
                         theme={theme}
                         mindItem={this.state.mind_item}
                         onSave={(item) => this.save(item)}
                         onError={(err) => this.props.setError("Error", err)} />

                {
                    this.isVisible() &&

                    <div style={styles.findBox}>
                        <div style={styles.floatLeftLabel}>find items in the mind</div>
                        <div style={styles.searchFloatLeft}>
                            <input type="text" value={this.props.mind_item_filter} autoFocus={true} style={styles.text} className={theme}
                                   onKeyPress={(event) => this.handleSearchTextKeydown(event)}
                                   onChange={(event) => {
                                       this.props.setMindItemFilter(event.target.value)
                                   }}/>
                        </div>
                        <div style={styles.floatLeft}>
                            <img style={styles.search}
                                 onClick={() => this.props.getMindItems()}
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
                                    <TableCell className='table-header'>expression</TableCell>
                                    <TableCell className='table-header'>actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody style={theme === 'light' ? styles.tableLight : styles.tableDark}>
                                {
                                    this.getMindItemList().map((mindItem) => {
                                        return (
                                            <TableRow key={mindItem.id}>
                                                <TableCell>
                                                    <div style={styles.label}>{mindItem.id}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div style={styles.label} title={Mind.toAnswer(mindItem)}>{mindItem.expression}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div style={styles.linkButton} onClick={() => this.editMindItem(mindItem)}>
                                                        <img src="../images/edit.svg" style={styles.dlImageSize} title="edit mind-item" alt="edit"/>
                                                    </div>
                                                    <div style={styles.linkButton} onClick={() => this.deleteMindItemAsk(mindItem)}>
                                                        <img src="../images/delete.svg" style={styles.dlImageSize} title="remove mind-item" alt="remove"/>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })
                                }
                                <TableRow>
                                    <TableCell colSpan={3}>
                                        {this.props.selected_knowledgebase_id.length > 0 &&
                                            <div style={styles.uploader}>
                                                <ProgramUpload kbId={this.props.selected_knowledgebase_id}
                                                               organisationId={this.props.selected_organisation_id}
                                                               onUploadDone={() => this.programUploaded()}
                                                               onError={(errStr) => this.props.setError("Error", errStr)}/>
                                            </div>
                                        }
                                        {this.props.selected_knowledgebase_id.length > 0 &&
                                            <div style={styles.export}>
                                                <Button variant="contained" color="secondary" style={styles.exportButton}
                                                        onClick={() => this.mindDump()}>Export</Button>

                                            </div>
                                        }
                                        {this.props.selected_knowledgebase_id.length > 0 &&
                                        <div style={styles.imageButton} onClick={() => this.newMindItem()}><img
                                            style={styles.addImage} src="../images/add.svg" title="new mind item"
                                            alt="new mind item"/></div>
                                        }
                                        {this.props.selected_knowledgebase_id.length > 0 &&
                                            <div style={styles.imageButton} onClick={() => this.deleteAllMindItemsAsk()}><img
                                                style={styles.addImage} src="../images/delete.svg" title="remove all mind items of this knowledgebase"
                                                alt="remove all mind items"/></div>
                                        }
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>

                        <TablePagination
                            style={theme === 'light' ? styles.tableLight : styles.tableDark}
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={this.props.num_mind_items}
                            rowsPerPage={this.props.mind_item_page_size}
                            page={this.props.mind_item_page}
                            backIconButtonProps={{
                                'aria-label': 'Previous Page',
                            }}
                            nextIconButtonProps={{
                                'aria-label': 'Next Page',
                            }}
                            onChangePage={(event, page) => this.props.setMindItemPage(page)}
                            onChangeRowsPerPage={(event) => this.props.setMindItemPageSize(event.target.value)}
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

        mind_item_list: state.appReducer.mind_item_list,
        mind_item_filter: state.appReducer.mind_item_filter,
        mind_item_page: state.appReducer.mind_item_page,
        mind_item_page_size: state.appReducer.mind_item_page_size,
        num_mind_items: state.appReducer.num_mind_items,

        bot_query: state.appReducer.bot_query,
        bot_query_result_list: state.appReducer.bot_query_result_list,

        selected_organisation_id: state.appReducer.selected_organisation_id,
        selected_organisation: state.appReducer.selected_organisation,
        selected_knowledgebase_id: state.appReducer.selected_knowledgebase_id,
    };
};

export default connect(
    mapStateToProps,
    dispatch => bindActionCreators(appCreators, dispatch)
)(Mind);

