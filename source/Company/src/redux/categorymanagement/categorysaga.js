import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import axios from 'axios';
import {
    LIST_CATEGORY,
    ADD_CATEGORY,
    EDIT_CATEGORY,
    DELETE_CATEGORY,
    GET_MASTER_CATEGORY
} from '../actionconstant'
import { 
    listCategoryFail,
    listCategorySuccess,
    addCategoryFail,
    addCategorySuccess,
    editCategoryFail,
    editCategorySuccess,
    deleteCategoryFail,
    deleteCategorySuccess,
    resetCategoryNotifcation,
    listallCategoryFail,
    listallCategorySuccess
 } from '../categorymanagement/categoryactions';
import { logoutUser } from '../action'
import { API_URL } from '../../constants/defaultValues';

function* addCategory({payload}){    
    const { history } = payload;
    // console.log("payload data",payload)
    let User = (localStorage.getItem('user'))?JSON.parse(localStorage.getItem('user')):null;
    let token = (User)?((User.token)?User.token:''):'';
    let headers = { headers: { token: `${token}` } }
    try{
        const response = yield axios.post(`${API_URL}/category/addcategory`, payload.category ,headers)
        // console.log("Response",response.data);
        if(response.data.status !== -2){
            if (response.data.status === false) {                        
                yield put(addCategoryFail(response.data))
                yield call(delay,2000);
                yield put(resetCategoryNotifcation());
            } else {
                yield put(addCategorySuccess(response.data));
                yield call(delay,2000);
                yield put(resetCategoryNotifcation());
            }
        }else{
            yield put(addCategoryFail(response.data))
            yield call(delay,2000);
            yield put(resetCategoryNotifcation());
            yield put(logoutUser(history))
            history.push('/');
        }
    }catch(error){
        console.log('error',error);        
    }
}

function* editCategory({payload}){    
    const { history } = payload;
    // console.log("payload data",payload)
    let User = (localStorage.getItem('user'))?JSON.parse(localStorage.getItem('user')):null;
    let token = (User)?((User.token)?User.token:''):'';
    let headers = { headers: { token: `${token}` } }
    try{
        const response = yield axios.post(`${API_URL}/category/updatecategory`, payload.category,headers)
        // console.log("Response",response.data);
        if(response.data.status !== -2){
            if (response.data.status === false) {                        
                yield put(editCategoryFail(response.data))
                yield call(delay,2000);
                yield put(resetCategoryNotifcation());
            } else {
                yield put(editCategorySuccess(response.data));
                yield call(delay,2000);
                yield put(resetCategoryNotifcation());
            }
        }else{
            yield put(editCategoryFail(response.data))
            yield call(delay,2000);
            yield put(resetCategoryNotifcation());
            yield put(logoutUser(history))
            history.push('/');
        }
    }catch(error){
        console.log('error',error);        
    }
}

function* deleteCategory({payload}){    
    const { history } = payload;
    // console.log("payload data",payload)
    let User = (localStorage.getItem('user'))?JSON.parse(localStorage.getItem('user')):null;
    let token = (User)?((User.token)?User.token:''):'';
    let headers = { headers: { token: `${token}` } }
    try{
        const response = yield axios.post(`${API_URL}/category/changestatus`, payload.category,headers)
        // console.log("Response",response.data);
        if(response.data.status !== -2){
            if (response.data.status === false) {                        
                yield put(deleteCategoryFail(response.data))
                yield call(delay,2000);
                yield put(resetCategoryNotifcation());
            } else {
                yield put(deleteCategorySuccess(response.data));
                yield call(delay,2000);
                yield put(resetCategoryNotifcation());
            }
        }else{
            yield put(deleteCategoryFail(response.data))
            yield call(delay,2000);
            yield put(resetCategoryNotifcation());
            yield put(logoutUser(history))
            history.push('/');
        }
    }catch(error){
        console.log('error',error);        
    }
}

function* listCategory({payload}){    
    const { history } = payload;
    // console.log("payload data",payload)
    let User = (localStorage.getItem('user'))?JSON.parse(localStorage.getItem('user')):null;
    let token = (User)?((User.token)?User.token:''):'';
    let headers = { headers: { token: `${token}` } }
    try{
        const response = yield axios.post(`${API_URL}/category/getcategory`, payload.data,headers)
        // console.log("Response",response.data);
        if(response.data.status !== -2){
            if (response.data.status === false) {                        
                yield put(listCategoryFail(response.data))
                yield call(delay,2000);
                // yield put(resetCategoryNotifcation());
            } else {
                yield put(listCategorySuccess(response.data));
                yield call(delay,2000);
                // yield put(resetCategoryNotifcation());
            }
        }else{
            yield put(listCategoryFail(response.data))
            yield call(delay,2000);
            // yield put(resetCategoryNotifcation());
            yield put(logoutUser(history))
            history.push('/');
        }
    }catch(error){
        console.log('error',error);        
    }
}

function* getAllCategories({payload}){
    try{
        const response = yield axios.post(`${API_URL}/category/getallcategory`)
        // console.log("Response",response.data);
        if(response.data.status !== -2){
            if (response.data.status === false) {                        
                yield put(listallCategoryFail(response.data))
            } else {
                yield put(listallCategorySuccess(response.data));
            }
        }else{
            yield put(listallCategoryFail(response.data))
        }
    }catch(error){
        console.log('error',error);        
    }
}

export function* watchAddCategory(){
    yield takeEvery(ADD_CATEGORY, addCategory);
}

export function* watchEditCategory(){
    yield takeEvery(EDIT_CATEGORY, editCategory);
}

export function* watchDeleteCategory(){
    yield takeEvery(DELETE_CATEGORY, deleteCategory);
}

export function* watchListCategory(){
    yield takeEvery(LIST_CATEGORY, listCategory);
}

export function* watchgetAllCategory(){
    yield takeEvery(GET_MASTER_CATEGORY,getAllCategories)
}

const delay = time => new Promise(resolve => setTimeout(resolve, time));

export default function* rootSaga() {
    yield all([
        fork(watchListCategory),
        fork(watchAddCategory),
        fork(watchEditCategory),
        fork(watchDeleteCategory),
        fork(watchgetAllCategory)
    ]);
}
