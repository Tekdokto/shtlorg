import { createStore,applyMiddleware,compose } from 'redux';
import reducers from './reducer';
import sagas from './sagas';
import createSagaMiddleware from "redux-saga";

const sagaMiddleware = createSagaMiddleware();

const middlware = [sagaMiddleware];

export function configureStore(initialState){

    const store = createStore(
        reducers,
        initialState,
        compose(applyMiddleware(...middlware))
    );
    sagaMiddleware.run(sagas);
    return store;
}