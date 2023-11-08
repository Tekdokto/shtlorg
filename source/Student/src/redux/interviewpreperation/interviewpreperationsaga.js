import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import axios from 'axios';
import { toast } from 'react-toastify';
// import swal from 'swal';
import { 
    LIST_PREPERATION_VIDEO,
    CHANGE_VIDEO_WATCH_STATUS,
    FETCH_MOCK_INTERVIEW_STUDENT_DATA,
    SET_MOCK_INTERVIEW_WITH_ADMIN,
    FETCH_ADMIN_INTERVIEW_TIME_SLOT
 } from '../actionconstant';

 import { API_URL } from '../../constants/defaultValues';

 import { 
    listPreperationVideoSuccess,
    fetchMockInterviewStudentDataSuccess,
    fetchAdminInterviewTimeSlotSuccess   
} from './interviewpreperationaction';

function* ListPreperationVideo({payload}){
    const { history } = payload;
    try {
        let User = (localStorage.getItem('user'))?JSON.parse(localStorage.getItem('user')):null;
        let token = (User)?((User.token)?User.token:''):'';
        let headers = { headers: { token: `${token}` } }
        const response = yield axios.post(`${API_URL}/videouser/getvideolist`, payload.data,headers)
        
        // console.log("List User Skill",response.data);
        if (response.data.status === false) {
            toast.error(response.data.message)
            yield call(delay,2000)
            // yield put(resetNotification())
            
                
        } else {
            yield put(listPreperationVideoSuccess(response.data));
            yield call(delay,2000)
            // yield put(resetNotification());
        }
    } catch (error) {
        console.log('login error : ', error)
    }
}

export function* wathListPreperationVideo(){
    yield takeEvery(LIST_PREPERATION_VIDEO,ListPreperationVideo);
}

function* ChangeVideoWatchStatus({payload}){
    const { history } = payload;
    try {
        let User = (localStorage.getItem('user'))?JSON.parse(localStorage.getItem('user')):null;
        let token = (User)?((User.token)?User.token:''):'';
        let headers = { headers: { token: `${token}` } }
        const response = yield axios.post(`${API_URL}/videouser/changevideostatus`, payload.data,headers)
        
        // console.log("Change Video Watch Status: ",response.data);
        if (response.data.status === false) {
            // toast.error(response.data.message)
        } else {
            // toast.success("Status Changed")
        }
    } catch (error) {
        console.log('login error : ', error)
    }
}
export function* watchChangeVideoWatchStatus(){
    yield takeEvery(CHANGE_VIDEO_WATCH_STATUS,ChangeVideoWatchStatus)
}


function* fetchMockInterviewStudentData({payload}){
    const { history } = payload;
    try{
        let User = (localStorage.getItem('user'))?JSON.parse(localStorage.getItem('user')):null;
        let token = (User)?((User.token)?User.token:''):'';
        let headers = { headers: { token: `${token}` } }
        const response = yield axios.post(`${API_URL}/videouser/get_mock_interview_record`, payload.data,headers)
        
        // console.log("Fecth mockup interview data: ",response.data);
        if (response.data.status === false) {
            toast.error(response.data.message)
        } else {
            yield put(fetchMockInterviewStudentDataSuccess(response.data));
        }
    }catch(error){
        console.log("error:",error)
    }
}
export function* watchFetchInterviewStudentData(){
    yield takeEvery(FETCH_MOCK_INTERVIEW_STUDENT_DATA,fetchMockInterviewStudentData)
}


function* setMockInterviewStudentData({payload}){
    const { history } = payload;
    try{
        let User = (localStorage.getItem('user'))?JSON.parse(localStorage.getItem('user')):null;
        let token = (User)?((User.token)?User.token:''):'';
        let headers = { headers: { token: `${token}` } }
        const response = yield axios.post(`${API_URL}/videouser/set_mock_interview`, payload.data,headers)
        
        // console.log("Set mockup interview status: ",response.data);
        if (response.data.status === false) {
            toast.error(response.data.message)
            setTimeout(function(){
                window.location.reload()
            },1000)
        } else {
            toast.success(response.data.message)
            setTimeout(function(){
                window.location.reload()
            },1000)
        }
    }catch(error){
        console.log("error:",error)
    }
}
export function* watchSetInterviewStudentData(){
    yield takeEvery(SET_MOCK_INTERVIEW_WITH_ADMIN,setMockInterviewStudentData)
}


function* fetchInterviewAdminTimeSlot({payload}){
    const { history } = payload;
    try{        
        const response = yield axios.post(`${API_URL}/student/master/get-admin-timeslot`)        
        // console.log("fetch mockup interview schedule: ",response.data);
        if (response.data.status === false) {
            console.log("Error")
        } else {
            yield put(fetchAdminInterviewTimeSlotSuccess(response.data));
        }
    }catch(error){
        console.log("error:",error)
    }
}
export function* watchFetchInterviewAdminTimeSlot(){
    yield takeEvery(FETCH_ADMIN_INTERVIEW_TIME_SLOT,fetchInterviewAdminTimeSlot)
}

const delay = time => new Promise(resolve => setTimeout(resolve, time));


export default function* rootSaga() {
    yield all([
        fork(wathListPreperationVideo),
        fork(watchChangeVideoWatchStatus),
        fork(watchFetchInterviewStudentData),
        fork(watchSetInterviewStudentData),
        fork(watchFetchInterviewAdminTimeSlot)
    ]);
}