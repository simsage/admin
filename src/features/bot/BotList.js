import {useDispatch, useSelector} from "react-redux";
import React, {useState, useEffect} from "react";
import {Pagination} from "../../common/pagination";
import {
    showEditMemoryForm,
    showAddMemoryForm,
    showDeleteMemoryForm,
    loadMindItems,
    showBotImportForm
} from "./botSlice";
import {BotEdit} from "./BotEdit";
import BotDeleteAsk from "./BotDeleteAsk";
import Comms from "../../common/comms";
import BotImportForm from "./BotImportForm";

export default function BotHome() {

    const theme = null;
    const dispatch = useDispatch()
    const session = useSelector((state) => state.authReducer.session);
    const session_id = session.id;
    const load_data = useSelector((state) => state.botReducer.data_status)

    const selected_organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)
    const selected_organisation = useSelector((state) => state.authReducer.selected_organisation)
    const selected_knowledge_base_id = useSelector((state) => state.authReducer.selected_knowledge_base_id)

    const show_memory_form = useSelector((state) => state.botReducer.show_memory_form);
    const show_import_form = useSelector((state) => state.botReducer.show_import_form)

    const mind_item_list = useSelector((state) => state.botReducer.mind_item_list);
    const total_mind_items = useSelector((state) => state.botReducer.total_mind_items);

    const [bot_page_size, setPageSize] = useState(useSelector((state) => state.botReducer.page_size));
    const [bot_page, setBotPage] = useState(useSelector((state) => state.botReducer.mind_current_page_number))

    const [filter, setFilter] = useState('')

    const [page_history,setPageHistory] = useState([])
    const [prev_id,setPrevID] = useState(0)

    //
    // let prev_list = mind_item_list.slice(-1)[0]
    // let prev_id = bot_page !== 0 ? prev_list['id']:0
    console.log("bot_page",page_history)
    console.log("bot_page",prev_id)
    console.log("bot_page",bot_page)

    let data = {
        filter: "",
        kbId: selected_knowledge_base_id,
        organisationId: selected_organisation_id,
        pageSize: bot_page_size,
        prevId: prev_id,
    }


    useEffect(() => {
        dispatch(loadMindItems({session_id, data}))
    }, [load_data === "load_now", selected_knowledge_base_id, bot_page_size, bot_page])


    function handlePageChange(next_page){
        console.log("bot_page next_page",next_page)
        if(next_page > bot_page){
            // last list item is used for next page
            const last_row = mind_item_list.slice(-1)[0]
            const temp_last_id = last_row['id']
            setPrevID(temp_last_id);
            setPageHistory([...page_history,{page:next_page,id:prev_id}]);

        }else{
            const temp_prev_row = page_history.slice(-1)
            const temp_id = temp_prev_row && temp_prev_row.length === 1?temp_prev_row[0]["id"]:0
            setPrevID(temp_id);
            setPageHistory([...page_history.slice(0,-1)]);
        }
        setBotPage(next_page);
    }


    function handlePageSizeChange(row){
        setPageHistory([])
        setPrevID(0)
        setBotPage(0)
        setPageSize(row)
    }




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



    function filterRecords(event) {
        console.log(`Editing... `);
        if (event.key === "Enter") {
            data.filter = filter
            dispatch(loadMindItems({session_id, data}));
        }
    }

    function handleEditMemory(m) {
        console.log(`Editing... `);
        dispatch(showEditMemoryForm({show: true, memory: m}))
    }

    function handleAddMemory() {
        dispatch(showAddMemoryForm(true));
    }

    function deleteMemoryAsk(memory) {
        dispatch(showDeleteMemoryForm({show: true, memory: memory}))
    }

    function displayQuestions(memory) {
        let str = "";
        for (const question of memory.questionList) {
            if (str.length > 0) {
                str += " | ";
            }
            str += question;
        }
        return str;
    }

    function displayLinks(memory) {
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

    function handleExport() {
        Comms.download_mind_dump(selected_organisation_id, selected_knowledge_base_id, session_id)
    }

    function handleImport() {
        dispatch(showBotImportForm());
    }

    return (
        <div className="section px-5 pt-4">
            <div className="d-flex justify-content-between w-100 mb-4">
                <div className="d-flex w-100">
                    <div className="d-flex form-group me-2">
                        <input
                            type="text"
                            placeholder={"Search Bot..."}
                            autoFocus={true}
                            className={"form-control me-2 filter-search-input " + theme}
                            value={filter}
                            onChange={(e) => {
                                setFilter(e.target.value)
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') filterRecords(e)
                            }}
                        />
                        <button className="btn btn-secondary"
                                onClick={(e) => filterRecords(e)}
                                src="../images/dark-magnifying-glass.svg" title="search" alt="search">Search
                        </button>
                    </div>
                </div>

                <div className="form-group d-flex ms-auto">
                    <button className="btn btn-outline-primary text-nowrap ms-2"
                            onClick={() => handleImport(!show_import_form)}>Import
                    </button>
                    <button className="btn btn-outline-primary text-nowrap ms-2"
                            onClick={() => handleExport()}>Export
                    </button>
                    <button className="btn btn-outline-danger text-nowrap ms-2"
                            title="remove all mind items of this knowledgebase"
                            onClick={() => deleteMemoryAsk("all")}
                    >Remove all
                    </button>
                    <button className="btn btn-primary text-nowrap ms-2" onClick={() => handleAddMemory()}>
                        + Add Bot Item
                    </button>
                </div>
            </div>

            {
                isVisible() &&

                <div>
                    <table className="table">
                        <thead>
                        <tr className=''>
                            {/* <td className='small text-black-50 px-4'>id</td> */}
                            <td className='small text-black-50 px-4'>Memory</td>
                            <td className='small text-black-50 px-4'>Answer</td>
                            <td className='small text-black-50 px-4 text-truncate' style={{width: "100px"}}>Links</td>
                            <td className='small text-black-50 px-4'></td>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            getMemoryList().map((memory) => {
                                console.log('testing bot output', memory )
                                return (
                                    <tr key={memory.id}>
                                        <td className="pt-3 px-4 pb-2">
                                            <div className="d-flex flex-nowrap">
                                                <div className="mind-text-column small text-capitalize table-pill px-3 py-1 mb-2" style={{borderRadius: "12px"}}
                                                 title={displayQuestions(memory)}>{memory.questionList[0]}
                                                </div>
                                                <span className="small fw-light fst-italic px-2 py-1 text-secondary pointer-cursor">{memory.questionList.length > 1 ? `+${memory.questionList.length -1}` : ''}</span>
                                            </div>
                                        </td>
                                        <td className="pt-3 px-4 pb-3">
                                            <div className="mind-text-column"
                                                 title={memory.information}>{memory.information}</div>
                                        </td>
                                        <td className="pt-3 px-4 pb-3">
                                            { memory.urlList.map( url => {
                                                return (
                                                    <div className="mind-text-column text-black-50 small text-truncate" style={{width: "200px"}}
                                                         title={url}>{url}
                                                    </div>
                                                )
                                            })
                                            }
                                        </td>
                                        <td className="pt-3 px-4 pb-0">
                                            <div className="d-flex  justify-content-end">
                                                <button onClick={() => handleEditMemory(memory)}
                                                        className="btn text-primary btn-sm" title="edit memory">Edit
                                                </button>
                                                &nbsp;
                                                <button onClick={() => deleteMemoryAsk(memory)}
                                                        className="btn text-danger btn-sm"
                                                        title="remove memory">Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                        
                        </tbody>
                    </table>

                    <Pagination
                        rowsPerPageOptions={[5, 10, 25]}
                        theme={theme}
                        component="div"
                        count={total_mind_items}
                        rowsPerPage={bot_page_size}
                        page={bot_page}
                        backIconButtonProps={{'aria-label': 'Previous Page',}}
                        nextIconButtonProps={{'aria-label': 'Next Page',}}
                        onChangePage={(page) => handlePageChange(page)}
                        onChangeRowsPerPage={(rows) => handlePageSizeChange(rows)}
                    />


                </div>
            }
            {show_memory_form &&
            <BotEdit/>
            }
            <BotDeleteAsk/>
            <BotImportForm/>
        </div>
    )
}