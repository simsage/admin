import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {store} from "../../app/store";
import {closeForm, showAddForm, showEditForm} from "./knowledgeBaseSlice";

export default function KnowledgeBaseEdit(){

    const theme = null;
    const dispatch = useDispatch();

    const organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)
    const session = useSelector((state) => state).authReducer.session;

    const show_kb_form = useSelector((state) => state.kbReducer.show_form)
    const kb_id = useSelector((state) => state.kbReducer.edit_id)
    const kb_list = useSelector((state) => state.kbReducer.kb_list)
    let kb = undefined;


    console.log(kb_id)
    // alert("Heloo")

    //Load KB
    if(kb_id && kb_list) {
        console.log("enabled 1",kb)
        let temp_obj = kb_list.filter((obj) => {return obj.kbId === kb_id})
        console.log("enabled 2",temp_obj)
        if(temp_obj.length > 0){
            kb = (temp_obj[0])
            console.log("enabled 3",kb)
        }
    }

    if(kb){
        console.log("name true",kb)
    } else {
        console.log("name----------------------")
    }

    let [name,setName] = useState((kb)?kb.name:'');
    let [email,setEmail] = useState((kb)?kb.email:'');
    let [enabled,setEnabled] = useState((kb)?kb.enabled:true);
    let [security_id,setSecurityId] = useState((kb)?kb.securityId:'');
    let [max_queries_per_day,setMaxQueriesPerDay] = useState((kb)?kb.maxQueriesPerDay:0);
    let [analytics_window_size_in_months,setAnalyticsWindowInMonths] = useState((kb)?kb.analyticsWindowInMonths:'');
    let [capacity_warnings,setCapacityWarnings] = useState((kb)?kb.capacityWarnings:true);
    let [created,setCreated] = useState((kb)?kb.created:'');
    let [dms_index_schedule,setDmsIndexSchedule] = useState((kb)?kb.dmsIndexSchedule:'');
    let [operator_enabled,setOperatorEnabled] = useState((kb)?kb.operatorEnabled:true);
    let [enable_document_similarity,setEnableDocumentSimilarity] = useState((kb)?kb.enableDocumentSimilarity:'');
    let [document_similarity_threshold,setDocumentSimilarityThreshold] = useState((kb)?kb.documentSimilarityThreshold:'');
    

    // name: "demo knowledge-base"
    // email: "info@simsage.nz"
    // enabled: true
    // securityId: "48f9a7f5-6d6b-9766-a232-6ef59eae7cae"
    // maxQueriesPerDay: 0
    // analyticsWindowInMonths: 12
    // capacityWarnings: true
    // created: 1578649263780
    // dmsIndexSchedule: ""
    // documentSimilarityThreshold: 0.9
    // enableDocumentSimilarity: true
    // kbId: "46ff0c75-7938-492c-ab50-442496f5de51"
    // operatorEnabled: true
    // organisationId: "c276f883-e0c8-43ae-9119-df8b7df9c574"
    //
    //


//     const payload = {"kbId": kb_id,
//     "organisationId": organisation_id,
//     "name": name, "email": email,
//         "securityId": security_id,
//         "maxQueriesPerDay": max_queries_per_day,
//         "enabled": enabled,
//         "analyticsWindowInMonths": analytics_window_size_in_months,
//         "operatorEnabled": operator_enabled,
//         "capacityWarnings": capacity_warnings,
//         "created": created,
//         "dmsIndexSchedule": dms_index_schedule,
//         "enableDocumentSimilarity": enable_similarity,
//         "documentSimilarityThreshold": similarity_threshold};

    // let form = {edit_knowledge_base: true, knowledgeBase: null,
    //     edit_knowledge_base_id: "",
    //     edit_name: "",
    //     edit_email: "",
    //     edit_enabled: true,
    //     edit_max_queries_per_day: "0",
    //     edit_analytics_window_size_in_months: "0",
    //     edit_operator_enabled: true,
    //     edit_capacity_warnings: true,
    //     edit_enable_document_similarity: true,
    //     edit_document_similarity_threshold: 0.9,
    //     edit_created: 0,
    //     edit_security_id:1,
    //     edit_dms_index_schedule:true
    //     // edit_security_id: Api.createGuid(),
    //     // edit_dms_index_schedule: defaultDmsIndexSchedule,
    // };

    const title = (kb_id)?"Edit Knowledge Base":"Add new Knowledge Base";




    const handleClose = () => {
        dispatch(closeForm());
    }

    if (!show_kb_form)
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
                          <button onClick={ handleClose } type="button" className="btn-close" data-bs-dismiss="modal"
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
                                                               value={name}
                                                               onChange={(event) => setName(event.target.value)}
                                                        />
                                                    </span>
                                  </div>

                                  <div className="control-row">
                                      <span className="label-2">email questions to</span>
                                      <span className="text">
                                                        <input type="text"
                                                               className="edit-box"
                                                               placeholder="email questions to"
                                                               value={email}
                                                               onChange={(event) => setEmail(event.target.value)}
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
                                                           value={security_id}
                                                           onChange={(event) => setSecurityId(event.target.value)}
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
                                                               checked={enabled}
                                                               onChange={(event) => {setEnabled(event.target.value)}}
                                                               value="enable this knowledge-base?"
                                                        />
                                                    </span>
                                      <span>knowledge-base enabled?</span>
                                  </div>


                                  <div className="control-row">
                                                    <span className="checkbox-only">
                                                        <input type="checkbox"
                                                               checked={operator_enabled}
                                                               onChange={(event) => {
                                                                   setOperatorEnabled(event.target.checked);
                                                               }}
                                                               value="enable operator access?"
                                                        />
                                                    </span>
                                      <span>operator enabled?</span>
                                  </div>


                                  <div className="control-row">
                                                    <span className="checkbox-only">
                                                        <input type="checkbox"
                                                               checked={capacity_warnings}
                                                               onChange={(event) => {
                                                                   setCapacityWarnings(event.target.checked);
                                                               }}
                                                               value="enable capacity warnings?"
                                                        />
                                                    </span>
                                      <span>capacity-warnings on?</span>
                                  </div>


                                  <div className="control-row">
                                                    <span className="checkbox-only">
                                                        <input type="checkbox"
                                                               checked={enable_document_similarity}
                                                               onChange={(event) => {
                                                                   setEnableDocumentSimilarity(event.target.checked);
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
                                                               onChange={(event) => setMaxQueriesPerDay(event.target.value)}
                                                               placeholder="max transactions per month"
                                                               value={max_queries_per_day}
                                                        />
                                                    </span>
                                  </div>


                                  <div className="control-row">
                                      <span className="label-wide">maximum analytics retention period in months (0 is no limits)</span>
                                      <span className="text">
                                                        <input type="text"
                                                               onChange={(event) => setAnalyticsWindowInMonths(event.target.value)}
                                                               placeholder="max analytics retention period in months"
                                                               value={analytics_window_size_in_months}
                                                        />
                                                    </span>
                                  </div>


                                  {/*<div className="control-row">*/}
                                  {/*    <span className="label-wide">document similarity (a number between 0.75 and 1.0)</span>*/}
                                  {/*    <span className="text">*/}
                                  {/*        <input type="text"*/}
                                  {/*               onChange={(event) => this.setState({edit_document_similarity_threshold: event.target.value})}*/}
                                  {/*               placeholder="document similarity threshold"*/}
                                  {/*               value={document_similarity_threshold}*/}
                                  {/*        />*/}
                                  {/*    </span>*/}
                                  {/*</div>*/}


                              </div>

                          </div>
                      <div className="modal-footer">
                          <button onClick={ handleClose } type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                          <button type="button" className="btn btn-primary">Save</button>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    );
}