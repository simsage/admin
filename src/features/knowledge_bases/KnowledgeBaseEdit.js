import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {store} from "../../app/store";
import {showAddKnowledgeBaseForm} from "./knowledgeBaseSlice";

export default function KnowledgeBaseEdit(){

    let form = {edit_knowledge_base: true, knowledgeBase: null,
        edit_knowledge_base_id: "",
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
        edit_security_id:1,
        edit_dms_index_schedule:true
        // edit_security_id: Api.createGuid(),
        // edit_dms_index_schedule: defaultDmsIndexSchedule,
    };

    const title = "Add a new Knowledge Base";
    const theme = null;
    const dispatch = useDispatch();
    const handleClose = () => {
        dispatch(showAddKnowledgeBaseForm(false));
        // store.dispatch(showAddKnowledgeBaseForm(false))
    }

    const show_knowledge_base_form = useSelector((state) => state.knowledge.show_knowledge_base_form)
    if (!show_knowledge_base_form)
        return (<div />);
    return(

      <div>
          <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline"}}>
              <div className={"modal-dialog modal-dialog-centered modal-lg"} role="document">
                  <div className="modal-content shadow p-3 mb-5 bg-white rounded">

          {/*<div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false"*/}
          {/*     tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="false">*/}
          {/*    <div className="modal-dialog">*/}
          {/*        <div className="modal-content">*/}
                      <div className="modal-header">
                          <h5 className="modal-title" id="staticBackdropLabel">{title}</h5>
                          <button type="button" className="btn-close" data-bs-dismiss="modal"
                                  aria-label="Close"></button>
                      </div>
                      <div className="modal-body">
                              <div>
                                  <div className="control-row">
                                      <span className="label-2">name</span>
                                      <span className="text">
                                                        <input type="text"
                                                               autoFocus={true}
                                                               className="edit-box"
                                                               placeholder="knowledge base name"
                                                               value={form.edit_name}
                                                               onChange={(event) => this.setState({edit_name: event.target.value})}
                                                        />
                                                    </span>
                                  </div>

                                  <div className="control-row">
                                      <span className="label-2">email questions to</span>
                                      <span className="text">
                                                        <input type="text"
                                                               className="edit-box"
                                                               placeholder="email questions to"
                                                               value={form.edit_email}
                                                               onChange={(event) => this.setState({edit_email: event.target.value})}
                                                        />
                                                    </span>
                                  </div>

                                  <div className="control-row">
                                      <span className="label-2">security id</span>
                                      <span className="text">
                                                    <input type="text"
                                                           className="sid-box"
                                                           disabled={true}
                                                           placeholder="security id"
                                                           value={form.edit_security_id}
                                                           onChange={(event) => this.setState({edit_security_id: event.target.value})}
                                                    />
                                                    </span>
                                      <img title="generate new security id" alt="refresh"
                                           src={theme === 'light' ? "../images/refresh.svg" : "../images/refresh-dark.svg"}
                                           onClick={() => this.refreshSecurityId()}
                                           className="image-size" />
                                  </div>

                                  <div className="control-row">
                                                    <span className="checkbox-only">
                                                        <input type="checkbox"
                                                               checked={form.edit_enabled}
                                                               onChange={(event) => {
                                                                   this.setState({edit_enabled: event.target.checked});
                                                               }}
                                                               value="enable this knowledge-base?"
                                                        />
                                                    </span>
                                      <span>knowledge-base enabled?</span>
                                  </div>


                                  <div className="control-row">
                                                    <span className="checkbox-only">
                                                        <input type="checkbox"
                                                               checked={form.edit_operator_enabled}
                                                               onChange={(event) => {
                                                                   this.setState({edit_operator_enabled: event.target.checked});
                                                               }}
                                                               value="enable operator access?"
                                                        />
                                                    </span>
                                      <span>operator enabled?</span>
                                  </div>


                                  <div className="control-row">
                                                    <span className="checkbox-only">
                                                        <input type="checkbox"
                                                               checked={form.edit_capacity_warnings}
                                                               onChange={(event) => {
                                                                   this.setState({edit_capacity_warnings: event.target.checked});
                                                               }}
                                                               value="enable capacity warnings?"
                                                        />
                                                    </span>
                                      <span>capacity-warnings on?</span>
                                  </div>


                                  <div className="control-row">
                                                    <span className="checkbox-only">
                                                        <input type="checkbox"
                                                               checked={form.edit_enable_document_similarity}
                                                               onChange={(event) => {
                                                                   this.setState({edit_enable_document_similarity: event.target.checked});
                                                               }}
                                                               value="enable document similarity?"
                                                        />
                                                    </span>
                                      <span>enable document similarity?</span>
                                  </div>


                                  <div className="control-row">
                                      <span className="label-wide">maximum number of queries per day (0 is no limits)</span>
                                      <span className="text">
                                                        <input type="text"
                                                               onChange={(event) => this.setState({edit_max_queries_per_day: event.target.value})}
                                                               placeholder="max transactions per month"
                                                               value={form.edit_max_queries_per_day}
                                                        />
                                                    </span>
                                  </div>


                                  <div className="control-row">
                                      <span className="label-wide">maximum analytics retention period in months (0 is no limits)</span>
                                      <span className="text">
                                                        <input type="text"
                                                               onChange={(event) => this.setState({edit_analytics_window_size_in_months: event.target.value})}
                                                               placeholder="max analytics retention period in months"
                                                               value={form.edit_analytics_window_size_in_months}
                                                        />
                                                    </span>
                                  </div>


                                  {/*<div className="control-row">*/}
                                  {/*    <span className="label-wide">document similarity (a number between 0.75 and 1.0)</span>*/}
                                  {/*    <span className="text">*/}
                                  {/*        <input type="text"*/}
                                  {/*               onChange={(event) => this.setState({edit_document_similarity_threshold: event.target.value})}*/}
                                  {/*               placeholder="document similarity threshold"*/}
                                  {/*               value={form.edit_document_similarity_threshold}*/}
                                  {/*        />*/}
                                  {/*    </span>*/}
                                  {/*</div>*/}


                              </div>

                          </div>
                      <div className="modal-footer">
                          <button onClick={ handleClose } type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                          <button type="button" className="btn btn-primary">Understood</button>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    );
}