import React from 'react';

import {Api} from '../common/api'
import {MindEdit} from "./mind-edit";

import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {appCreators} from "../actions/appActions";
import SpreadsheetUpload from "../common/spreadsheet-upload";
import Comms from "../common/comms";
import {Pagination} from "../common/pagination";

import '../css/mind.css';


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
    deleteMemoryAsk(memory) {
        if (memory) {
            this.props.openDialog("are you sure you want to remove id " + memory.id + "?<br/><br/>(" + memory.questionList[0] + ")",
                                    "Remove Memory", (action) => { this.deleteMemory(action) });
            this.setState({mind_item: memory});
        }
    }
    deleteMemory(action) {
        if (action && Api.defined(this.state.mind_item)) {
            this.props.deleteMemory(this.state.mind_item.id);
        }
        if (this.props.closeDialog) {
            this.props.closeDialog();
        }
    }
    deleteAllMemoriesAsk() {
        this.props.openDialog("are you sure you want to remove all memories of this knowledge-base?",
            "Remove All Memories", (action) => { this.deleteAllMemories(action) });
    }
    deleteAllMemories(action) {
        if (action) {
            this.props.deleteAllMemories();
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
    static getDisplayText(memory) {
        let str = "";
        for (const question of memory.questionList) {
            if (str.length > 0) {
                str += " | ";
            }
            str += question;
        }
        str += ' => ' + memory.information;
        return str;
    }
    editMemory(memory) {
        this.setState({mind_edit: true, mind_item: memory});
    }
    newMemory() {
        this.setState({mind_edit: true, mind_item: {
                id: "",
                questionList: [],
                urlList: [],
                information: "",
            }
            });
    }
    programUploaded() {
        this.props.openDialog("SimSage is now processing these new memories.  Check 'the mind' periodically for updates.", "Uploading Memories", () => this.programUploadedClose());
    }
    programUploadedClose() {
        this.props.closeDialog();
    }
    mindDump() {
        Comms.download_mind_dump(this.props.selected_organisation_id, this.props.selected_knowledgebase_id);
    }
    save(memory) {
        if (memory) {
            if (memory.information.length > 0 && memory.questionList.length > 0) {
                this.props.saveMemory(memory);
                this.setState({mind_edit: false});
            } else {
                this.props.setError("Error Saving Memory", "memory must have questions and an answer");
            }
        } else {
            this.setState({mind_edit: false});
        }
    }
    getMemoryList() {
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
            <div className="mind-page">
               <MindEdit open={this.state.mind_edit}
                         theme={theme}
                         memory={this.state.mind_item}
                         onSave={(item) => this.save(item)}
                         onError={(err) => this.props.setError("Error", err)} />

                {
                    this.isVisible() &&

                    <div className="filter-find-box">
                        <span className="filter-label">filter</span>
                        <span className="filter-find-text">
                            <input type="text" value={this.props.mind_item_filter}
                                   autoFocus={true} className={"filter-text-width " + theme}
                                   onKeyPress={(event) => this.handleSearchTextKeydown(event)}
                                   onChange={(event) => {
                                       this.props.setMindItemFilter(event.target.value)
                                   }}/>
                        </span>
                        <span className="filter-find-image">
                            <img className="image-size"
                                 onClick={() => this.props.getMindItems()}
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
                                    <th className='table-header'>memory</th>
                                    <th className='table-header'>actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.getMemoryList().map((memory) => {
                                        return (
                                            <tr key={memory.id}>
                                                <td>
                                                    <div>{memory.id}</div>
                                                </td>
                                                <td>
                                                    <div className="mind-text-column" title={Mind.getDisplayText(memory)}>{Mind.getDisplayText(memory)}</div>
                                                </td>
                                                <td>
                                                    <span onClick={() => this.editMemory(memory)}>
                                                        <img src="../images/edit.svg" className="image-size" title="edit memory" alt="edit"/>
                                                    </span>
                                                    <span onClick={() => this.deleteMemoryAsk(memory)}>
                                                        <img src="../images/delete.svg" className="image-size" title="remove memory" alt="remove"/>
                                                    </span>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                                <tr>
                                    <td colSpan={3} className="bottom-td-margin">
                                        {this.props.selected_knowledgebase_id.length > 0 &&
                                            <div className="uploader">
                                                <SpreadsheetUpload kbId={this.props.selected_knowledgebase_id}
                                                                   organisationId={this.props.selected_organisation_id}
                                                                   onUploadDone={() => this.programUploaded()}
                                                                   onError={(errStr) => this.props.setError("Error", errStr)}/>
                                            </div>
                                        }
                                        {this.props.selected_knowledgebase_id.length > 0 &&
                                            <div className="export">
                                                <button className="btn btn-primary btn-block"
                                                        onClick={() => this.mindDump()}>Export</button>

                                            </div>
                                        }
                                        {this.props.selected_knowledgebase_id.length > 0 &&
                                        <div className="image-button" onClick={() => this.newMemory()}><img
                                            className="image-size" src="../images/add.svg" title="new mind item"
                                            alt="new mind item"/></div>
                                        }
                                        {this.props.selected_knowledgebase_id.length > 0 &&
                                            <div className="image-button" onClick={() => this.deleteAllMemoriesAsk()}><img
                                                className="image-size" src="../images/delete.svg" title="remove all mind items of this knowledgebase"
                                                alt="remove all mind items"/></div>
                                        }
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <Pagination
                            theme={theme}
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
                            onChangePage={(page) => this.props.setMindItemPage(page)}
                            onChangeRowsPerPage={(rows) => this.props.setMindItemPageSize(rows)}
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

        mind_item_list: state.appReducer.mind_item_list,
        mind_item_filter: state.appReducer.mind_item_filter,
        mind_item_page: state.appReducer.mind_item_page,
        mind_item_page_size: state.appReducer.mind_item_page_size,
        num_mind_items: state.appReducer.num_mind_items,

        bot_query: state.appReducer.bot_query,
        mind_result_list: state.appReducer.mind_result_list,

        selected_organisation_id: state.appReducer.selected_organisation_id,
        selected_organisation: state.appReducer.selected_organisation,
        selected_knowledgebase_id: state.appReducer.selected_knowledgebase_id,
    };
};

export default connect(
    mapStateToProps,
    dispatch => bindActionCreators(appCreators, dispatch)
)(Mind);

