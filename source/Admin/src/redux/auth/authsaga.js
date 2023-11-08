import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import axios from 'axios';
import { toast } from 'react-toastify';
// import swal from 'swal';
import { 
    REGISTER_USER,   
    LOGIN_USER,    
    FORGOTPASSWORD_USER,    
    RESETPASSWORD_USER,    
    CHANGE_PASSWORD  ,
    VALIDATETOKEN_USER,    
    DASHBOARD,
    EDIT_ADMIN_PROFILE, 
    LOGOUT_USER,
    SOCIAL_LOGIN_USER,
    GET_TIMESLOT,
    CHANGE_TIMESLOT,
    FETCH_CAREER_PATH,
    GET_ALL_CITIES,
    GET_ALL_CITIES_SUCCESS,
    GET_ALL_SKILLS
 } from '../actionconstant';

 import { API_URL } from '../../constants/defaultValues'
 import { 
            registerSuccessfull,
            registerFail,
            loginSuccessfull,
            loginFail,
            logoutUser,
            resetNotification,
            forgotPasswordSuccessfull,
            forgotPasswordFail,
            resetPasswordSuccessfull,
            resetPasswordFail,
            editAdminProfileFail,
            editAdminProfileSuccessfull,
            changePasswordSuccessfully,
            changePasswordFailed,
            getTimeslotFailed,
            getTimeslotSuccessfully,
            changeTimeslotFailed,
            changeTimeslotSuccessfully,
            validatetokenSuccessfull,validatetokenFail,dashboardSuccessfull,dashboardFail,
            fetchCareerPathFail,fetchCareerPathSuccess,
            getAllcitiesSuccess,
            getAllSkillsSuccess, 
        } from './authactions';
function* RegisterWithEmailPassword({ payload }) {
    const { history } = payload;
    try {
        console.log("In Saga");
        
        const response = yield axios.post(`${API_URL}/user/signupadmin`, payload.user)
        
        console.log("Response",response.data);
        if (response.data.status === false) {
            yield put(registerFail(response.data))
            yield call(delay,2000)
            yield put(resetNotification())
            
                
        } else {

            yield put(registerSuccessfull(response.data));
            yield call(delay,2000)
            yield put(resetNotification());
            history.push('/admin/login');
        }
    } catch (error) {
        console.log('login error : ', error)
    }
}
 function* loginWithEmailPassword({ payload }) {
    const { history } = payload;
    try {
        console.log("In Saga");
        
        // const loginUser = yield call(loginWithEmailPasswordAsync, email, password);
        const response = yield axios.post(`${API_URL}/user/login`, payload.user)
        
        console.log("Response",response.data);
        if (response.data.status === false) {
            // console.log('login failed :', )
            // alert("Invalid Email and Password")
            yield put(loginFail(response.data))
            toast.error(response.data.message)
            yield call(delay,2000)
            yield put(resetNotification())
            // setTimeout(()=>{
            // },2000)
            // swal({            
            //     text: `Invalid Email and Password`,
            //     buttons: false,            
            //     className : "swal-top",
            //     timer : 1200
            //   })
              
        } else {
            
            yield localStorage.setItem('email',response.data.data.email);
            yield localStorage.setItem('user', JSON.stringify({'token':response.data.token}));
            yield localStorage.setItem('userdata', JSON.stringify(response.data.data));
            yield put(loginSuccessfull(response.data));
            yield put(resetNotification());
            history.push('/admin/dashboard');
        }
    } catch (error) {
        console.log('login error : ', error)
    }
}
function* loginWithSocial({ payload }) {
    const { history } = payload;
    try {
        console.log("In Saga");
        
        // const loginUser = yield call(loginWithEmailPasswordAsync, email, password);
        const response = yield axios.post(`${API_URL}/user/sso`, payload.user)
        
        console.log("Response",response.data);
        if (response.data.status === false) {
            // console.log('login failed :', )
            // alert("Invalid Email and Password")
            yield put(loginFail(response.data))
            yield call(delay,2000)
            yield put(resetNotification())
          
              
        } else {
            
            yield localStorage.setItem('email',response.data.data.email);
            yield localStorage.setItem('user', JSON.stringify({'token':response.data.token}));
            yield localStorage.setItem('userdata', JSON.stringify(response.data.data));
            yield put(loginSuccessfull(response.data));
            yield put(resetNotification());
            history.push('/admin/dashboard');
        }
    } catch (error) {
        console.log('login error : ', error)
    }
}


function* forgotpasswordWithEmail({ payload }) {
    console.log("testestes");
     const { history } = payload;
    try {
        const response = yield axios.post(`${API_URL}/user/forgotpassword`, payload.user)
        
        console.log("Response",response.data);
        if (response.data.status === false) {
            yield put(forgotPasswordFail(response.data))
            toast.error(response.data.message)
            yield call(delay,2000)
            yield put(resetNotification())
              
        } else {
            yield put(forgotPasswordSuccessfull(response.data));
            toast.success(response.data.message)
            yield call(delay,2000);
            yield put(resetNotification());
            history.push('/auth/login');
            // history.push('/');
        }
    } catch (error) {
        console.log('forgot password error : ', error)
    }
}
function* resetpasswordWithEmail({ payload }) {
    console.log("testestes");
     const { history } = payload;
    try {
        const response = yield axios.post(`${API_URL}/user/resetpassword`, payload.user)
        
        console.log("Response",response.data);
        if (response.data.status === false) {
            yield put(resetPasswordFail(response.data))
            toast.error(response.data.message)
            yield call(delay,2000)
            yield put(resetNotification())
        } else {
            yield put(resetPasswordSuccessfull(response.data));
            toast.success(response.data.message)
            yield call(delay,2000);
            yield put(resetNotification());
            history.push('/auth/login');
        }
    } catch (error) {
        console.log('forgot password error : ', error)
    }
}
function* validatetoken({ payload }) {
    
    console.log("testestes",payload.user);
     const { history } = payload;
    try {
        const response = yield axios.post(`${API_URL}/user/verifypasswordtoken`, payload.user)
        
        console.log("Response",response.data);
        if (response.data.status === false) {
            yield put(validatetokenFail(response.data))
            toast.error(response.data.message)
            yield call(delay,4000)
            yield put(resetNotification())
            history.push('/auth/login');
        } else {
            yield put(validatetokenSuccessfull(response.data));
            yield call(delay,2000);
            yield put(resetNotification());
           
        }
    } catch (error) {
        console.log('forgot password error : ', error)
    }
}

function* dashboard({ payload }) {
    const { history } = payload;
   
   // var postdata = {"token":tokendata2.token,"admin_id":tokendata2.user_id}
    let User = (localStorage.getItem('user'))?JSON.parse(localStorage.getItem('user')):null;
    let token = (User)?((User.token)?User.token:''):'';
    let headers = { headers: { token: `${token}` } }
    try {
        const response = yield axios.post(`${API_URL}/user/getadmindashboard`, payload.data,headers)
        
        console.log("Response",response.data);
        if(response.data.status !== -2){
            if (response.data.status === false) {
                yield put(dashboardFail(response.data))
                yield call(delay,4000)
                yield put(resetNotification())
                
            } else {
                yield put(dashboardSuccessfull(response.data));
                yield call(delay,2000);
                yield put(resetNotification());
            
            }
        }else{
            yield put(dashboardFail(response.data))
            yield call(delay,4000)
            yield put(resetNotification())
            yield put(logoutUser(history))
           
        }
    } catch (error) {
        console.log('forgot password error : ', error)
    }
}
function* changepassword({ payload }){
    const { history } = payload;
    console.log("payload data",payload)
    let User = (localStorage.getItem('user'))?JSON.parse(localStorage.getItem('user')):null;
    let token = (User)?((User.token)?User.token:''):'';
    let headers = { headers: { token: `${token}` } }
    try{
        const response = yield axios.post(`${API_URL}/user/changepassword`, payload.data,headers)
        //console.log("Response",response.data);
        if(response.data.status !== -2){
            if (response.data.status === false) {                        
                yield put(changePasswordFailed(response.data))
                toast.error(response.data.message)
                yield call(delay,2000);
                yield put(resetNotification());
            } else {
                yield put(changePasswordSuccessfully(response.data));
                toast.success(response.data.message)
                yield call(delay,2000);
                yield put(resetNotification());
            }
        }else{
            yield put(changePasswordFailed(response.data))
            yield call(delay,2000);
            yield put(resetNotification());
            yield put(logoutUser(history))
            history.push('/')
        }
    }catch(error){
        console.log('error',error);        
    }
}

function* editAdminProfile({payload}){
    const { history } = payload;
    let User = (localStorage.getItem('user'))?JSON.parse(localStorage.getItem('user')):null;
    let token = (User)?((User.token)?User.token:''):'';
    let headers = { headers: { token: `${token}` } }
    try{
        const response =yield axios.post(`${API_URL}/user/edit-admin-profile`,payload.user,headers)
        console.log("Response",response.data);
        if(response.data.status !== -2){
            if (response.data.status === false) {                        
                yield put(editAdminProfileFail(response.data))
                toast.error(response.data.message)
                yield call(delay,2000);
                yield put(resetNotification());
            } else {
                yield localStorage.setItem('userdata', JSON.stringify(response.data.data));
                toast.success(response.data.message)
                yield put(editAdminProfileSuccessfull(response.data));
                yield call(delay,2000);
                yield put(resetNotification());
            }
        }else{
            yield put(editAdminProfileFail(response.data))
            yield call(delay,2000);
            yield put(resetNotification());
            yield put(logoutUser(history))
            history.push('/')
        }
    }catch(error){
        console.log(error)
    }
}
function* gettimeslot({ payload }) {
    const { history } = payload;
   
   // var postdata = {"token":tokendata2.token,"admin_id":tokendata2.user_id}
    let User = (localStorage.getItem('user'))?JSON.parse(localStorage.getItem('user')):null;
    let token = (User)?((User.token)?User.token:''):'';
    let headers = { headers: { token: `${token}` } }
    try {
        const response = yield axios.post(`${API_URL}/admin/master/get-admin-timeslot`, payload.data,headers)
        
        console.log("Response",response.data);
        if(response.data.status !== -2){
            if (response.data.status === false) {
                yield put(getTimeslotFailed(response.data))
                yield call(delay,4000)
                yield put(resetNotification())
                
            } else {
                yield put(getTimeslotSuccessfully(response.data));
                yield call(delay,2000);
                yield put(resetNotification());
            
            }
        }else{
            yield put(getTimeslotFailed(response.data))
            yield call(delay,4000)
            yield put(resetNotification())
            yield put(logoutUser(history))
           
        }
    } catch (error) {
        console.log('forgot password error : ', error)
    }
}
function* changetimeslot({ payload }) {
    const { history } = payload;
   
   // var postdata = {"token":tokendata2.token,"admin_id":tokendata2.user_id}
    let User = (localStorage.getItem('user'))?JSON.parse(localStorage.getItem('user')):null;
    let token = (User)?((User.token)?User.token:''):'';
    let headers = { headers: { token: `${token}` } }
    try {
        const response = yield axios.post(`${API_URL}/user/updateadmintimeslot`, payload.data,headers)
        
        console.log("Response",response.data);
        if(response.data.status !== -2){
            if (response.data.status === false) {
                yield put(changeTimeslotFailed(response.data))
                toast.error(response.data.message)
                yield call(delay,4000)
                yield put(resetNotification())
                
            } else {
                yield put(changeTimeslotSuccessfully(response.data));
                toast.success(response.data.message)
                yield call(delay,2000);
                yield put(resetNotification());
                history.push('/admin/dashboard');
            
            }
        }else{
            yield put(changeTimeslotFailed(response.data))
            yield call(delay,4000)
            yield put(resetNotification())
            yield put(logoutUser(history))
           
        }
    } catch (error) {
        console.log('forgot password error : ', error)
    }
}
function* logoutuser({payload}){
    console.log("In logout function")
    const { history } = payload;
    localStorage.removeItem('user');
    localStorage.removeItem('email');
    localStorage.removeItem('user_id');
    localStorage.removeItem('edit_user');
    //history.push('/');
    window.location.reload();
}

export function* watchRegisterUser() {
    yield takeEvery(REGISTER_USER, RegisterWithEmailPassword);
}
export function* watchLoginUser() {
    yield takeEvery(LOGIN_USER, loginWithEmailPassword);
}
export function* watchLoginUserSocial() {
    yield takeEvery(SOCIAL_LOGIN_USER, loginWithSocial);
}

export function* watchForgotpasswordUser() {
    console.log("testse123");
    yield takeEvery(FORGOTPASSWORD_USER, forgotpasswordWithEmail);
}
export function* watchResetpasswordUser() {
    console.log("testse123");
    yield takeEvery(RESETPASSWORD_USER, resetpasswordWithEmail);
}
export function* watchChangepassword(){
    yield takeEvery(CHANGE_PASSWORD,changepassword)
}
export function* watchValidatetokennUser() {
    console.log("testse123");
    yield takeEvery(VALIDATETOKEN_USER, validatetoken);
}
export function* watchDashboard() {
    console.log("testse123");
    yield takeEvery(DASHBOARD, dashboard);
}

export function* watchGettimmeslot() {
    console.log("testse123");
    yield takeEvery(GET_TIMESLOT, gettimeslot);
}
export function* watchChangetimmeslot() {
    console.log("testse123");
    yield takeEvery(CHANGE_TIMESLOT, changetimeslot);
}

export function* watchEditAdminProfile(){
    yield takeEvery(EDIT_ADMIN_PROFILE,editAdminProfile)
}

export function* wathLogoutUser(){
    yield takeEvery(LOGOUT_USER,logoutuser)
}

function* getAllcities(){
    try{
        const response = yield axios.post(`${API_URL}/student/master/get-master`,{'type':'city'})
        
        // console.log("Response",response.data);
        if(response.data.status !== -2){
            if (response.data.status === false) {                                        
                toast.error(response.data.message)                
            } else {            
                yield put(getAllcitiesSuccess(response.data));                
            }
        }
    }catch(error){
        console.log("error",error)
    }
}

export function* watchGetAllCities(){
    yield takeEvery(GET_ALL_CITIES,getAllcities)
}

function* getAllSkills(){
    try{
        const response = yield axios.post(`${API_URL}/student/master/get-skills`)
        
        // console.log("Response",response.data);
        if(response.data.status !== -2){
            if (response.data.status === false) {                                        
                toast.error(response.data.message)                
            } else {            
                yield put(getAllSkillsSuccess(response.data));                
            }
        }
    }catch(error){
        console.log("error",error)
    }
}

export function* watchGetAllSkills(){
    yield takeEvery(GET_ALL_SKILLS,getAllSkills)
}

function* fetchCareerPath({payload}){
    try {       
        const response = yield axios.get(`${API_URL}/student/master/get-career-path`)
        
        // console.log("Response fetch career",response.data);
        if (response.data.status === false) {
            // console.log('login failed :', )
            // alert("Invalid Email and Password")
            yield put(fetchCareerPathFail(response.data))                              
        } else {                
            yield put(fetchCareerPathSuccess(response.data));            
        }
    } catch (error) {
        console.log('login error : ', error)
    }
}

export function* watchfetchCareerPath(){
    yield takeEvery(FETCH_CAREER_PATH,fetchCareerPath)
}


const delay = time => new Promise(resolve => setTimeout(resolve, time));


export default function* rootSaga() {
    yield all([
        fork(watchRegisterUser),
        fork(watchLoginUser),
        fork(watchLoginUserSocial),
        fork(watchForgotpasswordUser),
        fork(watchResetpasswordUser),
        fork(watchValidatetokennUser),
        fork(watchDashboard),
        fork(watchChangepassword),
        fork(watchEditAdminProfile),
        fork(wathLogoutUser),
        fork(watchGettimmeslot),
        fork(watchChangetimmeslot),
        fork(watchGetAllCities),
        fork(watchGetAllSkills),
        fork(watchfetchCareerPath)
    ]);
}