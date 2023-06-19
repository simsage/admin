import {useState} from "react";
import {store} from "../../app/store";
import {showAddForm} from "./knowledgeBaseSlice";
import {useDispatch} from "react-redux";

export default function KnowledgeBaseIntro(){

    const dispatch = useDispatch();

    function handleAddNewKnowledgeBase(){
        dispatch(showAddForm(true))
    }

    return(
        <div className="col-6">
        <div className={"sb-item"}>

            <h1 >Welcome, let’s get started</h1>
            <p>Something about Knowledge Base. Lorem ipsum dolor sit amet,
                consectetur adipiscing elit. Malesuada convallis sit eget
                massa adipiscing. Pellentesque eu tristique neque elementum
                risus dolor eu sodales sem. Nec, a sed rhoncus sem nunc.
                Imperdiet lacus sem rutrum at id faucibus pellentesque.</p>
            <button onClick={() => {handleAddNewKnowledgeBase()} } type="button" className="btn btn-primary" >
                + Add
            </button>
            <br />
            <br />
            <br />
            <br />
            <br />

        </div>
    </div>);
}