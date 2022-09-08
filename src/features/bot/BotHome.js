import {useDispatch, useSelector} from "react-redux";
import React, {useState, useEffect} from "react";
import BotFilter from "./BotFilter";
import {Pagination} from "../../common/pagination";
import Comms from "../../common/comms";
import Api from "../../common/api";
import {getUserList} from "../users/usersSlice";
import {loadMindItems} from "./botSlice";

export default function BotHome(props) {
    const title = "Bot";
    const theme = null;
    const selected_organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)
    const selected_organisation = useSelector((state) => state.authReducer.selected_organisation)
    const selected_knowledge_base_id = useSelector((state) => state.authReducer.selected_knowledge_base_id)

    const mind_item_list = useSelector((state) => state.botReducer.mind_item_list)

    let [mind_item, setMindItem] = useState();
    let [mind_edit, setMindEdit] = useState();
    let [mind_item_filter, setMindItemFilter] = useState();

    const num_mind_items = useSelector((state) => state.botReducer.num_mind_items)
    const [page_size, setPageSize] = useState(useSelector((state) => state.botReducer.page_size));
    const [mind_item_page, setMindItemPage] = useState(useSelector((state) => state.botReducer.mind_item_page))

    const dispatch = useDispatch()
    const session = useSelector((state) => state.authReducer.session);
    const session_id = session.id;
    const user = useSelector((state) => state.authReducer.user);

    const data = {
        filter: "",
        kbId: selected_knowledge_base_id,
        organisationId: selected_organisation_id,
        pageSize: 10,
        prevId: 0
    };

    useEffect(()=>{
        if(true){
            console.log("session useEffect",session_id)
            console.log("selected_organisation", data)
            dispatch(loadMindItems({ session_id, data }))
        }
    },[])


    function deleteMemoryAsk(memory) {
        if (memory) {
            this.props.openDialog("are you sure you want to remove id " + memory.id + "?<br/><br/>(" + memory.questionList[0] + ")",
                "Remove Memory", (action) => {
                    this.deleteMemory(action)
                });
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
            "Remove All Memories", (action) => {
                this.deleteAllMemories(action)
            });
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
        setMindEdit(true);
        setMindItem(memory)
        // this.setState({mind_edit: true, mind_item: memory});
    }

    function newMemory() {
        this.setState({
            mind_edit: true, mind_item: {
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
        if (this.props.session && session_id)
            Comms.download_mind_dump(selected_organisation_id, selected_knowledge_base_id, session_id);
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

        const list = mind_item_list.memoryList ? mind_item_list.memoryList : false;
        if (list) {
            return list;
        }
        return [];
    }

    function isVisible() {
        return selected_organisation_id !== null && selected_organisation_id.length > 0 &&
            selected_organisation !== null && selected_organisation.id === selected_organisation_id &&
            selected_knowledge_base_id !== null && selected_knowledge_base_id.length > 0;
    }

    function getMindItems() {

    }


    return (
        <div className="section px-5 pt-4">

            {/*<BotFilter />*/}
            <div className="mind-page">
                {/*<MindEdit open={mind_edit}*/}
                {/*          theme={theme}*/}
                {/*          memory={mind_item}*/}
                {/*          onSave={(item) => save(item)}*/}
                {/*          onError={(err) => this.props.setError("Error", err)} />*/}

                {
                    isVisible() &&

                    <div className="filter-find-box">
                        <span className="filter-label">filter</span>
                        <span className="filter-find-text">
                            <input type="text" value={mind_item_filter}
                                   autoFocus={true} className={"filter-text-width " + theme}
                                   onKeyPress={(event) => handleSearchTextKeydown(event)}
                                   onChange={(event) => {
                                       setMindItemFilter(event.target.value)
                                   }}/>
                        </span> &nbsp;
                        <span className="filter-find-image">
                            <button className="btn btn-secondary"
                                    onClick={() => getMindItems()}
                                    src="../images/dark-magnifying-glass.svg" title="search"
                                    alt="search">search</button>
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
                                                <button onClick={() => editMemory(memory)} className="btn btn-secondary" title="edit memory">edit
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
                                                    onClick={() => mindDump()}>Export
                                            </button>
                                            &nbsp;
                                            <button className="btn btn-outline-primary btn-block" title="new mind item"
                                                    onClick={() => newMemory()}>new mind item
                                            </button>
                                            &nbsp;
                                            <button className="btn btn-outline-primary btn-block"
                                                    title="remove all mind items of this knowledgebase"
                                                    onClick={() => deleteAllMemoriesAsk()}>remove all mind items
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
        </div>
    )
}