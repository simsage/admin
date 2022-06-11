
export function getFullname(user){
    return user.firstName + ' ' + user.surname
}


export function loadState() {
    try {
        let serializedState = localStorage.getItem("https://simsage.ai/state");
        if (serializedState === null || window.location.href.endsWith("/#/")) {
            // return {"appReducer": initializeState()};
            //TODO::Add initialize state here
            return {"appReducer": {}};
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return {"appReducer": {}};
    }
}


export function saveState(state) {
    try {
        let serializedState = JSON.stringify(state);
        localStorage.setItem("https://simsage.ai/state", serializedState);
    } catch (err) {
    }
}


export function clearState() {
    try {
        saveState(initializeState());
    } catch (err) {
    }
}


