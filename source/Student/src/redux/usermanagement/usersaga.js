import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import axios from 'axios';
import {
    LIST_USER,
    ADD_USER,
    EDIT_USER,
    DELETE_USER,
    SET_EDIT_USER
} from '../actionconstant'
import { 
    listUserFail,
    listUserSuccess,
    addUserFail,
    addUserSuccess,
    editUserFail,
    editUserSuccess,
    deleteUserFail,
    deleteUserSuccess,
    resetUserNotifcation
 } from '../usermanagement/useractions';
 import { logoutUser } from '../action'
import { API_URL } from '../../constants/defaultValues';

function* addUser({payload}){    
    const { history } = payload;
    // console.log("payload data",payload)
    let User = (localStorage.getItem('user'))?JSON.parse(localStorage.getItem('user')):null;
    let token = (User)?((User.token)?User.token:''):'';
    let headers = { headers: { token: `${token}` } }
    try{
        const response = yield axios.post(`${API_URL}/user/adduser`, payload.user,headers)
        // console.log("Response",response.data);
        if(response.data.status !== -2){
            if (response.data.status === false) {                        
                yield put(addUserFail(response.data))
                yield call(delay,2000);
                yield put(resetUserNotifcation());
            } else {
                yield put(addUserSuccess(response.data));
                yield call(delay,2000);
                yield put(resetUserNotifcation());
            }
        }else{
            yield put(addUserFail(response.data))
            yield call(delay,2000);
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
    // console.log("payload data",payload)
    let User = (localStorage.getItem('user'))?JSON.parse(localStorage.getItem('user')):null;
    let token = (User)?((User.token)?User.token:''):'';
    let headers = { headers: { token: `${token}` } }
    try{
        const response = yield axios.post(`${API_URL}/user/updateuser`, payload.user,headers)
        // console.log("Response",response.data);
        if(response.data.status !== -2){
            if (response.data.status === false) {                        
                yield put(editUserFail(response.data))
                yield call(delay,2000);
                yield put(resetUserNotifcation());
            } else {
                yield put(editUserSuccess(response.data));
                history.push('/candidate/user-management/list')
                yield call(delay,2000);
                yield put(resetUserNotifcation());
            }
        }else{
            yield put(editUserFail(response.data))
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
    // console.log("payload data",payload)
    let User = (localStorage.getItem('user'))?JSON.parse(localStorage.getItem('user')):null;
    let token = (User)?((User.token)?User.token:''):'';
    let headers = { headers: { token: `${token}` } }
    try{
        const response = yield axios.post(`${API_URL}/user/changestatus`, payload.user,headers)
        // console.log("Response",response.data);
        if(response.data.status !== -2){
            if (response.data.status === false) {                        
                yield put(deleteUserFail(response.data))
                yield call(delay,2000);
                yield put(resetUserNotifcation());
            } else {
                yield put(deleteUserSuccess(response.data));
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

function* listUser({payload}){    
    const { history } = payload;
    // console.log("payload data",payload)
    let User = (localStorage.getItem('user'))?JSON.parse(localStorage.getItem('user')):null;
    let token = (User)?((User.token)?User.token:''):'';
    let headers = { headers: { token: `${token}` } }
    try{
        const response = yield axios.post(`${API_URL}/user/getusernew`, payload.data,headers)
        // console.log("Response",response.data);
        if(response.data.status !== -2){
            if (response.data.status === false) {                        
                yield put(listUserFail(response.data))
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

function* setEditUser({payload}){
    const { history } = payload;
    // console.log("TESSE");
    yield localStorage.setItem('edit_user',JSON.stringify(payload.data));
    history.push('/candidate/user-management/edit');
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

export function* watchListUser(){
    yield takeEvery(LIST_USER, listUser);
}
export function* watchsetEditUser(){
    yield takeEvery(SET_EDIT_USER,setEditUser)
}
const delay = time => new Promise(resolve => setTimeout(resolve, time));

export default function* rootSaga() {
    yield all([
        fork(watchListUser),
        fork(watchAddUser),
        fork(watchEditUser),
        fork(watchDeleteUser),
        fork(watchsetEditUser)
    ]);
}
