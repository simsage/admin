import {useState} from "react";
import {useSelector} from "react-redux";
import Api from "../../common/api";
import {Pagination} from "../../common/pagination";

export default function KnowledgeBaseList(){

    const defaultDmsIndexSchedule = '';
    const theme = '';
    const kb_list = useSelector((state) => state.kbReducer.kb_list)

    //TODO::selected_organisation_id -- should obtain it from the store
    const selected_organisation_id = '1'
    const [kb_page, setKbPage] = useState(0)
    const [kb_page_size, setKbPageSize] = useState(useSelector((state) => state.kbReducer.kb_page_size))



    function getKnowledgeBases() {
        const paginated_list = [];
        const first = kb_page * kb_page_size;
        const last = first + parseInt(kb_page_size);
        for (const i in kb_list) {
            if (i >= first && i < last) {
                paginated_list.push(kb_list[i]);
            }
        }
        return paginated_list;
    }

    function isVisible() {
        //Todo:: verify selected org before display
        // return this.props.selected_organisation_id && this.props.selected_organisation_id.length > 0 &&
        //     this.props.selected_organisation && this.props.selected_organisation.length > 0;
        return true;
    }

    function addNewKnowledgeBase() {
        this.setState({edit_knowledgebase: true,
            knowledgeBase: null,
            edit_knowledgebase_id: "",
            edit_name: "",
            edit_email: "",
            edit_enabled: true,
            edit_max_queries_per_day: "0",
            edit_analytics_window_size_in_months: "0",
            edit_operator_enabled: true,
            edit_capacity_warnings: true,
            edit_enable_document_similarity: true,
            edit_document_similarity_threshold: 0.9,
            edit_created: 0,
            edit_security_id: Api.createGuid(),
            edit_dms_index_schedule: defaultDmsIndexSchedule,
        })
    }

    function viewIds(knowledge_base){
        //TODO::add viewIds
        console.log("viewIds")
    }
    function editKnowledgeBase(knowledge_base){
        //TODO::add editKnowledgeBase
        console.log("editKnowledgeBase")
    }
    function deleteKnowledgeBaseAsk(knowledge_base){
        //TODO::add deleteKnowledgeBaseAsk
        console.log("deleteKnowledgeBaseAsk")
    }
    function optimizeIndexesAsk(knowledge_base){
        //TODO::add optimizeIndexesAsk
        console.log("optimizeIndexesAsk")
    }


    return(
        <div className="kb-page">
            { isVisible() &&

            <div>

                <div>
                    <table className="table">
                        <thead>
                        <tr className='table-header'>
                            <th className='table-header table-width-20'>Knowledge Base</th>
                            <th className='table-header table-width-20'>Email Queries</th>
                            <th className='table-header'>actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            getKnowledgeBases().map((knowledge_base) => {
                                return (
                                    <tr key={knowledge_base.kbId}>
                                        <td>
                                            <div className="kb-label">{knowledge_base.name}</div>
                                        </td>
                                        <td>
                                            <div className="kb-label">{knowledge_base.email}</div>
                                        </td>

                                        <td>
                                            <div className="link-button" onClick={() => viewIds(knowledge_base)}>
                                                <img src="../images/id.svg" className="image-size" title="view knowledge base ids" alt="ids"/>
                                            </div>
                                            <div className="link-button" onClick={() => editKnowledgeBase(knowledge_base)}>
                                                <img src="../images/edit.svg" className="image-size" title="edit knowledge base" alt="edit"/>
                                            </div>
                                            <div className="link-button" onClick={() => deleteKnowledgeBaseAsk(knowledge_base)}>
                                                <img src="../images/delete.svg" className="image-size" title="remove knowledge base" alt="remove"/>
                                            </div>
                                            <div className="link-button" onClick={() => optimizeIndexesAsk(knowledge_base)}>
                                                <img src="../images/optimize-indexes.svg" className="image-size" title="optimize indexes" alt="optimize"/>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                        <tr>
                            <td/>
                            <td/>
                            <td>
                                {selected_organisation_id > 0 &&
                                <div className="kb-image-button" onClick={() => this.addNewKnowledgeBase()}>
                                    <img
                                        className="image-size" src="../images/add.svg" title="add new user"
                                        alt="add new user"/></div>
                                }
                            </td>
                        </tr>
                        </tbody>
                    </table>

                    <Pagination
                        rowsPerPageOptions={[5, 10, 25]}
                        theme={theme}
                        component="div"
                        count={kb_list.length}
                        rowsPerPage={kb_page_size}
                        page={kb_page}
                        backIconButtonProps={{'aria-label': 'Previous Page',}}
                        nextIconButtonProps={{'aria-label': 'Next Page',}}
                        onChangePage={(page) => setKbPage(page)}
                        onChangeRowsPerPage={(rows) => setKbPageSize(rows)}
                    />

                </div>

                {/*//TODO::edit kb - move this to a new file*/}
                {
                    // this.state.edit_knowledgebase &&
                    // <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline"}}>
                    //     <div className={"modal-dialog modal-dialog-centered modal-xl"} role="document">
                    //         <div className="modal-content shadow p-3 mb-5 bg-white rounded kb-height">
                    //             <div
                    //                 className="modal-header">{this.state.edit_knowledgebase_id ? "Edit Knowledge Base" : "Add New Knowledge Base"}</div>
                    //             <div className="modal-body">
                    //                 <div>
                    //
                    //                     <div className="control-row">
                    //                         <span className="label-2">name</span>
                    //                         <span className="text">
                    //                                     <input type="text"
                    //                                            autoFocus={true}
                    //                                            className="edit-box"
                    //                                            placeholder="knowledge base name"
                    //                                            value={this.state.edit_name}
                    //                                            onChange={(event) => this.setState({edit_name: event.target.value})}
                    //                                     />
                    //                                 </span>
                    //                     </div>
                    //
                    //                     <div className="control-row">
                    //                         <span className="label-2">email questions to</span>
                    //                         <span className="text">
                    //                                     <input type="text"
                    //                                            className="edit-box"
                    //                                            placeholder="email questions to"
                    //                                            value={this.state.edit_email}
                    //                                            onChange={(event) => this.setState({edit_email: event.target.value})}
                    //                                     />
                    //                                 </span>
                    //                     </div>
                    //
                    //                     <div className="control-row">
                    //                         <span className="label-2">security id</span>
                    //                         <span className="text">
                    //                                 <input type="text"
                    //                                        className="sid-box"
                    //                                        disabled={true}
                    //                                        placeholder="security id"
                    //                                        value={this.state.edit_security_id}
                    //                                        onChange={(event) => this.setState({edit_security_id: event.target.value})}
                    //                                 />
                    //                                 </span>
                    //                         <img title="generate new security id" alt="refresh"
                    //                              src={theme === 'light' ? "../images/refresh.svg" : "../images/refresh-dark.svg"}
                    //                              onClick={() => this.refreshSecurityId()}
                    //                              className="image-size" />
                    //                     </div>
                    //
                    //                     <div className="control-row">
                    //                                 <span className="checkbox-only">
                    //                                     <input type="checkbox"
                    //                                            checked={this.state.edit_enabled}
                    //                                            onChange={(event) => {
                    //                                                this.setState({edit_enabled: event.target.checked});
                    //                                            }}
                    //                                            value="enable this knowledge-base?"
                    //                                     />
                    //                                 </span>
                    //                         <span>knowledge-base enabled?</span>
                    //                     </div>
                    //
                    //
                    //                     <div className="control-row">
                    //                                 <span className="checkbox-only">
                    //                                     <input type="checkbox"
                    //                                            checked={this.state.edit_operator_enabled}
                    //                                            onChange={(event) => {
                    //                                                this.setState({edit_operator_enabled: event.target.checked});
                    //                                            }}
                    //                                            value="enable operator access?"
                    //                                     />
                    //                                 </span>
                    //                         <span>operator enabled?</span>
                    //                     </div>
                    //
                    //
                    //                     <div className="control-row">
                    //                                 <span className="checkbox-only">
                    //                                     <input type="checkbox"
                    //                                            checked={this.state.edit_capacity_warnings}
                    //                                            onChange={(event) => {
                    //                                                this.setState({edit_capacity_warnings: event.target.checked});
                    //                                            }}
                    //                                            value="enable capacity warnings?"
                    //                                     />
                    //                                 </span>
                    //                         <span>capacity-warnings on?</span>
                    //                     </div>
                    //
                    //
                    //                     <div className="control-row">
                    //                                 <span className="checkbox-only">
                    //                                     <input type="checkbox"
                    //                                            checked={this.state.edit_enable_document_similarity}
                    //                                            onChange={(event) => {
                    //                                                this.setState({edit_enable_document_similarity: event.target.checked});
                    //                                            }}
                    //                                            value="enable document similarity?"
                    //                                     />
                    //                                 </span>
                    //                         <span>enable document similarity?</span>
                    //                     </div>
                    //
                    //
                    //                     <div className="control-row">
                    //                         <span className="label-wide">maximum number of queries per day (0 is no limits)</span>
                    //                         <span className="text">
                    //                                     <input type="text"
                    //                                            onChange={(event) => this.setState({edit_max_queries_per_day: event.target.value})}
                    //                                            placeholder="max transactions per month"
                    //                                            value={this.state.edit_max_queries_per_day}
                    //                                     />
                    //                                 </span>
                    //                     </div>
                    //
                    //
                    //                     <div className="control-row">
                    //                         <span className="label-wide">maximum analytics retention period in months (0 is no limits)</span>
                    //                         <span className="text">
                    //                                     <input type="text"
                    //                                            onChange={(event) => this.setState({edit_analytics_window_size_in_months: event.target.value})}
                    //                                            placeholder="max analytics retention period in months"
                    //                                            value={this.state.edit_analytics_window_size_in_months}
                    //                                     />
                    //                                 </span>
                    //                     </div>
                    //
                    //
                    //                     {/*<div className="control-row">*/}
                    //                     {/*    <span className="label-wide">document similarity (a number between 0.75 and 1.0)</span>*/}
                    //                     {/*    <span className="text">*/}
                    //                     {/*        <input type="text"*/}
                    //                     {/*               onChange={(event) => this.setState({edit_document_similarity_threshold: event.target.value})}*/}
                    //                     {/*               placeholder="document similarity threshold"*/}
                    //                     {/*               value={this.state.edit_document_similarity_threshold}*/}
                    //                     {/*        />*/}
                    //                     {/*    </span>*/}
                    //                     {/*</div>*/}
                    //
                    //
                    //                 </div>
                    //
                    //             </div>
                    //             <div className="modal-footer">
                    //                 <button className="btn btn-primary btn-block"  onClick={() => this.editCancel()}>Cancel</button>
                    //                 <button className="btn btn-primary btn-block"  onClick={() => this.editOk()}>Save</button>
                    //             </div>
                    //         </div>
                    //     </div>
                    // </div>
                }

            </div>
            }
        </div>
    )
}