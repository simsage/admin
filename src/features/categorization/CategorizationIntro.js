import {useDispatch} from "react-redux";
import {showAddCategoryForm} from "./categorizationSlice";
import {CategorizationEdit} from "./CategorizationEdit";


export default function CategorizationIntro(){

    const dispatch = useDispatch();

    function handleAddNewCategory(){
        dispatch(showAddCategoryForm(true));
    }

    return(
        <div className="col-6">
            <div className={"sb-item"}>

                <h1 >Welcome, let’s get started</h1>
                <p>Something about the Categorization. Lorem ipsum dolor sit amet,
                    consectetur adipiscing elit. Malesuada convallis sit eget
                    massa adipiscing. Pellentesque eu tristique neque elementum
                    risus dolor eu sodales sem. Nec, a sed rhoncus sem nunc.
                    Imperdiet lacus sem rutrum at id faucibus pellentesque.</p>
                <button onClick={ () => handleAddNewCategory()} type="button" className="btn btn-primary" >
                    + Add
                </button>
                <br />
                <br />
                <br />
                <br />
                <br />

            </div>
            <CategorizationEdit/>
        </div>
    );
}