import {showAddForm, showEditForm, closeForm} from '../sourceSlice'
import sourceReducer from "../sourceSlice";

const previousState = {
    source_list: [],
    source_filter: null,
    source_page: 0,
    source_page_size: 10,

    status: null,
    error: '',

    // data form
    show_form: false,
    edit_id: null,
    selected_source: {},

    //start_crawler warning
    show_start_crawler_form: false
}

test('should return the initial state of source', () => {
    expect(sourceReducer(undefined, { type: undefined })).toEqual(previousState)
})

test('should return showAddForm', () => {
    expect(sourceReducer(previousState, showAddForm())).toEqual(
        {"edit_id": null, "error": "", "selected_source": {}, "show_form": true, "source_filter": null,
            "source_list": {}, "source_page": 0, "source_page_size": 10, "status": ""}
    )
})

test('test showEditForm', () => {
    expect(sourceReducer(previousState, showEditForm({"source_id":"2343","source":{"selected_source":"true"}}))).toEqual(
        {"edit_id": "2343", "error": "", "selected_source": {"selected_source": "true"}, "show_form": true, "source_filter": null, "source_list": {}, "source_page": 0, "source_page_size": 10, "status": ""}
    )
})

test('test closeForm', () => {
    expect(sourceReducer(previousState, closeForm())).toEqual(previousState )
})



/*



test('should handle a todo being added to an existing list', () => {
    const previousState = [{ text: 'Run the tests', completed: true, id: 0 }]

    expect(reducer(previousState, todoAdded('Use Redux'))).toEqual([
        { text: 'Run the tests', completed: true, id: 0 },
        { text: 'Use Redux', completed: false, id: 1 }
    ])
})*/
