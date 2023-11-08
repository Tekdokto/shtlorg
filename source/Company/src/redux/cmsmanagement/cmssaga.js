import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import axios from 'axios';
import {
    LIST_CMS,
    ADD_CMS,
    EDIT_CMS,
    DELETE_CMS,
    SET_EDIT_CMS
} from '../actionconstant'
import { 
    listCmsFail,
    listCmsSuccess,
    editCmsFail,
    editCmsSuccess,
    resetCmsNotifcation
 } from '../cmsmanagement/cmsactions';
 import { logoutUser } from '../action'
import { API_URL } from '../../constants/defaultValues';


function* editCms({payload}){    
    const { history } = payload;
    // console.log("payload data",payload)
    let User = (localStorage.getItem('user'))?JSON.parse(localStorage.getItem('user')):null;
    let token = (User)?((User.token)?User.token:''):'';
    let headers = { headers: { token: `${token}` } }
    try{
        const response = yield axios.post(`${API_URL}/cms/updatecms`, payload.user,headers)
        // console.log("Response",response.data);
        if(response.data.status !== -2){
            if (response.data.status === false) {                        
                yield put(editCmsFail(response.data))
                yield call(delay,2000);
                yield put(resetCmsNotifcation());
            } else {
                // console.log("cms updatedddddddddd")
                yield put(editCmsSuccess(response.data));
                history.push('/company/cms-management/list')
                yield call(delay,2000);
                yield put(resetCmsNotifcation());
            }
        }else{
            yield put(editCmsFail(response.data))
            yield call(delay,2000);
            yield put(resetCmsNotifcation());
            yield put(logoutUser(history))
            history.push('/');
        }
    }catch(error){
        console.log('error',error);        
    }
}

function* listCms({payload}){    
    const { history } = payload;
    // console.log("payload data",payload)
    let User = (localStorage.getItem('user'))?JSON.parse(localStorage.getItem('user')):null;
    let token = (User)?((User.token)?User.token:''):'';
    let headers = { headers: { token: `${token}` } }
    try{
        const response = yield axios.post(`${API_URL}/cms/getcms`, payload.data,headers)
        // console.log("Response",response.data);
        if(response.data.status !== -2){
            if (response.data.status === false) {                        
                yield put(listCmsFail(response.data))
                yield call(delay,2000);
                // yield put(resetUserNotifcation());
            } else {
                yield put(listCmsSuccess(response.data));
                yield call(delay,2000);
                // yield put(resetUserNotifcation());
            }
        }else{
            yield put(listCmsFail(response.data))
            yield call(delay,2000);
            // yield put(resetUserNotifcation());
            yield put(logoutUser(history))
            history.push('/');
        }
    }catch(error){
        console.log('error',error);        
    }
}

function* setEditCms({payload}){
    const { history } = payload;
    // console.log("TESSE");
    yield localStorage.setItem('edit_user1',JSON.stringify(payload.data));
    history.push('/company/cms-management/edit');
}


export function* watchEditCms(){
    yield takeEvery(EDIT_CMS, editCms);
}


export function* watchListCms(){
    yield takeEvery(LIST_CMS, listCms);
}
export function* watchsetEditCms(){
    yield takeEvery(SET_EDIT_CMS,setEditCms)
}
const delay = time => new Promise(resolve => setTimeout(resolve, time));

export default function* rootSaga() {
    yield all([
        fork(watchListCms),
        fork(watchEditCms),
        fork(watchsetEditCms)
    ]);
}
