import {useSelector} from "react-redux";
import KnowledgeBaseForm from "./KnowledgeBaseForm";

export default function KnowledgeBaseEdit(){
    const show_kb_form = useSelector((state)=>state.kbReducer.show_form);


    if (!show_kb_form)
        return (<div />);

    return(
        <KnowledgeBaseForm
            show_kb_form = {show_kb_form}
        />
    );

}


// import {useEffect, useState} from "react";
// import {useDispatch, useSelector} from "react-redux";
// import {store} from "../../app/store";
// import {addOrUpdate, closeForm, getKBList, showAddForm, showEditForm} from "./knowledgeBaseSlice";
// import {getOrganisationList, updateOrganisation} from "../organisations/organisationSlice";
// import App from "../../App";
// import Api from "../../common/api";
//
// export default function KnowledgeBaseEdit(){
//
//     const theme = null;
//     const dispatch = useDispatch();
//
//     const organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)
//     const session = useSelector((state) => state.authReducer.session);
//
//     const kb_id = useSelector((state) => state.kbReducer.edit_id)
//     const kb_list = useSelector((state) => state.kbReducer.kb_list)
//     let kb = undefined;
//
//     console.log("Load ID", kb_id)
//
//     const [refreshKey, setRefreshKey] = useState(0);
//
//     const [name,setName] = useState('');
//     const [email,setEmail] = useState('');
//     const [enabled,setEnabled] = useState(true);
//     const [security_id,setSecurityId] = useState('');
//     const [max_queries_per_day,setMaxQueriesPerDay] = useState(0);
//     const [analytics_window_size_in_months,setAnalyticsWindowInMonths] = useState('');
//     const [capacity_warnings,setCapacityWarnings] = useState(true);
//     const [created,setCreated] = useState('');
//     const [dms_index_schedule,setDmsIndexSchedule] = useState('');
//     const [operator_enabled,setOperatorEnabled] = useState(true);
//
//     const [enable_document_similarity,setEnableDocumentSimilarity] = useState((kb)?kb.enableDocumentSimilarity:'');
//     const [document_similarity_threshold,setDocumentSimilarityThreshold] = useState(0.9);
//
//     const show_kb_form = useSelector((state)=>state.kbReducer.show_form)
//     const kb_show_form = useSelector((state)=>state.kbReducer.show_form)
//
//     //page title
//     const title = (kb_id)?"Edit Knowledge Base":"Add new Knowledge Base";
//
//
//     useEffect(()=>{
//         //Load KB if available
//         if(kb_id && kb_list) {
//             console.log("enabled 1",kb)
//             let temp_obj = kb_list.filter((obj) => {return obj.kbId === kb_id})
//             console.log("enabled 2",temp_obj)
//             if(temp_obj.length > 0){
//                 kb = (temp_obj[0])
//                 console.log("enabled 3",kb)
//             }
//         }
//         //populate the form
//         if(kb){
//             setName(kb.name)
//             setEmail(kb.email)
//             setEnabled(kb.enabled)
//             setSecurityId(kb.securityId)
//             setMaxQueriesPerDay(kb.maxQueriesPerDay)
//
//             setAnalyticsWindowInMonths(kb.analyticsWindowInMonths)
//             setCapacityWarnings(kb.capacityWarnings)
//             setCreated(kb.created)
//             setDmsIndexSchedule(kb.dmsIndexSchedule)
//             setOperatorEnabled(kb.operatorEnabled)
//
//             setEnableDocumentSimilarity(kb.enableDocumentSimilarity)
//             setDocumentSimilarityThreshold(kb.documentSimilarityThreshold)
//
//         }else {
//             //load new form
//             refreshSecurityId();
//             setDocumentSimilarityThreshold(0.9)
//         }
//
//     },[kb_show_form])
//
//     useEffect(()=>{
//         if(kb_id === undefined){
//             refreshSecurityId();
//         }
//     },[kb_show_form])
//
//     const clearFormData = () => {
//         setName('')
//         setEmail('')
//         setEnabled(false)
//         setSecurityId('')
//         setMaxQueriesPerDay(0)
//         setAnalyticsWindowInMonths('')
//         setCapacityWarnings(false)
//         setCreated('')
//         setDmsIndexSchedule('')
//         setOperatorEnabled(false)
//         setEnableDocumentSimilarity(false)
//         setDocumentSimilarityThreshold(0.9)
//     }
//
//     //handle form close or cancel
//     const handleClose = () => {
//         clearFormData();
//         dispatch(closeForm());
//     }
//
//
//     const refreshSecurityId = () => {
//         console.log("kb_show_form")
//         setSecurityId(Api.createGuid())
//     }
//     // refreshSecurityId()
//
//     const handleSave = () => {
//         if(email.length > 3 && name.length > 3 && security_id.length > 0) {
//
//             console.log("handleSave called")
//             const session_id = session.id
//             if (organisation_id !== undefined) {
//                 const data = {
//                     kbId: kb_id,
//                     organisationId: organisation_id,
//                     name: name,
//                     email: email,
//                     securityId: security_id,
//                     maxQueriesPerDay: max_queries_per_day,
//                     enabled: enabled,
//                     analyticsWindowInMonths: analytics_window_size_in_months,
//                     operatorEnabled: operator_enabled,
//                     capacityWarnings: capacity_warnings,
//                     created: created,
//                     dmsIndexSchedule: dms_index_schedule,
//                     enableDocumentSimilarity: enable_document_similarity,
//                     documentSimilarityThreshold: document_similarity_threshold
//                 };
//
//                 console.log("data",data)
//                 dispatch(addOrUpdate({session_id, data}))
//                 clearFormData();
//                 dispatch(closeForm());
//                 //     // dispatch(getOrganisationList({session:session,filter:null}))
//                 //     // setName('')
//             } else {
//                 console.log("organisation_id is undefined")
//             }
//         }else{
//             console.log("Error")
//         }
//
//     }
//
//
//     if (!show_kb_form)
//         return (<div />);
//     return(
//
//       <div>
//           <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline"}}>
//               <div className={"modal-dialog modal-dialog-centered modal-lg"} role="document">
//                   <div className="modal-content shadow p-3 mb-5 bg-white rounded">
//
//                       <div className="modal-header">
//                           <h5 className="modal-title" id="staticBackdropLabel">{title}  {kb_id}</h5>
//                           <button onClick={ handleClose } type="button" className="btn-close" data-bs-dismiss="modal"
//                                   aria-label="Close"></button>
//                       </div>
//                       <div className="modal-body">
//                               <div>
//                                   <div className="control-row">
//                                       <span className="label-2">name</span>
//                                       <span className="text">
//                                                         <input type="text"
//                                                                autoFocus={true}
//                                                                className="edit-box"
//                                                                placeholder="knowledge base name"
//                                                                value={name}
//                                                                onChange={(event) => setName(event.target.value)}
//                                                         />
//                                                     </span>
//                                   </div>
//
//                                   <div className="control-row">
//                                       <span className="label-2">email questions to</span>
//                                       <span className="text">
//                                                         <input type="text"
//                                                                className="edit-box"
//                                                                placeholder="email questions to"
//                                                                value={email}
//                                                                onChange={(event) => setEmail(event.target.value)}
//                                                         />
//                                                     </span>
//                                   </div>
//
//                                   <div className="control-row">
//                                       <span className="label-2">security id</span>
//                                       <span className="text">
//                                                     <input type="text"
//                                                            className="sid-box"
//                                                            disabled={true}
//                                                            placeholder="security id"
//                                                            value={security_id}
//                                                            onChange={(event) => setSecurityId(event.target.value)}
//                                                     />
//                                                     </span>
//                                       <img title="generate new security id" alt="refresh"
//                                            src={theme === 'light' ? "../images/refresh.svg" : "../images/refresh-dark.svg"}
//                                            onClick={() => refreshSecurityId()}
//                                            className="image-size form-icon" />
//                                   </div>
//
//                                   <div className="control-row">
//                                                     <span className="checkbox-only">
//                                                         <input type="checkbox"
//                                                                checked={enabled}
//                                                                onChange={(event) => {setEnabled(event.target.checked)}}
//                                                                value="enable this knowledge-base?"
//                                                         />
//                                                     </span>
//                                       <span>knowledge-base enabled?</span>
//                                   </div>
//
//
//                                   <div className="control-row">
//                                                     <span className="checkbox-only">
//                                                         <input type="checkbox"
//                                                                checked={operator_enabled}
//                                                                onChange={(event) => {
//                                                                    setOperatorEnabled(event.target.checked);
//                                                                }}
//                                                                value="enable operator access?"
//                                                         />
//                                                     </span>
//                                       <span>operator enabled?</span>
//                                   </div>
//
//
//                                   <div className="control-row">
//                                                     <span className="checkbox-only">
//                                                         <input type="checkbox"
//                                                                checked={capacity_warnings}
//                                                                onChange={(event) => {
//                                                                    setCapacityWarnings(event.target.checked);
//                                                                }}
//                                                                value="enable capacity warnings?"
//                                                         />
//                                                     </span>
//                                       <span>capacity-warnings on?</span>
//                                   </div>
//
//
//                                   <div className="control-row">
//                                                     <span className="checkbox-only">
//                                                         <input type="checkbox"
//                                                                checked={enable_document_similarity}
//                                                                onChange={(event) => {
//                                                                    setEnableDocumentSimilarity(event.target.checked);
//                                                                }}
//                                                                value="enable document similarity?"
//                                                         />
//                                                     </span>
//                                       <span>enable document similarity?</span>
//                                   </div>
//
//
//                                   <div className="control-row">
//                                       <span className="label-wide">maximum number of queries per day (0 is no limits)</span>
//                                       <span className="text">
//                                                         <input type="text"
//                                                                onChange={(event) => setMaxQueriesPerDay(event.target.value)}
//                                                                placeholder="max transactions per month"
//                                                                value={max_queries_per_day}
//                                                         />
//                                                     </span>
//                                   </div>
//
//
//                                   <div className="control-row">
//                                       <span className="label-wide">maximum analytics retention period in months (0 is no limits)</span>
//                                       <span className="text">
//                                                         <input type="text"
//                                                                onChange={(event) => setAnalyticsWindowInMonths(event.target.value)}
//                                                                placeholder="max analytics retention period in months"
//                                                                value={analytics_window_size_in_months}
//                                                         />
//                                                     </span>
//                                   </div>
//
//
//                                   {/*<div className="control-row">*/}
//                                   {/*    <span className="label-wide">document similarity (a number between 0.75 and 1.0)</span>*/}
//                                   {/*    <span className="text">*/}
//                                   {/*        <input type="text"*/}
//                                   {/*               onChange={(event) => this.setState({edit_document_similarity_threshold: event.target.value})}*/}
//                                   {/*               placeholder="document similarity threshold"*/}
//                                   {/*               value={document_similarity_threshold}*/}
//                                   {/*        />*/}
//                                   {/*    </span>*/}
//                                   {/*</div>*/}
//
//
//                               </div>
//
//                           </div>
//                       <div className="modal-footer">
//                           <button onClick={ handleClose } type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
//                           <button onClick={ handleSave } type="button" className="btn btn-primary">Save</button>
//                       </div>
//                   </div>
//               </div>
//           </div>
//       </div>
//     );
// }
