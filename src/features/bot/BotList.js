import {useDispatch, useSelector} from "react-redux";
import React, {useState, useEffect} from "react";
import {Pagination} from "../../common/pagination";
import {showEditMemoryForm, showAddMemoryForm, showDeleteMemoryForm, loadMindItems} from "./botSlice";
import {BotEdit} from "./BotEdit";
import BotDeleteAsk from "./BotDeleteAsk";

export default function BotHome() {

    const theme = null;
    const dispatch = useDispatch()
    const session = useSelector((state) => state.authReducer.session);
    const session_id = session.id;
    const load_data = useSelector( (state) => state.botReducer.data_status)



    const selected_organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)
    const selected_organisation = useSelector((state) => state.authReducer.selected_organisation)
    const selected_knowledge_base_id = useSelector((state) => state.authReducer.selected_knowledge_base_id)

    const mind_item_list = useSelector((state) => state.botReducer.mind_item_list);
    const num_mind_items = useSelector((state) => state.botReducer.num_mind_items);

    const [page_size, setPageSize] = useState(useSelector((state) => state.botReducer.page_size));
    const [mind_item_page, setMindItemPage] = useState(useSelector((state) => state.botReducer.mind_item_page))
    const [mind_item_filter, setMindItemFilter] = useState();

    let data = {
        filter: "",
        kbId: selected_knowledge_base_id,
        organisationId: selected_organisation_id,
        pageSize: 10,
        prevId: 0
    }

    useEffect(()=>{
            console.log("session useEffect",session_id)
            console.log("selected_organisation", data)
            dispatch(loadMindItems({ session_id, data }))
    },[load_data === 'load_now'])

    function isVisible() {
        return selected_organisation_id !== null && selected_organisation_id.length > 0 &&
            selected_organisation !== null && selected_organisation.id === selected_organisation_id &&
            selected_knowledge_base_id !== null && selected_knowledge_base_id.length > 0;
    }

    function getMemoryList() {

        if (mind_item_list) {
            return mind_item_list;
        }
        return [];
    }

    function filterMemories(event) {
        if (event.key === "Enter") {
            data.filter = mind_item_filter
            dispatch(loadMindItems({ session_id, data }));
        }
    }

    function handleEditMemory(m){
        console.log(`Editing... `);
        dispatch(showEditMemoryForm({show:true, memory: m}))
    }

    function handleAddMemory() {
        dispatch(showAddMemoryForm(true));
    }

    function deleteMemoryAsk(memory) {
            dispatch(showDeleteMemoryForm({show: true, memory: memory}))
    }
    function deleteAllMemoryAsk() {

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

////Legacy Functions


    // function deleteMemory(action) {
    //     if (action && Api.defined(this.state.mind_item)) {
    //         this.props.deleteMemory(this.state.mind_item.id);
    //     }
    //     if (this.props.closeDialog) {
    //         this.props.closeDialog();
    //     }
    // }
    //
    // function deleteAllMemoriesAsk() {
    //     this.props.openDialog("are you sure you want to remove all memories of this knowledge-base?",
    //         "Remove All Memories", (action) => {
    //             this.deleteAllMemories(action)
    //         });
    // }
    //
    // function deleteAllMemories(action) {
    //     if (action) {
    //         this.props.deleteAllMemories();
    //     }
    //     if (this.props.closeDialog) {
    //         this.props.closeDialog();
    //     }
    // }
    // function editMemory(memory) {
    //     setMindEdit(true);
    //     setMindItem(memory)
    //     // this.setState({mind_edit: true, mind_item: memory});
    // }
    //
    //
    // function programUploaded() {
    //     this.props.openDialog("SimSage is now processing these new memories.  Check 'the mind' periodically for updates.", "Uploading Memories", () => this.programUploadedClose());
    // }
    //
    // function programUploadedClose() {
    //     this.props.closeDialog();
    // }
    //
    // function mindDump() {
    //     if (this.props.session && session_id)
    //         Comms.download_mind_dump(selected_organisation_id, selected_knowledge_base_id, session_id);
    // }
    //
    // function save(memory) {
    //     if (memory) {
    //         if (memory.information.length > 0 && memory.questionList.length > 0) {
    //             this.props.saveMemory(memory);
    //             this.setState({mind_edit: false});
    //         } else {
    //             this.props.setError("Error Saving Memory", "memory must have questions and an answer");
    //         }
    //     } else {
    //         this.setState({mind_edit: false});
    //     }
    // }

    return (
        <div className="section px-5 pt-4">


            <div className="mind-page">

                {
                    isVisible() &&

                    <div className="filter-find-box">
                        <span className="filter-label">filter</span>
                        <span className="filter-find-text">
                            <input type="text"
                                   placeholder={"Filter"}
                                   value={mind_item_filter}
                                   autoFocus={true} className={"filter-text-width " + theme}
                                   onKeyDown={(event) => filterMemories(event)}
                                   onChange={(event) => {
                                       setMindItemFilter(event.target.value)
                                   }}
                            />
                        </span>
                    </div>
                }
                <br clear="both"/>

                {
                    isVisible() &&

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
                                getMemoryList().map((memory) => {
                                    return (
                                        <tr key={memory.id}>
                                            <td>
                                                <div>{memory.id}</div>
                                            </td>
                                            <td>
                                                <div className="mind-text-column"
                                                     title={getDisplayText(memory)}>{getDisplayText(memory)}</div>
                                            </td>
                                            <td>
                                                <button onClick={() => handleEditMemory(memory)} className="btn btn-secondary" title="edit memory">edit
                                                </button> &nbsp;
                                                <button onClick={() => deleteMemoryAsk(memory)} className="btn btn-secondary"
                                                        title="remove memory">remove
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                            <tr>
                                <td colSpan={3} className="bottom-td-margin">
                                    {selected_knowledge_base_id.length > 0 &&
                                        <div className="uploader">
                                            {/*<SpreadsheetUpload kbId={selected_knowledge_base_id}*/}
                                            {/*                   organisationId={selected_organisation_id}*/}
                                            {/*                   onUploadDone={() => programUploaded()}*/}
                                            {/*                   onError={(errStr) => this.props.setError("Error", errStr)}/>*/}
                                        </div>
                                    }
                                    {selected_knowledge_base_id.length > 0 &&
                                        <div className="export">
                                            <button className="btn btn-outline-primary btn-block"
                                            >Export
                                            </button>
                                            &nbsp;
                                            <button className="btn btn-outline-primary btn-block" title="new mind item"
                                                    onClick={() => handleAddMemory()}>new mind item
                                            </button>
                                            &nbsp;
                                            <button className="btn btn-outline-primary btn-block"
                                                    title="remove all mind items of this knowledgebase"
                                                    onClick={ () => deleteMemoryAsk("all")}
                                            >remove all mind items
                                            </button>
                                        </div>

                                    }
                                </td>
                            </tr>
                            </tbody>
                        </table>

                        <Pagination
                            rowsPerPageOptions={[5, 10, 25]}
                            theme={theme}
                            component="div"
                            count={num_mind_items}
                            rowsPerPage={page_size}
                            page={mind_item_page}
                            backIconButtonProps={{'aria-label': 'Previous Page',}}
                            nextIconButtonProps={{'aria-label': 'Next Page',}}
                            onChangePage={(page) => setMindItemPage(page)}
                            onChangeRowsPerPage={(rows) => setPageSize(rows)}
                        />

                    </div>
                }
            </div>
            <BotEdit />
            <BotDeleteAsk />
        </div>
    )
}