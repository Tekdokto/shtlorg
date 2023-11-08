import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import axios from 'axios';
import {
    LIST_VIDEO,
    ADD_VIDEO,
    EDIT_VIDEO,
    DELETE_VIDEO,
    SET_EDIT_VIDEO
} from '../actionconstant'
import { 
    listVideoFail,
    listVideoSuccess,
    addVideoFail,
    addVideoSuccess,
    editVideoFail,
    editVideoSuccess,
    deleteVideoFail,
    deleteVideoSuccess,
    resetVideoNotifcation
 } from '../videomanagement/videoactions';
 import { logoutUser } from '../action'
 import { toast } from "react-toastify";
import { API_URL } from '../../constants/defaultValues';

function* addVideo({payload}){    
    const { history } = payload;
    console.log("payload data",payload)
    let User = (localStorage.getItem('user'))?JSON.parse(localStorage.getItem('user')):null;
    let token = (User)?((User.token)?User.token:''):'';
    let headers = { headers: { token: `${token}` } }
    try{
        const response = yield axios.post(`${API_URL}/video/addvideo`, payload.user,headers)
        console.log("Response",response.data);
        if(response.data.status !== -2){
            if (response.data.status === false) {                        
                yield put(addVideoFail(response.data))
                toast.error(response.data.message)
                yield call(delay,2000);
                yield put(resetVideoNotifcation());
            } else {
                yield put(addVideoSuccess(response.data));
                toast.success(response.data.message)
                yield call(delay,2000);
                yield put(resetVideoNotifcation());
                history.push('/admin/video-management/list')
            }
        }else{
            yield put(addVideoFail(response.data))
            yield call(delay,2000);
            yield put(resetVideoNotifcation());
            yield put(logoutUser(history))
            history.push('/');
        }
    }catch(error){
        console.log('error',error);        
    }
}

function* editVideo({payload}){    
    const { history } = payload;
    console.log("payload data",payload)
    let User = (localStorage.getItem('user'))?JSON.parse(localStorage.getItem('user')):null;
    let token = (User)?((User.token)?User.token:''):'';
    let headers = { headers: { token: `${token}` } }
    try{
        const response = yield axios.post(`${API_URL}/video/updatevideo`, payload.user,headers)
        console.log("Response",response.data);
        if(response.data.status !== -2){
            if (response.data.status === false) {                        
                yield put(editVideoFail(response.data))
                toast.error(response.data.message)
                yield call(delay,4000);
                yield put(resetVideoNotifcation());
            } else {
                yield put(editVideoSuccess(response.data));
                toast.success(response.data.message)
                yield call(delay,2000);
                yield put(resetVideoNotifcation());
                history.push('/admin/video-management/list')
            }
        }else{
            yield put(editVideoFail(response.data))
            yield call(delay,2000);
            yield put(resetVideoNotifcation());
            yield put(logoutUser(history))
            history.push('/');
        }
    }catch(error){
        console.log('error',error);        
    }
}

function* deleteVideo({payload}){    
    const { history } = payload;
    console.log("payload data",payload)
    let User = (localStorage.getItem('user'))?JSON.parse(localStorage.getItem('user')):null;
    let token = (User)?((User.token)?User.token:''):'';
    let headers = { headers: { token: `${token}` } }
    try{
        const response = yield axios.post(`${API_URL}/video/changestatus`, payload.user,headers)
        console.log("Response",response.data);
        if(response.data.status !== -2){
            if (response.data.status === false) {                        
                yield put(deleteVideoFail(response.data))
                toast.error(response.data.message)
                yield call(delay,2000);
                yield put(resetVideoNotifcation());
            } else {
                yield put(deleteVideoSuccess(response.data));
                toast.success(response.data.message)
                yield call(delay,2000);
                yield put(resetVideoNotifcation());
            }
        }else{
            yield put(deleteVideoFail(response.data))
            yield call(delay,2000);
            yield put(resetVideoNotifcation());
            yield put(logoutUser(history))
            history.push('/');
        }
    }catch(error){
        console.log('error',error);        
    }
}

function* listVideo({payload}){    
    const { history } = payload;
    console.log("payload data",payload)
    let User = (localStorage.getItem('user'))?JSON.parse(localStorage.getItem('user')):null;
    let token = (User)?((User.token)?User.token:''):'';
    let headers = { headers: { token: `${token}` } }
    try{
        const response = yield axios.post(`${API_URL}/video/getvideonew`, payload.data,headers)
        console.log("Response",response.data);
        if(response.data.status !== -2){
            if (response.data.status === false) {                        
                yield put(listVideoFail(response.data))
                yield call(delay,2000);
                // yield put(resetVideoNotifcation());
            } else {
                yield put(listVideoSuccess(response.data));
                yield call(delay,2000);
                // yield put(resetVideoNotifcation());
            }
        }else{
            yield put(listVideoFail(response.data))
            yield call(delay,2000);
            // yield put(resetVideoNotifcation());
            yield put(logoutUser(history))
            history.push('/');
        }
    }catch(error){
        console.log('error',error);        
    }
}

function* setEditVideo({payload}){
    const { history } = payload;
    console.log("TESSE");
    yield localStorage.setItem('edit_user',JSON.stringify(payload.data));
    history.push('/admin/video-management/edit');
}

export function* watchAddVideo(){
    yield takeEvery(ADD_VIDEO, addVideo);
}

export function* watchEditVideo(){
    yield takeEvery(EDIT_VIDEO, editVideo);
}

export function* watchDeleteVideo(){
    yield takeEvery(DELETE_VIDEO, deleteVideo);
}

export function* watchListVideo(){
    yield takeEvery(LIST_VIDEO, listVideo);
}
export function* watchsetEditVideo(){
    yield takeEvery(SET_EDIT_VIDEO,setEditVideo)
}
const delay = time => new Promise(resolve => setTimeout(resolve, time));

export default function* rootSaga() {
    yield all([
        fork(watchListVideo),
        fork(watchAddVideo),
        fork(watchEditVideo),
        fork(watchDeleteVideo),
        fork(watchsetEditVideo)
    ]);
}
