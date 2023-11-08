import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import axios from 'axios';
import {
    FETCH_SUBCATEGORY_MANAGEMENT,
    ADD_SUBCATEGORY,
    UPDATE_SUBCATEGORY,
    CHANGE_SUBCATEGORY_STATUS
} from '../actionconstant';

import {
    listSubCategoryFail,
    listSubCategorySuccess,
    addSubCategoryFail,
    addSubCategorySuccess,
    editSubCategoryFail,
    editSubCategorySuccess,
    changeSubCategoryStatusFail,
    changeSubCategoryStatusSuccess,
    resetSubCategoryNotification
} from '../subcategorymanagement/subcategoryactions';
import { logoutUser } from '../action';
import { API_URL } from '../../constants/defaultValues';
import { toast } from "react-toastify";

function* addSubCategory({payload}){    
    const { history } = payload;
    console.log("payload data",payload)
    let User = (localStorage.getItem('user'))?JSON.parse(localStorage.getItem('user')):null;
    let token = (User)?((User.token)?User.token:''):'';
    let headers = { headers: { token: `${token}` } }
    try{
        const response = yield axios.post(`${API_URL}/category/addsubcategory`, payload.subcategory,headers)
        console.log("Response",response.data);
        if(response.data.status !== -2){
            if (response.data.status == false) {                        
                yield put(addSubCategoryFail(response.data))
                toast.error(response.data.message)
                yield call(delay,2000);
                yield put(resetSubCategoryNotification());
            } else {
                yield put(addSubCategorySuccess(response.data));
                toast.success(response.data.message)
                yield call(delay,2000);
                yield put(resetSubCategoryNotification());
            }
        }else{
            yield put(addSubCategoryFail(response.data))
            yield call(delay,2000);
            yield put(resetSubCategoryNotification());
            yield put(logoutUser(history))
            history.push('/');
        }
    }catch(error){
        console.log('error',error);        
    }
}

function* editSubCategory({payload}){    
    const { history } = payload;
    console.log("payload data",payload)
    let User = (localStorage.getItem('user'))?JSON.parse(localStorage.getItem('user')):null;
    let token = (User)?((User.token)?User.token:''):'';
    let headers = { headers: { token: `${token}` } }
    try{
        const response = yield axios.post(`${API_URL}/category/updatesubcategory`, payload.subcategory,headers)
        console.log("Response",response.data);
        if(response.data.status !== -2){
            if (response.data.status == false) {                        
                yield put(editSubCategoryFail(response.data))
                toast.error(response.data.message)
                yield call(delay,2000);
                yield put(resetSubCategoryNotification());
            } else {
                yield put(editSubCategorySuccess(response.data));
                toast.success(response.data.message)
                yield call(delay,2000);
                yield put(resetSubCategoryNotification());
            }
        }else{
            yield put(editSubCategoryFail(response.data))
            yield call(delay,2000);
            yield put(resetSubCategoryNotification());
            yield put(logoutUser(history))
            history.push('/');
        }
    }catch(error){
        console.log('error',error);        
    }
}

function* changeSubCategoryStatus({payload}){    
    const { history } = payload;
    console.log("payload data",payload)
    let User = (localStorage.getItem('user'))?JSON.parse(localStorage.getItem('user')):null;
    let token = (User)?((User.token)?User.token:''):'';
    let headers = { headers: { token: `${token}` } }
    try{
        const response = yield axios.post(`${API_URL}/category/changestatussubcategory`, payload.data,headers)
        console.log("Response",response.data);
        if(response.data.status !== -2){
            if (response.data.status == false) {                        
                yield put(changeSubCategoryStatusFail(response.data))
                toast.error(response.data.message)
                yield call(delay,2000);
                yield put(resetSubCategoryNotification());
            } else {
                yield put(changeSubCategoryStatusSuccess(response.data));
                toast.success(response.data.message)
                yield call(delay,2000);
                yield put(resetSubCategoryNotification());
            }
        }else{
            yield put(changeSubCategoryStatusFail(response.data))
            yield call(delay,2000);
            yield put(resetSubCategoryNotification());
            yield put(logoutUser(history))
            history.push('/');
        }
    }catch(error){
        console.log('error',error);        
    }
}

function* listSubCategory({payload}){    
    const { history } = payload;
    console.log("payload data",payload)
    console.log("localStorage.getItem('token')",localStorage.getItem('token'))
    let User = (localStorage.getItem('user'))?JSON.parse(localStorage.getItem('user')):null;
    let token = (User)?((User.token)?User.token:''):'';
    let headers = { headers: { token: `${token}` } }
    try{
        const response = yield axios.post(`${API_URL}/category/getsubcategory`, payload.data,headers)
        console.log("Response",response.data);
        if(response.data.status !== -2){
            if (response.data.status == false) {                        
                yield put(listSubCategoryFail(response.data))
                yield call(delay,2000);
                // yield put(resetSubCategoryNotification());
            } else {
                yield put(listSubCategorySuccess(response.data));
                yield call(delay,2000);
                // yield put(resetSubCategoryNotification());
            }
        }else{
            yield put(listSubCategoryFail(response.data))
            yield call(delay,2000);
            // yield put(resetSubCategoryNotification());
            yield put(logoutUser(history))
            history.push('/');
        }
    }catch(error){
        console.log('error',error);        
    }
}

export function* watchAddSubCategory(){
    yield takeEvery(ADD_SUBCATEGORY, addSubCategory);
}

export function* watchEditSubCategory(){
    yield takeEvery(UPDATE_SUBCATEGORY, editSubCategory);
}

export function* watchStatusChangeSubCategory(){
    yield takeEvery(CHANGE_SUBCATEGORY_STATUS, changeSubCategoryStatus);
}

export function* watchListSubCategory(){
    yield takeEvery(FETCH_SUBCATEGORY_MANAGEMENT, listSubCategory);
}

const delay = time => new Promise(resolve => setTimeout(resolve, time));

export default function* rootSaga() {
    yield all([
        fork(watchListSubCategory),
        fork(watchAddSubCategory),
        fork(watchEditSubCategory),
        fork(watchStatusChangeSubCategory)
    ]);
}
