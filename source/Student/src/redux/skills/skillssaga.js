import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import axios from 'axios';
import { toast } from 'react-toastify';
// import swal from 'swal';
import { 
    LIST_STUDENT_SKILL,
    LIST_CAREER_PATH_SKILL,
    ADD_STUDENT_SKILL,
    CHANGE_STUDENT_SKILL_STATUS
 } from '../actionconstant';

 import { API_URL } from '../../constants/defaultValues';

 import { 
    listStudentSuccess,
    listCareerPathSuccess,
    addStudentSkillSuccess
} from './skillsaction';

function* ListSkills({payload}){
    const { history } = payload;
    try {
        let User = (localStorage.getItem('user'))?JSON.parse(localStorage.getItem('user')):null;
        let token = (User)?((User.token)?User.token:''):'';
        let headers = { headers: { token: `${token}` } }
        const response = yield axios.post(`${API_URL}/userskill/listuserskill`, payload.data,headers)
        
        // console.log("List User Skill",response.data);
        if (response.data.status === false) {
            toast.error(response.data.message)
            yield call(delay,2000)
            // yield put(resetNotification())
            
                
        } else {
            yield put(listStudentSuccess(response.data));
            yield call(delay,2000)
            // yield put(resetNotification());
        }
    } catch (error) {
        console.log('login error : ', error)
    }
}

function* AddSkill({payload}){
    const { history } = payload;
    try {
        let User = (localStorage.getItem('user'))?JSON.parse(localStorage.getItem('user')):null;
        let token = (User)?((User.token)?User.token:''):'';
        let headers = { headers: { token: `${token}` } }      
        const response = yield axios.post(`${API_URL}/userskill/addnewskill`, payload.data,headers)
        
        // console.log("Response",response.data);
        if (response.data.status === false) {
            toast.error(response.data.message)
            yield call(delay,2000)
        } else {
            yield put(addStudentSkillSuccess(response.data));
            toast.success(response.data.message);
            yield call(delay,2000)
        }
    } catch (error) {
        console.log('login error : ', error)
    }
}

export function* wathListSkills(){
    yield takeEvery(LIST_STUDENT_SKILL,ListSkills);
}

export function* wathAddSkill(){
    yield takeEvery(ADD_STUDENT_SKILL,AddSkill);
}

function* CareerPathSkillList({payload}){
    const { history } = payload;
    try {
        let User = (localStorage.getItem('user'))?JSON.parse(localStorage.getItem('user')):null;
        let token = (User)?((User.token)?User.token:''):'';
        let headers = { headers: { token: `${token}` } }
        const response = yield axios.post(`${API_URL}/userskill/list_careerpath_skill`, payload.data,headers)
        
        // console.log("Career Path listing: ",response.data);
        if (response.data.status === false) {
            toast.error(response.data.message)
            yield call(delay,2000)
            // yield put(resetNotification())
            
                
        } else {
            yield put(listCareerPathSuccess(response.data));
            yield call(delay,2000)
            // yield put(resetNotification());
        }
    } catch (error) {
        console.log('login error : ', error)
    }
}

export function* wathCareerPathSkillList(){
    yield takeEvery(LIST_CAREER_PATH_SKILL,CareerPathSkillList);
}

function* ChangeStudentSkillStatus({payload}){
    const { history } = payload;
    try {
        let User = (localStorage.getItem('user'))?JSON.parse(localStorage.getItem('user')):null;
        let token = (User)?((User.token)?User.token:''):'';
        let headers = { headers: { token: `${token}` } }
        const response = yield axios.post(`${API_URL}/userskill/changeskillstatus`, payload.data,headers)
        
        // console.log("Change Skill Status listing: ",response.data);
        if (response.data.status === false) {
            // toast.error(response.data.message)
        } else {
            // toast.success("Status Changed")
        }
    } catch (error) {
        console.log('login error : ', error)
    }
}
export function* watchChangeStudentSkillStatus(){
    yield takeEvery(CHANGE_STUDENT_SKILL_STATUS,ChangeStudentSkillStatus)
}

const delay = time => new Promise(resolve => setTimeout(resolve, time));


export default function* rootSaga() {
    yield all([
        fork(wathListSkills),
        fork(wathAddSkill),
        fork(wathCareerPathSkillList),
        fork(watchChangeStudentSkillStatus)
    ]);
}