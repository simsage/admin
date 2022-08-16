import reducer, {getSources, updateSources, showAddForm, showEditForm, closeForm} from '../sourceSlice'

const previousState = {"edit_id": null, "error": "", "selected_source": {}, "show_form": false, "source_filter": null,
    "source_list": {}, "source_page": 0, "source_page_size": 10, "status": ""}

test('should return the initial state of source', () => {
    expect(reducer(undefined, { type: undefined })).toEqual(previousState)
})

test('should return showAddForm', () => {
    expect(reducer(previousState, showAddForm())).toEqual(
        {"edit_id": null, "error": "", "selected_source": {}, "show_form": true, "source_filter": null,
            "source_list": {}, "source_page": 0, "source_page_size": 10, "status": ""}
    )
})

test('test showEditForm', () => {
    expect(reducer(previousState, showEditForm({"source_id":"2343","source":{"selected_source":"true"}}))).toEqual(
        {"edit_id": "2343", "error": "", "selected_source": {"selected_source": "true"}, "show_form": true, "source_filter": null, "source_list": {}, "source_page": 0, "source_page_size": 10, "status": ""}
    )
})

test('test closeForm', () => {
    expect(reducer(previousState, closeForm())).toEqual(previousState )
})



/*



test('should handle a todo being added to an existing list', () => {
    const previousState = [{ text: 'Run the tests', completed: true, id: 0 }]

    expect(reducer(previousState, todoAdded('Use Redux'))).toEqual([
        { text: 'Run the tests', completed: true, id: 0 },
        { text: 'Use Redux', completed: false, id: 1 }
    ])
})*/
