import {useDispatch, useSelector} from "react-redux";
import React, {useState, useEffect} from "react";
import {Pagination} from "../../common/pagination";
import {
    showEditMemoryForm,
    showAddMemoryForm,
    showDeleteMemoryForm,
    loadMindItems,
    showImportBotForm
} from "./botSlice";
import {BotEdit} from "./BotEdit";
import BotDeleteAsk from "./BotDeleteAsk";
import Comms from "../../common/comms";
import {BotImport} from "./BotImport";

export default function BotHome() {

    const theme = null;
    const dispatch = useDispatch()
    const session = useSelector((state) => state.authReducer.session);
    const session_id = session.id;
    const load_data = useSelector((state) => state.botReducer.data_status)

    const selected_organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)
    const selected_organisation = useSelector((state) => state.authReducer.selected_organisation)
    const selected_knowledge_base_id = useSelector((state) => state.authReducer.selected_knowledge_base_id)

    const show_import_form = useSelector((state) => state.botReducer.show_import_form)

    const mind_item_list = useSelector((state) => state.botReducer.mind_item_list);
    const num_mind_items = useSelector((state) => state.botReducer.num_mind_items);

    const [page_size, setPageSize] = useState(useSelector((state) => state.botReducer.page_size));
    const [mind_item_page, setMindItemPage] = useState(useSelector((state) => state.botReducer.mind_item_page))
    const [mind_item_filter, setMindItemFilter] = useState();

    const [filter, setFilter] = useState('')


    let data = {
        filter: "",
        kbId: selected_knowledge_base_id,
        organisationId: selected_organisation_id,
        pageSize: 10,
        prevId: 0
    }

    useEffect(() => {
        console.log("session useEffect", session_id)
        console.log("selected_organisation", data)
        dispatch(loadMindItems({session_id, data}))
    }, [load_data === "load_now", selected_knowledge_base_id])

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

    function handleExport() {
        Comms.download_mind_dump(selected_organisation_id, selected_knowledge_base_id, session_id)
    }

    function handleImport(show) {
        dispatch(showImportBotForm(show));
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

                <div className="form-group col ms-auto">
                    <button className="btn btn-primary text-nowrap" onClick={() => handleAddMemory()}>
                        + Add Bot Item
                    </button>
                </div>
            </div>


            {/*{*/}
            {/*    isVisible() &&*/}

            {/*    <div className="filter-find-box">*/}
            {/*        <span className="filter-label">filter</span>*/}
            {/*        <span className="filter-find-text">*/}
            {/*            <input type="text"*/}
            {/*                   placeholder={"Filter"}*/}
            {/*                   value={mind_item_filter}*/}
            {/*                   autoFocus={true} className={"filter-text-width " + theme}*/}
            {/*                   onKeyDown={(event) => filterMemories(event)}*/}
            {/*                   onChange={(event) => {*/}
            {/*                       setMindItemFilter(event.target.value)*/}
            {/*                   }}*/}
            {/*            />*/}
            {/*        </span>*/}
            {/*    </div>*/}
            {/*}*/}
            {/*<br clear="both"/>*/}

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
                                            <button onClick={() => handleEditMemory(memory)}
                                                    className="btn btn-secondary" title="edit memory">edit
                                            </button>
                                            &nbsp;
                                            <button onClick={() => deleteMemoryAsk(memory)}
                                                    className="btn btn-secondary"
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
                                    <div className="d-flex justify-content-between w-100 mb-4">
                                        <div className="form-group col">
                                            <button className="btn btn-outline-primary btn-block"
                                                    onClick={() => handleExport()}>Export
                                            </button>
                                            &nbsp;
                                            <button className="btn btn-outline-primary btn-block"
                                                    onClick={() => handleImport(!show_import_form)}>Import
                                            </button>
                                            {/*&nbsp;*/}
                                            {/*<button className="btn btn-outline-primary btn-block" title="new mind item"*/}
                                            {/*        onClick={() => handleAddMemory()}>new mind item*/}
                                            {/*</button>*/}
                                            &nbsp;
                                            <button className="btn btn-outline-primary btn-block"
                                                    title="remove all mind items of this knowledgebase"
                                                    onClick={() => deleteMemoryAsk("all")}
                                            >remove all mind items
                                            </button>
                                        </div>
                                    </div>
                                }
                                {show_import_form &&
                                    <div className="export">
                                        <BotImport/>
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
            <BotEdit/>
            <BotDeleteAsk/>
        </div>
    )
}