import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import axios from 'axios';
import {
    LIST_MOCK,
    UPDATE_MOCK,
 
   
} from '../actionconstant'
import { 
    listMockFail,
    listMockSuccess,
    updateMockFail,
    updateMockSuccess,
    resetMockNotifcation
 } from '../mockinterviewmanagement/mockinterviewactions';
 import { logoutUser } from '../action'
import { API_URL } from '../../constants/defaultValues';
import { toast } from "react-toastify"


function* updateMoke({payload}){    
    const { history } = payload;
    console.log("payload data",payload)
    let User = (localStorage.getItem('user'))?JSON.parse(localStorage.getItem('user')):null;
    let token = (User)?((User.token)?User.token:''):'';
    let headers = { headers: { token: `${token}` } }
    try{
        const response = yield axios.post(`${API_URL}/mockinterview/changestatus`, payload.user,headers)
        console.log("Response",response.data);
        if(response.data.status !== -2){
            if (response.data.status === false) {                        
                yield put(updateMockFail(response.data))
                toast.error(response.data.message)
                yield call(delay,4000);
                yield put(resetMockNotifcation());
            } else {
                yield put(updateMockSuccess(response.data));
                toast.success(response.data.message)
                yield call(delay,2000);
                yield put(resetMockNotifcation());
                
            }
        }else{
            yield put(updateMockFail(response.data))
            yield call(delay,2000);
            yield put(resetMockNotifcation());
            yield put(logoutUser(history))
            history.push('/');
        }
    }catch(error){
        console.log('error',error);        
    }
}


function* listMoke({payload}){    
    const { history } = payload;
    console.log("payload data",payload)
    let User = (localStorage.getItem('user'))?JSON.parse(localStorage.getItem('user')):null;
    let token = (User)?((User.token)?User.token:''):'';
    let headers = { headers: { token: `${token}` } }
    try{
        const response = yield axios.post(`${API_URL}/mockinterview/getmock`, payload.data,headers)
        console.log("Response",response.data);
        if(response.data.status !== -2){
            if (response.data.status === false) {                        
                yield put(listMockFail(response.data))
                yield call(delay,2000);
                yield put(resetMockNotifcation());
            } else {
                yield put(listMockSuccess(response.data));
                yield call(delay,2000);
                // yield put(resetMockNotifcation());
            }
        }else{
            yield put(listMockFail(response.data))
            yield call(delay,2000);
            // yield put(resetMockNotifcation());
            yield put(logoutUser(history))
            history.push('/');
        }
    }catch(error){
        console.log('error',error);        
    }
}



export function* watchUpdateMock(){
    yield takeEvery(UPDATE_MOCK, updateMoke);
}

export function* watchListMock(){
    yield takeEvery(LIST_MOCK, listMoke);
}

const delay = time => new Promise(resolve => setTimeout(resolve, time));

export default function* rootSaga() {
    yield all([
        fork(watchListMock),
        fork(watchUpdateMock),
      
    ]);
}
