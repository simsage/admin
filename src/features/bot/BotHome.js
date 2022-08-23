import {useSelector} from "react-redux";
import React, {useState} from "react";
import BotFilter from "./BotFilter";
import {Pagination} from "../../common/pagination";
import Comms from "../../common/comms";
import {MindEdit} from "./MindEdit";

export default function BotHome(props){
    const title = "Bot";
    const theme = null;

    function deleteMemoryAsk(memory) {
        if (memory) {
            this.props.openDialog("are you sure you want to remove id " + memory.id + "?<br/><br/>(" + memory.questionList[0] + ")",
                "Remove Memory", (action) => { this.deleteMemory(action) });
            this.setState({mind_item: memory});
        }
    }

    function deleteMemory(action) {
        if (action && Api.defined(this.state.mind_item)) {
            this.props.deleteMemory(this.state.mind_item.id);
        }
        if (this.props.closeDialog) {
            this.props.closeDialog();
        }
    }
    function deleteAllMemoriesAsk() {
        this.props.openDialog("are you sure you want to remove all memories of this knowledge-base?",
            "Remove All Memories", (action) => { this.deleteAllMemories(action) });
    }
    function deleteAllMemories(action) {
        if (action) {
            this.props.deleteAllMemories();
        }
        if (this.props.closeDialog) {
            this.props.closeDialog();
        }
    }
    function handleSearchTextKeydown(event) {
        if (event.key === "Enter") {
            this.props.getMindItems();
        }
    }
    function getDisplayText(memory) {
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

    function editMemory(memory) {
        this.setState({mind_edit: true, mind_item: memory});
    }

    function newMemory() {
        this.setState({mind_edit: true, mind_item: {
                id: "",
                questionList: [],
                urlList: [],
                information: "",
            }
        });
    }
    function programUploaded() {
        this.props.openDialog("SimSage is now processing these new memories.  Check 'the mind' periodically for updates.", "Uploading Memories", () => this.programUploadedClose());
    }

    function programUploadedClose() {
        this.props.closeDialog();
    }

    function mindDump() {
        if (this.props.session && this.props.session.id)
            Comms.download_mind_dump(this.props.selected_organisation_id, this.props.selected_knowledgebase_id, this.props.session.id);
    }

    function save(memory) {
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

    function getMemoryList() {
        if (this.props.mind_item_list) {
            return this.props.mind_item_list;
        }
        return [];
    }

    function isVisible() {
        return this.props.selected_organisation_id && this.props.selected_organisation_id.length > 0 &&
            this.props.selected_organisation && this.props.selected_organisation.length > 0 &&
            this.props.selected_knowledgebase_id && this.props.selected_knowledgebase_id.length > 0;
    }


    return (
        <div className="section px-5 pt-4">

            <BotFilter />
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
        </div>
    )
}