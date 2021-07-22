import React, {Component} from 'react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import TextField from '@material-ui/core/TextField';
import TablePagination from '@material-ui/core/TablePagination';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import {Api} from '../common/api'
import {Comms} from "../common/comms";

import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {appCreators} from "../actions/appActions";
import Grid from "@material-ui/core/Grid";
import Checkbox from "@material-ui/core/Checkbox";
import TimeSelect from "../common/time-select";
import {Home} from "../home";


const defaultIndexSchedule = 'mon-0,tue-0,wed-0,thu-0,fri-0,sat-0,sun-0,mon-1,tue-1,wed-1,thu-1,fri-1,sat-1,sun-1,mon-2,tue-2,wed-2,thu-2,fri-2,sat-2,sun-2,mon-3,tue-3,wed-3,thu-3,fri-3,sat-3,sun-3';


const styles = {
    pageWidth: {
        width: '900px',
    },
    tableLight: {
    },
    tableDark: {
        background: '#d0d0d0',
    },
    label: {
        color: '#555',
    },
    tableHeaderStyle: {
        background: '#555',
        fontSize: '0.95em',
        color: '#fff',
    },
    linkButton: {
        float: 'left',
        padding: '10px',
        color: '#888',
        cursor: 'pointer',
    },
    imageButton: {
        float: 'right',
        padding: '10px',
        color: '#888',
        cursor: 'pointer',
    },
    editBox: {
        width: '500px',
        marginBottom: '15px',
    },
    sidBox: {
        width: '350px',
        marginBottom: '15px',
    },
    roleBlock: {
        padding: '5px',
        marginTop: '20px',
        float: 'left',
        width: '400px',
        border: '1px solid #888',
        borderRadius: '4px',
        marginLeft: '10px',
    },
    roleLabel: {
        fontSize: '0.8em',
        color: '#aaa',
    },
    roleArea: {
        padding: '20px',
    },
    roleChip: {
        margin: '2px',
    },
    addImage: {
        width: '25px',
    },
    textFieldBox: {
        float: 'left',
    },
    imageBox: {
        float: 'left',
    },
    imageSize: {
        marginTop: '20px',
        width: '20px',
    },
    dlImageSize: {
        width: '24px',
    },
    timeTabContent: {
        marginLeft: '40px',
    },
    paddingBottom: {
        display: 'inline-block',
        marginBottom: '130px',
    },
    floatLeft: {
        float: 'left',
    },
    copiedStyle: {
        fontSize: '10px',
        marginLeft: '25px',
        marginTop: '-22px',
        position: 'absolute',
        float: 'left',
        zIndex: '99',
    },
    lineHeight: {height: '30px'},
    organisationIdLabel: {width: '170px', float: 'left', height: '24px'},
    copyImageSpan: {float: 'left', marginTop: '-5px', marginLeft: '10px'},
    clipboardImage: {width: '24px', height: '24px;'},
};


export class KnowledgeBases extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 'general',

            edit_knowledgebase: false,
            edit_knowledgebase_id: "",
            knowledgeBase: null,

            edit_kb_id: "",
            edit_name: "",
            edit_email: "",
            edit_security_id: "",
            edit_enabled: true,
            edit_max_queries_per_day: "0",
            edit_analytics_window_size_in_months: "0",
            edit_operator_enabled: true,
            edit_capacity_warnings: true,
            edit_created: 0,
            edit_index_optimization_schedule: defaultIndexSchedule,

            // view ids
            view_ids: false,
            copied_visible: '',
            kb: null,

            // pagination
            page_size: 5,
            page: 0,
        };
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
    addNewKnowledgeBase() {
        this.setState({edit_knowledgebase: true, knowledgeBase: null,
            edit_knowledgebase_id: "",
            edit_name: "",
            edit_email: "",
            edit_enabled: true,
            edit_max_queries_per_day: "0",
            edit_analytics_window_size_in_months: "0",
            edit_operator_enabled: true,
            edit_capacity_warnings: true,
            edit_created: 0,
            edit_security_id: Api.createGuid(),
            edit_index_optimization_schedule: defaultIndexSchedule,
        })
    }
    refreshSecurityId() {
        this.setState({edit_security_id: Api.createGuid()})
    }
    editKnowledgeBase(knowledgeBase) {
        if (knowledgeBase) {
            this.setState({edit_knowledgebase: true, knowledgeBase: knowledgeBase,
                edit_knowledgebase_id: knowledgeBase.kbId,
                edit_name: knowledgeBase.name,
                edit_email: knowledgeBase.email,
                edit_security_id: knowledgeBase.securityId,
                edit_enabled: knowledgeBase.enabled,
                edit_max_queries_per_day: knowledgeBase.maxQueriesPerDay,
                edit_analytics_window_size_in_months: knowledgeBase.analyticsWindowInMonths,
                edit_operator_enabled: knowledgeBase.operatorEnabled,
                edit_capacity_warnings: knowledgeBase.capacityWarnings,
                edit_index_optimization_schedule: knowledgeBase.indexOptimizationSchedule,
                edit_created: knowledgeBase.created,
            })
        }
    }
    optimizeIndexesAsk(knowledgeBase) {
        if (knowledgeBase) {
            this.props.openDialog("are you sure you want to optimize the indexes for \"" + knowledgeBase.name + "\" ?", "Optimize Knowledge base", (action) => { this.optimizeIndexes(action) });
            this.setState({knowledgeBase: knowledgeBase});
        }
    }
    optimizeIndexes(action) {
        if (action) {
            this.props.optimizeIndexes(this.props.selected_organisation_id, this.state.knowledgeBase.kbId);
        }
        if (this.props.closeDialog) {
            this.props.closeDialog();
        }
    }
    reIndexAsk(knowledgeBase) {
        if (knowledgeBase) {
            this.props.openDialog("are you sure you want to re-index \"" + knowledgeBase.name + "\" ?", "re-index Knowledge base", (action) => { this.reIndex(action) });
            this.setState({knowledgeBase: knowledgeBase});
        }
    }
    reIndex(action) {
        if (action) {
            this.props.reIndex(this.props.selected_organisation_id, this.state.knowledgeBase.kbId);
        }
        if (this.props.closeDialog) {
            this.props.closeDialog();
        }
    }
    deleteKnowledgeBaseAsk(knowledgeBase) {
        if (knowledgeBase) {
            this.props.openDialog("are you sure you want to remove \"" + knowledgeBase.name + "\" ?", "Remove Knowledge base", (action) => { this.deleteKnowledgeBase(action) });
            this.setState({knowledgeBase: knowledgeBase});
        }
    }
    deleteKnowledgeBase(action) {
        if (action) {
            this.props.deleteKnowledgeBase(this.props.selected_organisation_id, this.state.knowledgeBase.kbId);
        }
        if (this.props.closeDialog) {
            this.props.closeDialog();
        }
    }
    editCancel() {
        this.setState({edit_knowledgebase: false, knowledgeBase: null});
    }
    editOk() {
        if (this.state.edit_name.length > 0) {
            this.props.updateKnowledgeBase(this.props.selected_organisation_id, this.state.edit_knowledgebase_id,
                                           this.state.edit_name, this.state.edit_email, this.state.edit_security_id,
                                           this.state.edit_enabled, this.state.edit_max_queries_per_day,
                                           this.state.edit_analytics_window_size_in_months, this.state.edit_operator_enabled,
                                           this.state.edit_capacity_warnings, this.state.edit_created,
                                           this.state.edit_index_optimization_schedule);
            this.setState({edit_knowledgebase: false, knowledgeBase: null});
        } else {
            this.props.setError("Incomplete Data", "Please complete all fields.");
        }
    }
    viewIds(knowledge_base) {
        this.setState({view_ids: true, kb: knowledge_base});
    }
    downloadHtml(html, kb) {
        window.open(Comms.get_html_url(html, this.props.selected_organisation_id, kb.kbId), '_blank');
    }
    getKnowledgeBases() {
        const paginated_list = [];
        const first = this.state.page * this.state.page_size;
        const last = first + this.state.page_size;
        for (const i in this.props.knowledge_base_list) {
            if (i >= first && i < last) {
                paginated_list.push(this.props.knowledge_base_list[i]);
            }
        }
        return paginated_list;
    }
    updateSchedule(time) {
        if (time !== null) {
            this.setState({edit_index_optimization_schedule: time});
        }
    }
    isVisible() {
        return this.props.selected_organisation_id && this.props.selected_organisation_id.length > 0 &&
            this.props.selected_organisation && this.props.selected_organisation.length > 0;
    }
    startCopiedVisible(org_id) {
        this.setState({copied_visible: org_id});
        window.setTimeout(() => { this.setState({copied_visible: ""})}, 1000);
    }
    indexOptimizationClass(kb) {
        if (kb) {
            if (kb.needsIndexOptimization || kb.indexOptimizationTime === 0) {
                return "indexes-out-of-date";
            } else {
                return "indexes-up-to-date";
            }
        }
        return "";
    }
    indexOptimizationText(kb) {
        if (kb) {
            if (kb.needsIndexOptimization || kb.indexOptimizationTime === 0) {
                return "the indexes for \"" + kb.name + "\" are out of date.";
            } else {
                return "the indexes for \"" + kb.name + "\" are up to date.";
            }
        }
        return "";
    }
    indexOptimizationStatus(kb) {
        if (kb) {
            var time = "not optimized";
            if (kb.indexOptimizationTime > 0) {
                time = Api.unixTimeConvert(kb.indexOptimizationTime);
            }
            return time;
        }
        return "";
    }
    render() {
        const theme = this.props.theme;
        const t_value = this.state.selectedTab;
        const isAdmin = Home.hasRole(this.props.user, ['admin']);
        return (
                <div>
                    { this.isVisible() &&

                    <div>

                        <Paper style={styles.pageWidth}>
                            <Table>
                                <TableHead>
                                    <TableRow className='table-header'>
                                        <TableCell className='table-header table-width-20'>knowledge base</TableCell>
                                        <TableCell className='table-header table-width-20'>email queries to</TableCell>
                                        <TableCell className='table-header table-width-20'>last index optimization</TableCell>
                                        <TableCell className='table-header'>actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody style={theme === 'light' ? styles.tableLight : styles.tableDark}>
                                    {
                                        this.getKnowledgeBases().map((knowledge_base) => {
                                            return (
                                                <TableRow key={knowledge_base.kbId}>
                                                    <TableCell>
                                                        <div style={styles.label}>{knowledge_base.name}</div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div style={styles.label}>{knowledge_base.email}</div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div style={styles.label} className={this.indexOptimizationClass(knowledge_base)}
                                                                title={this.indexOptimizationText(knowledge_base)}>
                                                            {this.indexOptimizationStatus(knowledge_base)}</div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div style={styles.linkButton}
                                                             onClick={() => this.viewIds(knowledge_base)}>
                                                            <img src="../images/id.svg" style={styles.dlImageSize}
                                                                 title="view knowledge base ids" alt="ids"/>
                                                        </div>
                                                        <div style={styles.linkButton}
                                                             onClick={() => this.editKnowledgeBase(knowledge_base)}>
                                                            <img src="../images/edit.svg" style={styles.dlImageSize}
                                                                 title="edit knowledge base" alt="edit"/>
                                                        </div>
                                                        {isAdmin &&
                                                        <div style={styles.linkButton}
                                                             onClick={() => this.reIndexAsk(knowledge_base)}>
                                                            <img src="../images/re-index.png" style={styles.dlImageSize}
                                                                 title="re-index all documents" alt="re-index"/>
                                                        </div>
                                                        }
                                                        <div style={styles.linkButton}
                                                             onClick={() => this.optimizeIndexesAsk(knowledge_base)}>
                                                            <img src="../images/optimize.svg" style={styles.dlImageSize}
                                                                 title="optimize indexes now" alt="optimize"/>
                                                        </div>
                                                        <div style={styles.linkButton}
                                                             onClick={() => this.deleteKnowledgeBaseAsk(knowledge_base)}>
                                                            <img src="../images/delete.svg" style={styles.dlImageSize}
                                                                 title="remove knowledge base" alt="remove"/>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })
                                    }
                                    <TableRow>
                                        <TableCell/>
                                        <TableCell/>
                                        <TableCell/>
                                        <TableCell>
                                            {this.props.selected_organisation_id.length > 0 &&
                                            <div style={styles.imageButton} onClick={() => this.addNewKnowledgeBase()}>
                                                <img
                                                    style={styles.addImage} src="../images/add.svg" title="add new user"
                                                    alt="add new user"/></div>
                                            }
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>

                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                style={theme === 'light' ? styles.tableLight : styles.tableDark}
                                component="div"
                                count={this.props.knowledge_base_list.length}
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

                        </Paper>


                        <Dialog aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description"
                                open={this.state.edit_knowledgebase}
                                disableBackdropClick={true}
                                disableEscapeKeyDown={true}
                                fullWidth={true}
                                maxWidth="lg"
                                onClose={() => this.setState({edit_knowledgebase: false, knowledgeBase: null})}>
                            <DialogTitle className={this.props.theme}>{this.state.edit_knowledgebase_id ? "Edit Knowledge Base" : "Add New Knowledge Base"}</DialogTitle>
                            <DialogContent className={this.props.theme}>

                                <Tabs value={this.state.selectedTab} onChange={(event, value)=> this.setState({selectedTab: value})}>
                                    <Tab label="general" value="general" style={styles.tab} />
                                    <Tab label="index optimization schedule" value="schedule" style={styles.tab} />
                                </Tabs>

                                <br />

                                {t_value === 'general' &&
                                <Grid container spacing={2}>

                                    <Grid item xs={1}/>
                                    <Grid item xs={3}>
                                        <div>name</div>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            autoFocus={true}
                                            style={styles.editBox}
                                            placeholder="knowledge base name"
                                            value={this.state.edit_name}
                                            onChange={(event) => this.setState({edit_name: event.target.value})}
                                        />
                                    </Grid>
                                    <Grid item xs={2}/>


                                    <Grid item xs={1}/>
                                    <Grid item xs={3}>
                                        <div>email questions to</div>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            style={styles.editBox}
                                            placeholder="email questions to"
                                            value={this.state.edit_email}
                                            onChange={(event) => this.setState({edit_email: event.target.value})}
                                        />
                                    </Grid>
                                    <Grid item xs={2}/>


                                    <Grid item xs={1}/>
                                    <Grid item xs={3}>
                                        <div>security id</div>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            style={styles.sidBox}
                                            disabled={true}
                                            placeholder="security id"
                                            label="security id"
                                            value={this.state.edit_security_id}
                                            onChange={(event) => this.setState({edit_security_id: event.target.value})}
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <div style={styles.imageBox}>
                                            <img title="generate new security id" alt="refresh"
                                                 src={theme === 'light' ? "../images/refresh.svg": "../images/refresh-dark.svg"}
                                                 onClick={() => this.refreshSecurityId()}
                                                 style={styles.imageSize}/>
                                        </div>
                                    </Grid>


                                    <Grid item xs={2}/>
                                    <Grid item xs={5}>
                                        <Checkbox
                                            checked={this.state.edit_enabled}
                                            onChange={(event) => {
                                                this.setState({edit_enabled: event.target.checked});
                                            }}
                                            value="enable this knowledge-base?"
                                            inputProps={{
                                                'aria-label': 'primary checkbox',
                                            }}
                                        />
                                        knowledge-base enabled?
                                    </Grid>
                                    <Grid item xs={5}>
                                        <Checkbox
                                            checked={this.state.edit_operator_enabled}
                                            onChange={(event) => {
                                                this.setState({edit_operator_enabled: event.target.checked});
                                            }}
                                            value="enable operator access?"
                                            inputProps={{
                                                'aria-label': 'primary checkbox',
                                            }}
                                        />
                                        operator enabled?
                                    </Grid>


                                    <Grid item xs={2}/>
                                    <Grid item xs={5}>
                                        <Checkbox
                                            checked={this.state.edit_capacity_warnings}
                                            onChange={(event) => {
                                                this.setState({edit_capacity_warnings: event.target.checked});
                                            }}
                                            value="enable capacity warnings?"
                                            inputProps={{
                                                'aria-label': 'primary checkbox',
                                            }}
                                        />
                                        capacity-warnings on?
                                    </Grid>
                                    <Grid item xs={5}/>


                                    <Grid item xs={2}/>
                                    <Grid item xs={7}>
                                        <div>maximum number of queries per day (0 is no limits)</div>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <TextField
                                            onChange={(event) => this.setState({edit_max_queries_per_day: event.target.value})}
                                            placeholder="max transactions per month"
                                            variant="standard"
                                            fullWidth={true}
                                            value={this.state.edit_max_queries_per_day}
                                        />
                                    </Grid>
                                    <Grid item xs={1}/>


                                    <Grid item xs={2}/>
                                    <Grid item xs={7}>
                                        <div>maximum analytics retention period in months (0 is no limits)</div>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <TextField
                                            onChange={(event) => this.setState({edit_analytics_window_size_in_months: event.target.value})}
                                            placeholder="max analytics retention period in months"
                                            variant="standard"
                                            fullWidth={true}
                                            value={this.state.edit_analytics_window_size_in_months}
                                        />
                                    </Grid>
                                    <Grid item xs={1}/>


                                </Grid>
                                }

                                {t_value === 'schedule' &&
                                <div style={styles.timeTabContent}>
                                    <TimeSelect time={this.state.edit_index_optimization_schedule}
                                                onSave={(time) => this.updateSchedule(time)}/>
                                    <div style={styles.paddingBottom}></div>
                                </div>
                                }

                            </DialogContent>
                            <DialogActions className={this.props.theme}>
                                <Button color="primary" onClick={() => this.editCancel()}>Cancel</Button>
                                <Button variant="contained" color="secondary" onClick={() => this.editOk()}>Save</Button>
                            </DialogActions>
                        </Dialog>

                    </div>
                }


                    <Dialog aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                            open={this.state.view_ids}
                            disableBackdropClick={true}
                            disableEscapeKeyDown={true}
                            fullWidth={true}
                            maxWidth="md"
                            onClose={() => this.setState({view_ids: false})} >
                        <DialogTitle className={this.props.theme}>{this.state.kb != null ? this.state.kb.name : ""} IDS</DialogTitle>
                        <DialogContent className={this.props.theme}>
                            <div>
                                <div style={styles.lineHeight}>
                                    <div style={styles.organisationIdLabel}>
                                        organisation id
                                    </div>
                                    <div style={styles.floatLeft}>{this.props.selected_organisation_id ? this.props.selected_organisation_id : ""}</div>
                                    <span style={styles.copyImageSpan} title={'copy organisation id'}>
                                    <img src={theme === 'light' ? '../images/clipboard-copy.svg' : '../images/clipboard-copy-dark.svg'} style={styles.clipboardImage} alt={'copy'}
                                         onClick={() => { if (Api.writeToClipboard(this.props.selected_organisation_id ? this.props.selected_organisation_id : ""))
                                             this.startCopiedVisible(this.props.selected_organisation_id);
                                         }}/>
                                        {this.props.selected_organisation_id && this.state.copied_visible === this.props.selected_organisation_id &&
                                        <div style={styles.copiedStyle}>copied</div>
                                        }
                                </span>
                                    <br clear='both' />
                                </div>

                                <div style={styles.lineHeight}>
                                    <div style={styles.organisationIdLabel}>
                                        knowledge base id
                                    </div>
                                    <div style={styles.floatLeft}>{this.state.kb ? this.state.kb.kbId : ""}</div>
                                    <span style={styles.copyImageSpan} title={'copy knowledge base id'}>
                                    <img src={theme === 'light' ? '../images/clipboard-copy.svg' : '../images/clipboard-copy-dark.svg'} style={styles.clipboardImage} alt={'copy'}
                                         onClick={() => { if (Api.writeToClipboard(this.state.kb ? this.state.kb.kbId : ""))
                                             this.startCopiedVisible(this.state.kb.kbId);
                                         }}/>
                                        {this.state.kb && this.state.copied_visible === this.state.kb.kbId &&
                                        <div style={styles.copiedStyle}>copied</div>
                                        }
                                </span>
                                    <br clear='both' />
                                </div>

                                <div style={styles.lineHeight}>
                                    <div style={styles.organisationIdLabel}>
                                        security id
                                    </div>
                                    <div style={styles.floatLeft}>{this.state.kb ? this.state.kb.securityId : ""}</div>
                                    <span style={styles.copyImageSpan} title={'copy security id'}>
                                    <img src={theme === 'light' ? '../images/clipboard-copy.svg' : '../images/clipboard-copy-dark.svg'} style={styles.clipboardImage} alt={'copy'}
                                         onClick={() => { if (Api.writeToClipboard(this.state.kb ? this.state.kb.securityId : ""))
                                             this.startCopiedVisible(this.state.kb.securityId);
                                         }}/>
                                        {this.state.kb && this.state.copied_visible === this.state.kb.securityId &&
                                        <div style={styles.copiedStyle}>copied</div>
                                        }
                                </span>
                                    <br clear='both' />
                                </div>

                            </div>
                        </DialogContent>
                        <DialogActions className={this.props.theme}>
                            <Button variant="contained" color="secondary" onClick={() => this.setState({view_ids: false})}>Close</Button>
                        </DialogActions>
                    </Dialog>



                </div>
        )
    }
}


const mapStateToProps = function(state) {
    return {
        error: state.appReducer.error,
        error_title: state.appReducer.error_title,
        theme: state.appReducer.theme,

        selected_organisation_id: state.appReducer.selected_organisation_id,
        selected_organisation: state.appReducer.selected_organisation,
        knowledge_base_list: state.appReducer.knowledge_base_list,
        user: state.appReducer.user,
    };
};

export default connect(
    mapStateToProps,
    dispatch => bindActionCreators(appCreators, dispatch)
)(KnowledgeBases);
