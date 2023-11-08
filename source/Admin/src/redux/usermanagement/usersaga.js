import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import axios from 'axios';
import {
    LIST_USER,
    RLIST_USER,
    ADD_USER,
    EDIT_USER,
    DELETE_USER,
    SPECIAL_USER,
    LIST_CUSER,
    ADD_CUSER,
    EDIT_CUSER,
    DELETE_CUSER,
    SET_EDIT_USER,
    SET_EDIT_CUSER
} from '../actionconstant'
import { 
    listUserFail,
    listUserSuccess,
    rlistUserFail,
    rlistUserSuccess,
    addUserFail,
    addUserSuccess,
    editUserFail,
    editUserSuccess,
    deleteUserFail,
    deleteUserSuccess,
    specialUserFail,
    specialUserSuccess,
    listcUserFail,
    listcUserSuccess,
    addcUserFail,
    addcUserSuccess,
    editcUserFail,
    editcUserSuccess,
    deletecUserFail,
    deletecUserSuccess,
    resetUserNotifcation
 } from '../usermanagement/useractions';
 import { logoutUser } from '../action'
 import { toast } from "react-toastify";
import { API_URL } from '../../constants/defaultValues';

function* addUser({payload}){    
    const { history } = payload;
    console.log("payload data",payload)
    let User = (localStorage.getItem('user'))?JSON.parse(localStorage.getItem('user')):null;
    let token = (User)?((User.token)?User.token:''):'';
    let headers = { headers: { token: `${token}` } }
    try{
        const response = yield axios.post(`${API_URL}/user/adduser`, payload.user,headers)
        console.log("Response",response.data);
        if(response.data.status !== -2){
            if (response.data.status === false) {                        
                yield put(addUserFail(response.data))
                toast.error(response.data.message)
                yield call(delay,2000);
                yield put(resetUserNotifcation());
            } else {
                yield put(addUserSuccess(response.data));
                toast.success(response.data.message)
                yield call(delay,2000);
                yield put(resetUserNotifcation());
            }
        }else{
            yield put(addUserFail(response.data))
            toast.error(response.data.message)
            yield call(delay,2000);
            toast.error(response.data.message)
            yield put(resetUserNotifcation());
            yield put(logoutUser(history))
            history.push('/');
        }
    }catch(error){
        console.log('error',error);        
    }
}

function* editUser({payload}){    
    const { history } = payload;
    console.log("payload data",payload)
    let User = (localStorage.getItem('user'))?JSON.parse(localStorage.getItem('user')):null;
    let token = (User)?((User.token)?User.token:''):'';
    let headers = { headers: { token: `${token}` } }
    try{
        const response = yield axios.post(`${API_URL}/user/updateuser`, payload.user,headers)
        console.log("Response",response.data);
        if(response.data.status !== -2){
            if (response.data.status === false) {                        
                yield put(editUserFail(response.data))
                toast.error(response.data.message)
                yield call(delay,2000);
                yield put(resetUserNotifcation());
            } else {
                yield put(editUserSuccess(response.data));
                toast.success(response.data.message)
                yield call(delay,2000);
                yield put(resetUserNotifcation());
            }
        }else{
            yield put(editUserFail(response.data))
            toast.error(response.data.message)
            yield call(delay,2000);
            yield put(resetUserNotifcation());
            yield put(logoutUser(history))
            history.push('/');
        }
    }catch(error){
        console.log('error',error);        
    }
}

function* deleteUser({payload}){    
    const { history } = payload;
    console.log("payload data",payload)
    let User = (localStorage.getItem('user'))?JSON.parse(localStorage.getItem('user')):null;
    let token = (User)?((User.token)?User.token:''):'';
    let headers = { headers: { token: `${token}` } }
    try{
        const response = yield axios.post(`${API_URL}/user/changestatus`, payload.user,headers)
        console.log("Response",response.data);
        if(response.data.status !== -2){
            if (response.data.status === false) {                        
                yield put(deleteUserFail(response.data))
                toast.error(response.data.message)
                yield call(delay,2000);
                yield put(resetUserNotifcation());
            } else {
                yield put(deleteUserSuccess(response.data));
                toast.success(response.data.message)
                yield call(delay,2000);
                yield put(resetUserNotifcation());
            }
        }else{
            yield put(deleteUserFail(response.data))
            yield call(delay,2000);
            yield put(resetUserNotifcation());
            yield put(logoutUser(history))
            history.push('/');
        }
    }catch(error){
        console.log('error',error);        
    }
}

function* specialUser({payload}){    
    const { history } = payload;
    console.log("payload data",payload)
    let User = (localStorage.getItem('user'))?JSON.parse(localStorage.getItem('user')):null;
    let token = (User)?((User.token)?User.token:''):'';
    let headers = { headers: { token: `${token}` } }
    try{
        const response = yield axios.post(`${API_URL}/user/changespecialcandidate`, payload.user,headers)
        console.log("Response",response.data);
        if(response.data.status !== -2){
            if (response.data.status === false) {                        
                yield put(specialUserFail(response.data))
                toast.error(response.data.message)
                yield call(delay,2000);
                yield put(resetUserNotifcation());
            } else {
                yield put(specialUserSuccess(response.data));
                toast.success(response.data.message)
                yield call(delay,2000);
                yield put(resetUserNotifcation());
            }
        }else{
            yield put(specialUserFail(response.data))
            yield call(delay,2000);
            yield put(resetUserNotifcation());
            yield put(logoutUser(history))
            history.push('/');
        }
    }catch(error){
        console.log('error',error);        
    }
}

function* listUser({payload}){    
    const { history } = payload;
    console.log("payload data",payload)
    let User = (localStorage.getItem('user'))?JSON.parse(localStorage.getItem('user')):null;
    let token = (User)?((User.token)?User.token:''):'';
    let headers = { headers: { token: `${token}` } }
    try{
        const response = yield axios.post(`${API_URL}/user/getusernew`, payload.data,headers)
        console.log("Response",response.data);
        if(response.data.status !== -2){
            if (response.data.status === false) {                        
                yield put(listUserFail(response.data))
                toast.error(response.data.message)
                yield call(delay,2000);
                // yield put(resetUserNotifcation());
            } else {
                yield put(listUserSuccess(response.data));
                yield call(delay,2000);
                // yield put(resetUserNotifcation());
            }
        }else{
            yield put(listUserFail(response.data))
            yield call(delay,2000);
            // yield put(resetUserNotifcation());
            yield put(logoutUser(history))
            history.push('/');
        }
    }catch(error){
        console.log('error',error);        
    }
}
function* rlistUser({payload}){    
    const { history } = payload;
    console.log("payload data",payload)
    let User = (localStorage.getItem('user'))?JSON.parse(localStorage.getItem('user')):null;
    let token = (User)?((User.token)?User.token:''):'';
    let headers = { headers: { token: `${token}` } }
    try{
        const response = yield axios.post(`${API_URL}/user/getuserreport`, payload.data,headers)
        console.log("Response",response.data);
        if(response.data.status !== -2){
            if (response.data.status === false) {                        
                yield put(rlistUserFail(response.data))
                yield call(delay,2000);
                // yield put(resetUserNotifcation());
            } else {
                yield put(rlistUserSuccess(response.data));
                yield call(delay,2000);
                // yield put(resetUserNotifcation());
            }
        }else{
            yield put(rlistUserFail(response.data))
            yield call(delay,2000);
            // yield put(resetUserNotifcation());
            yield put(logoutUser(history))
            history.push('/');
        }
    }catch(error){
        console.log('error',error);        
    }
}
function* setEditUser({payload}){
    const { history } = payload;
    console.log("TESSE");
    yield localStorage.setItem('edit_user',JSON.stringify(payload.data));
    history.push('/admin/user-management/edit');
}



function* addcUser({payload}){    
    const { history } = payload;
    console.log("payload data",payload)
    let User = (localStorage.getItem('user'))?JSON.parse(localStorage.getItem('user')):null;
    let token = (User)?((User.token)?User.token:''):'';
    let headers = { headers: { token: `${token}` } }
    try{
        const response = yield axios.post(`${API_URL}/user/addcuser`, payload.user,headers)
        console.log("Response",response.data);
        if(response.data.status !== -2){
            if (response.data.status === false) {                        
                yield put(addcUserFail(response.data))
                toast.error(response.data.message)
                yield call(delay,2000);
                yield put(resetUserNotifcation());
            } else {
                yield put(addcUserSuccess(response.data));
                toast.success(response.data.message)
                yield call(delay,2000);
                yield put(resetUserNotifcation());
            }
        }else{
            yield put(addcUserFail(response.data))
            yield call(delay,2000);
            yield put(resetUserNotifcation());
            yield put(logoutUser(history))
            history.push('/');
        }
    }catch(error){
        console.log('error',error);        
    }
}

function* editcUser({payload}){    
    const { history } = payload;
    console.log("payload data",payload)
    let User = (localStorage.getItem('user'))?JSON.parse(localStorage.getItem('user')):null;
    let token = (User)?((User.token)?User.token:''):'';
    let headers = { headers: { token: `${token}` } }
    try{
        const response = yield axios.post(`${API_URL}/user/updatecuser`, payload.user,headers)
        console.log("Response",response.data);
        if(response.data.status !== -2){
            if (response.data.status === false) {                        
                yield put(editcUserFail(response.data))
                toast.error(response.data.message)
                yield call(delay,2000);
                yield put(resetUserNotifcation());
            } else {
                yield put(editcUserSuccess(response.data));
                toast.success(response.data.message)
                history.push('/admin/company-user-management/list')
                yield call(delay,2000);
                yield put(resetUserNotifcation());
            }
        }else{
            yield put(editcUserFail(response.data))
            yield call(delay,2000);
            toast.success(response.data.message)
            yield put(resetUserNotifcation());
            yield put(logoutUser(history))
            history.push('/');
        }
    }catch(error){
        console.log('error',error);        
    }
}

function* deletecUser({payload}){    
    const { history } = payload;
    console.log("payload data",payload)
    let User = (localStorage.getItem('user'))?JSON.parse(localStorage.getItem('user')):null;
    let token = (User)?((User.token)?User.token:''):'';
    let headers = { headers: { token: `${token}` } }
    try{
        const response = yield axios.post(`${API_URL}/user/changecstatus`, payload.user,headers)
        console.log("Response",response.data);
        if(response.data.status !== -2){
            if (response.data.status === false) {                        
                yield put(deletecUserFail(response.data))
                yield call(delay,2000);
                toast.error(response.data.message)
                yield put(resetUserNotifcation());
            } else {
                yield put(deletecUserSuccess(response.data));
                toast.success(response.data.message)
                yield call(delay,2000);
                yield put(resetUserNotifcation());
            }
        }else{
            yield put(deletecUserFail(response.data))
            yield call(delay,2000);
            yield put(resetUserNotifcation());
            yield put(logoutUser(history))
            history.push('/');
        }
    }catch(error){
        console.log('error',error);        
    }
}

function* listcUser({payload}){    
    const { history } = payload;
    console.log("payload data",payload)
    let User = (localStorage.getItem('user'))?JSON.parse(localStorage.getItem('user')):null;
    let token = (User)?((User.token)?User.token:''):'';
    let headers = { headers: { token: `${token}` } }
    try{
        const response = yield axios.post(`${API_URL}/user/getcusernew`, payload.data,headers)
        console.log("Response",response.data);
        if(response.data.status !== -2){
            if (response.data.status === false) {                        
                yield put(listcUserFail(response.data))
                toast.error(response.data.message)
                yield call(delay,2000);
                 yield put(resetUserNotifcation());
            } else {
                yield put(listcUserSuccess(response.data));
                yield call(delay,2000);
                 yield put(resetUserNotifcation());
            }
        }else{
            yield put(listcUserFail(response.data))
            yield call(delay,2000);
             yield put(resetUserNotifcation());
            yield put(logoutUser(history))
            history.push('/');
        }
    }catch(error){
        console.log('error',error);        
    }
}

function* setEditcUser({payload}){
    const { history } = payload;
    console.log("TESSE");
    yield localStorage.setItem('edit_user',JSON.stringify(payload.data));
    history.push('/admin/user-management/edit');
}
export function* watchAddUser(){
    yield takeEvery(ADD_USER, addUser);
}

export function* watchEditUser(){
    yield takeEvery(EDIT_USER, editUser);
}

export function* watchDeleteUser(){
    yield takeEvery(DELETE_USER, deleteUser);
}

export function* watchSpecialUser(){
    yield takeEvery(SPECIAL_USER, specialUser);
}

export function* watchListUser(){
    yield takeEvery(LIST_USER, listUser);
}
export function* watchrListUser(){
    yield takeEvery(RLIST_USER, rlistUser);
}
export function* watchsetEditUser(){
    yield takeEvery(SET_EDIT_USER,setEditUser)
}

export function* watchAddcUser(){
    yield takeEvery(ADD_CUSER, addcUser);
}

export function* watchEditcUser(){
    yield takeEvery(EDIT_CUSER, editcUser);
}

export function* watchDeletecUser(){
    yield takeEvery(DELETE_CUSER, deletecUser);
}

export function* watchListcUser(){
    yield takeEvery(LIST_CUSER, listcUser);
}
export function* watchsetEditcUser(){
    yield takeEvery(SET_EDIT_CUSER,setEditcUser)
}

const delay = time => new Promise(resolve => setTimeout(resolve, time));

export default function* rootSaga() {
    yield all([
        fork(watchListUser),
        fork(watchrListUser),
        fork(watchAddUser),
        fork(watchEditUser),
        fork(watchDeleteUser),
        fork(watchSpecialUser),
        fork(watchsetEditUser),
        fork(watchListcUser),
        fork(watchAddcUser),
        fork(watchEditcUser),
        fork(watchDeletecUser),
        fork(watchsetEditcUser)
    ]);
}
