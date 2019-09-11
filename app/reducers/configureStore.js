import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import thunk from "redux-thunk";
import { createLogger } from "redux-logger";
import { routerMiddleware, routerReducer } from "react-router-redux";
import * as AppReducer from "./appReducer";

import {loadState} from "./stateLoader";

const loggerMiddleware = createLogger();

export default function configureStore(history) {
    const reducers = {
        appReducer:  AppReducer.reducer,
    };

    const middleware = [thunk, loggerMiddleware, routerMiddleware(history)];

    // In development, use the browser's Redux dev tools extension if installed
    const enhancers = [];
    const isDevelopment = process.env.NODE_ENV === "development";
    if (isDevelopment && typeof window !== "undefined" && window.devToolsExtension) {
        enhancers.push(window.devToolsExtension());
    }

    const rootReducer = combineReducers({
        ...reducers,
        routing: routerReducer
    });

    return createStore(
        rootReducer,
        loadState(),
        compose(
            applyMiddleware(...middleware),
            ...enhancers
        )
    );
}

