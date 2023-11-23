import {useDispatch} from "react-redux";
import {SemanticEdit} from "./SemanticEdit";
import {showAddSemanticForm} from "./semanticSlice";



export default function SemanticsIntro(){

    const dispatch = useDispatch();

    function handleAddNewMemory(){
        dispatch(showAddSemanticForm(true))
    }

    return(
        <div className="col-6">
            <div className={"sb-item"}>

                <h1 >Welcome, let’s get started</h1>
                <p>Something about Semantics. Lorem ipsum dolor sit amet,
                    consectetur adipiscing elit. Malesuada convallis sit eget
                    massa adipiscing. Pellentesque eu tristique neque elementum
                    risus dolor eu sodales sem. Nec, a sed rhoncus sem nunc.
                    Imperdiet lacus sem rutrum at id faucibus pellentesque.</p>
                <button  type="button" className="btn btn-primary" onClick={() => handleAddNewMemory()}>
                    + Add
                </button>
                <br />
                <br />
                <br />
                <br />
                <br />

            </div>
            <SemanticEdit/>
        </div>
    );
}