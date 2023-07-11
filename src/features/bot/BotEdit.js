import {useDispatch, useSelector} from "react-redux";
import React, {useState, useEffect} from "react";
import {closeMemoryForm, updateMindItem} from "./botSlice";

export function BotEdit(){

    const dispatch = useDispatch();

    const session = useSelector((state) => state.authReducer.session);
    const organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)
    const knowledge_base_id = useSelector((state) => state.authReducer.selected_knowledge_base_id)

    const selected_memories = useSelector((state) => state.botReducer.mind_item_list)
    const show_memory_form = useSelector((state) => state.botReducer.show_memory_form);
    const memory = useSelector( (state) => state.botReducer.edit);

    //Memory details
    const [questions, setQuestions] = useState(['']);
    const [newQuestion, setNewQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [links, setLinks] = useState([]);
    const [newLink, setNewLink] = useState('');
    const [created, setCreated] = useState('0');
    const [id, setID] = useState(' ');
    const [imageList, setImageList] = useState([]);
    const [mId, setMId] = useState('');
    const [soundList, setSoundList] = useState([]);
    const [videoList, setVideoList] = useState([]);
    // const [error, setError] = useState();
    const [errorQ, setErrorQ] = useState();
    const [errorA, setErrorA] = useState();

    // console.log("error",error)

    // Grab memory details if editing
    let selectedMemory = {}
    useEffect(()=> {
        if (memory && selected_memories) {
            let temp_obj = selected_memories.filter((o) => {
                return o.id === memory.id
            })
            if (temp_obj.length > 0) {
                // eslint-disable-next-line react-hooks/exhaustive-deps
                selectedMemory = (temp_obj[0])
            }
        }
        //Populate form if necessary
        if(selectedMemory){
            setQuestions(selectedMemory.questionList)
            setAnswer(selectedMemory.information)
            setLinks(selectedMemory.urlList)
            setCreated(selectedMemory.created)
            setID(selectedMemory.id)
            setImageList(selectedMemory.imageList)
            setMId(selectedMemory.mid)
            setSoundList(selectedMemory.soundList)
            setVideoList(selectedMemory.videoList)
        }
    }, [show_memory_form, memory, selected_memories])

    function resetData () {
        setQuestions(['']);
        setAnswer('')
        setLinks([])
        setCreated(0)
        setID('')
        setImageList([])
        setMId('')
        setSoundList([])
        setVideoList([])
    }

    function handleClose(){
        dispatch(closeMemoryForm())
        resetData()
    }



    const handleSave = () => {

        let final_questions = (questions)?[...questions,newQuestion]:(newQuestion)?[newQuestion]:[];
        let final_links = (links)?[...links,newLink]:[newLink];
        console.log("final_questions",final_questions)
        if (!final_questions || final_questions.length === 0) {
            console.log("answer",answer)
            // setError("empty Question(s) not allowed");
            setErrorQ("empty Question(s) not allowed");
        } else if (!answer || answer.length === 0) {
            // setError("empty Answer not allowed");
            setErrorA("empty Answer not allowed");
        } else {
            console.log("updating",final_questions)
            //begin updating user
            const session_id = session.id;
            const data = {
                created: created,
                id : id ? id : 0 ,
                imageList: imageList ? imageList : [],
                information: answer ? answer : '',
                mid: mId ? mId : knowledge_base_id,
                organisationId: organisation_id,
                questionList : final_questions ? final_questions : [],
                soundList: soundList ? soundList : [],
                urlList: final_links ? final_links : [],
                videoList:videoList
            }
            dispatch(updateMindItem({session_id,organisation_id, knowledge_base_id, data}));
            dispatch(closeMemoryForm());
        }


    }

    const updateLink = index => e => {
        let newArr = [...links];
        newArr[index] = e.target.value;
        setLinks(newArr);
    }

    const updateQuestion = index => e => {
        let newArr = [...questions];
        newArr[index] = e.target.value;
        setQuestions(newArr);
    }

    const addNewLink = e => {
        if(e.key === 'Enter' && newLink.trim()) {
            e.preventDefault()
            let newArr = [...(links || [])];
            newArr.push(newLink)
            setLinks(newArr);
            setNewLink('')
        }
    }

    const addNewQuestion = e => {
        if(e.key === 'Enter') {
            e.preventDefault()
            let newArr = [...(questions || [])];
            newArr.push(newQuestion)
            setQuestions(newArr);
            setNewQuestion('')
        }
    }

    const addNewQuestionBtn = () => {
        let newArr = [...(questions || [])];
        // setNewQuestion(e.target.value)
        newArr.push(newQuestion)
        setQuestions(newArr);
        setNewQuestion('')
    }

    const removeQuestionBtn = (q, index) => {
        let newArr = [...questions];
        newArr.splice(index,1)
        setQuestions(newArr);

    }

    const removeLinkBtn = (l, index) => {
        let newArr = [...links];
        newArr.splice(index,1)
        setLinks(newArr);
    }

    const addNewLinkBtn = () => {

        if(newLink.trim()){
            let newArr = [...(links || [])];
            // setNewQuestion(e.target.value)
            newArr.push(newLink)
            setLinks(newArr);
            setNewLink('')
        }

    }


    if (show_memory_form === false)
        return (<div/>);

    return (
        <div className="modal user-display" tabIndex="-1" role="dialog" style={{display: "inline", background: "#202731bb"}}>

            {/*{ error &&*/}
            {/*    <ErrorMessage error_title="Error" error_text={error} handleClose={() => setError('')} />*/}
            {/*}*/}

            <div className={"modal-dialog modal-dialog-centered modal-lg"} role="document">
                <div className="modal-content">
                    <div className="modal-header px-5 pt-4 bg-light">
                        <h4 className="mb-0">{memory ? "Edit Memory" : "New Memory"}</h4>
                    </div>
                    <div className="modal-body p-0">
                        <div className="tab-content px-5 py-4 overflow-auto" style={{maxHeight: "600px"}}>
                            <div className="row">

                                <div className="d-flex justify-content-between small">
                                    <label className="label-2">Question</label>
                                    <span className="small text-black-50 fst-italic fw-light ms-2">(Type &amp; press enter to add another)</span>
                                </div>
                                {
                                    questions && questions.map( (question,i) => {
                                        return (
                                            <div className="control-row col-12 mb-2" key={i}>

                                                <span className="text">
                                                    <form>
                                                        <div className="form-control d-flex p-0 overflow-hidden">
                                                            <input type="text" className="border-0 w-100 me-2" style={{padding: "0.375rem 0.75rem"}}
                                                                autoComplete="false"
                                                                placeholder="Question..."
                                                                value={questions[i]}
                                                                onChange={updateQuestion(i)}
                                                            />
                                                            <button className="btn pointer-cursor mb-0 px-3 py-0" onClick={() => removeQuestionBtn(question, i)}>&times;</button>
                                                        </div>
                                                    </form>
                                                </span>
                                                
                                            </div>
                                        )
                                    })
                                }
                                <div className="control-row col-12 mb-3">
                                    <span className="text d-flex">
                                            <form className="w-100 me-2">
                                                <input type="text"
                                                    className="form-control"
                                                    autoComplete="false"
                                                    placeholder="Question..."
                                                    value={newQuestion}
                                                    onChange={(e) => {setNewQuestion(e.target.value); setErrorQ()}}
                                                    onKeyDown={(e) => addNewQuestion(e)}
                                                />
                                            </form>
                                            <button className="btn-secondary btn pointer-cursor px-3" onClick={(e) => addNewQuestionBtn(e, newQuestion)}>+</button>
                                        </span>
                                    {errorQ && <span className="text-danger fst-italic small">{errorQ} </span>}
                                </div>
                                <div className="control-row col-12 mb-4">
                                    <label className="label-2 small">Answer</label>
                                    <span className="text">
                                                <form>
                                                    <textarea className="form-control"
                                                        autoComplete="false"
                                                        placeholder="Answer..."
                                                        value={answer}
                                                        onChange={(e) => {setAnswer(e.target.value); setErrorA();} }
                                                    />
                                                </form>
                                            </span>
                                    {errorA && <span className="text-danger fst-italic small">{errorA} </span>}
                                </div>
                                <div className="d-flex justify-content-between small">
                                    <label className="label-2">Link</label>
                                    <span className="small text-black-50 fst-italic fw-light ms-2">(Type &amp; press enter to add another)</span>
                                </div>
                                {
                                    links && links.map( (link,i) => {
                                        if (link === '') {return '</div>';}
                                        return (
                                            <div className="control-row col-12 mb-2" key={i}>

                                                <span className="text">
                                                    <form>
                                                        <div className="form-control d-flex p-0 me-2 overflow-hidden">
                                                            <input type="text" className="border-0 w-100" style={{padding: "0.375rem 0.75rem"}}
                                                                autoComplete="false"
                                                                placeholder="URL..."
                                                                value={links[i]}
                                                                onChange={updateLink(i)}
                                                            />
                                                            <button className="btn pointer-cursor mb-0 px-3 py-0" onClick={() => removeLinkBtn(link, i)}>&times;</button>
                                                        </div>
                                                    </form>
                                                </span>
                                            </div>
                                        )
                                    })
                                }
                                <div className="control-row col-12 mb-4">
                                    <span className="text d-flex">
                                        <form className="w-100 me-2">
                                            <input type="text"
                                                className="form-control"
                                                autoComplete="false"
                                                placeholder="URL..."
                                                value={newLink}
                                                onChange={(e) => {setNewLink(e.target.value)}}
                                                onKeyDown={(e) => addNewLink(e)}
                                            />
                                        </form>

                                        <button className="btn-secondary btn pointer-cursor px-3" onClick={(e) => addNewLinkBtn(e, newQuestion)}>+</button>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer px-5 pb-3">
                        <button className="btn btn-white px-4" onClick={(e) => handleClose(e)}>Cancel</button>
                        <button className="btn btn-primary px-4" onClick={(e) => handleSave(e)}>Save</button>
                    </div>

                </div>
            </div>
        </div>

    )
}
