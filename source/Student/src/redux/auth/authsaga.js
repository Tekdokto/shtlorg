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
    FETCH_CAREER_PATH,
    VERIFY_EMAIL,
    GET_PROFILE_DATA,
    GET_PROFILE_DATA_SUCCESS,
    GET_ALL_CITIES,
    GET_ALL_CITIES_SUCCESS,
    GET_ALL_SKILLS,
    EDIT_SPEC_SHEET_DATA
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
            editProfileFail,
            editProfileSuccessfull,
            changePasswordSuccessfully,
            changePasswordFailed,
            validatetokenSuccessfull,validatetokenFail,dashboardSuccessfull,dashboardFail,
            fetchCareerPathSuccess,
            fetchCareerPathFail,
            getProfileLatestDataSuccess,
            getAllcitiesSuccess,
            getAllSkillsSuccess,
            getProfileLatestData as getProfileLatestData1,
            editSpecSheetDataSuccessfull,
            verifyemailFail
        } from './authactions';
function* RegisterWithEmailPassword({ payload }) {
    const { history } = payload;
    try {
        // console.log("In Saga");
        
        const response = yield axios.post(`${API_URL}/student/sso`, payload.user)
        
        // console.log("Response",response.data);
        if (response.data.status === false) {
            yield put(registerFail(response.data))
            toast.error(response.data.message)
            yield call(delay,2000)
            // yield put(resetNotification())
            
                
        } else {

            yield put(registerSuccessfull(response.data));
            toast.success("User registered successfully. Email verify link sent.");
            yield call(delay,2000)
            // yield put(resetNotification());
            history.push('/auth/login');
        }
    } catch (error) {
        // console.log('login error : ', error)
    }
}
 function* loginWithEmailPassword({ payload }) {
    const { history } = payload;
    try {
        // console.log("In Saga");
        
        // const loginUser = yield call(loginWithEmailPasswordAsync, email, password);
        const response = yield axios.post(`${API_URL}/student/login`, payload.user)
        
        // console.log("Response",response.data);
        if (response.data.status === false) {
            // console.log('login failed :', )
            // alert("Invalid Email and Password")
            yield put(loginFail(response.data))
            toast.error(response.data.message)
            yield call(delay,2000)
            // yield put(resetNotification())
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
            // yield put(resetNotification());
            history.push('/candidate/dashboard');
        }
    } catch (error) {
        // console.log('login error : ', error)
    }
}
function* loginWithSocial({ payload }) {
    const { history } = payload;
    try {
        // console.log("In Saga");
        
        // const loginUser = yield call(loginWithEmailPasswordAsync, email, password);
        const response = yield axios.post(`${API_URL}/student/sso`, payload.user)
        
        // console.log("Response",response.data);
        if (response.data.status === false) {
            // console.log('login failed :', )
            // alert("Invalid Email and Password")
            yield put(loginFail(response.data))
            toast.error(response.data.message)
            yield call(delay,2000)
            // yield put(resetNotification())
          
              
        } else {
            
            yield localStorage.setItem('email',response.data.data.email);
            yield localStorage.setItem('user', JSON.stringify({'token':response.data.token}));
            yield localStorage.setItem('userdata', JSON.stringify(response.data.data));
            yield put(loginSuccessfull(response.data));
            // yield put(resetNotification());
            history.push('/candidate/dashboard');
        }
    } catch (error) {
        // console.log('login error : ', error)
    }
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

function* forgotpasswordWithEmail({ payload }) {
    // console.log("testestes");
     const { history } = payload;
    try {
        const response = yield axios.post(`${API_URL}/student/forgotpassword`, payload.user)
        
        // console.log("Response",response.data);
        if (response.data.status === false) {
            yield put(forgotPasswordFail(response.data))
            // yield call(delay,2000)
            toast.error(response.data.message)
            yield put(resetNotification())
              
        } else {
            yield put(forgotPasswordSuccessfull(response.data));
            toast.success(response.data.message)
            yield call(delay,2000);
            // yield put(resetNotification());
            history.push('/auth/login');
            // history.push('/');
        }
    } catch (error) {
        // console.log('forgot password error : ', error)
    }
}
function* resetpasswordWithEmail({ payload }) {
    // console.log("testestes");
     const { history } = payload;
    try {
        const response = yield axios.post(`${API_URL}/student/resetpassword`, payload.user)
        
        // console.log("Response",response.data);
        if (response.data.status === false) {
            yield put(resetPasswordFail(response.data))
            toast.error(response.data.message)
            yield call(delay,2000)
            // yield put(resetNotification())
            history.push('/auth/login');
        } else {
            yield put(resetPasswordSuccessfull(response.data));
            // yield call(delay,2000);
            // yield put(resetNotification());
            history.push('/auth/resetpasswordsuccess');
        }
    } catch (error) {
        // console.log('forgot password error : ', error)
    }
}
function* validatetoken({ payload }) {
    
    // console.log("testestes",payload.user);
     const { history } = payload;
    try {
        const response = yield axios.post(`${API_URL}/student/verifypasswordtoken`, payload.user)
        
        // console.log("Response",response.data);
        if (response.data.status === false) {
            yield put(validatetokenFail(response.data))
            toast.error(response.data.message)
            // yield call(delay,4000)
            // yield put(resetNotification())
            history.push('/auth/login');
        } else {
            yield put(validatetokenSuccessfull(response.data));
            yield call(delay,2000);
            yield put(resetNotification());
           
        }
    } catch (error) {
        // console.log('forgot password error : ', error)
    }
}

function* dashboard({ payload }) {
    const { history } = payload;
   
   // var postdata = {"token":tokendata2.token,"admin_id":tokendata2.user_id}
    let User = (localStorage.getItem('user'))?JSON.parse(localStorage.getItem('user')):null;
    let token = (User)?((User.token)?User.token:''):'';
    let headers = { headers: { token: `${token}` } }
    try {
        const response = yield axios.post(`${API_URL}/student/getadmindashboard`, payload.data,headers)
        
        // console.log("Response",response.data);
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
        // console.log('forgot password error : ', error)
    }
}
function* changepassword({ payload }){
    const { history } = payload;
    // console.log("payload data",payload)
    let User = (localStorage.getItem('user'))?JSON.parse(localStorage.getItem('user')):null;
    let token = (User)?((User.token)?User.token:''):'';
    let headers = { headers: { token: `${token}` } }
    try{
        const response = yield axios.post(`${API_URL}/student/changepassword`, payload.data,headers)
        //console.log("Response",response.data);
        if(response.data.status !== -2){
            if (response.data.status === false) {                        
                // yield put(changePasswordFailed(response.data))
                // yield call(delay,2000);
                toast.error(response.data.message)
                yield put(resetNotification());
            } else {
                toast.success(response.data.message)
                // yield put(changePasswordSuccessfully(response.data));
                // yield call(delay,2000);
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
        const response =yield axios.post(`${API_URL}/student/updateprofile`,payload.user,headers)
        // console.log("Response",response.data);
        if(response.data.status !== -2){
            if (response.data.status === false) {                        
                yield put(editProfileFail(response.data))
                toast.error(response.data.message)
                // yield call(delay,2000);
                // yield put(resetNotification());
            } else {
                yield localStorage.setItem('userdata', JSON.stringify(response.data.data));
                yield put(getProfileLatestData1(payload.user,history))
                yield put(editProfileSuccessfull(response.data));
                toast.success(response.data.message)
                // yield call(delay,2000);
                // yield put(resetNotification());
            }
        }else{
            yield put(editProfileFail(response.data))
            yield call(delay,2000);
            // yield put(resetNotification());
            yield put(logoutUser(history))
            history.push('/')
        }
    }catch(error){
        console.log(error)
    }
}

function* logoutuser({payload}){
    // console.log("In logout function")
    const { history } = payload;
    localStorage.removeItem('user');
    localStorage.removeItem('email');
    localStorage.removeItem('user_id');
    localStorage.removeItem('edit_user');
    localStorage.removeItem('userdata');
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
    yield takeEvery(FORGOTPASSWORD_USER, forgotpasswordWithEmail);
}
export function* watchResetpasswordUser() {
    yield takeEvery(RESETPASSWORD_USER, resetpasswordWithEmail);
}
export function* watchChangepassword(){
    yield takeEvery(CHANGE_PASSWORD,changepassword)
}
export function* watchValidatetokennUser() {
    yield takeEvery(VALIDATETOKEN_USER, validatetoken);
}
export function* watchDashboard() {
    yield takeEvery(DASHBOARD, dashboard);
}

export function* watchEditAdminProfile(){
    yield takeEvery(EDIT_ADMIN_PROFILE,editAdminProfile)
}

export function* wathLogoutUser(){
    yield takeEvery(LOGOUT_USER,logoutuser)
}

function* VerifyEmail({payload}){
    const { history } = payload;
    try {
        // console.log("In Saga");
        
        // const loginUser = yield call(loginWithEmailPasswordAsync, email, password);
        const response = yield axios.post(`${API_URL}/student/emailverify`, payload.data)
        
        // console.log("Response",response.data);
        if (response.data.status === false) {           
            // history.push('/candidate/login') 
            // toast.error(response.data.message)              
            yield put(verifyemailFail(response.data.message))
        } else {            
            // yield localStorage.setItem('email',response.data.data.email);
            // yield localStorage.setItem('user', JSON.stringify({'token':response.data.token}));
            // yield localStorage.setItem('userdata', JSON.stringify(response.data.data));
            localStorage.removeItem('user');
            localStorage.removeItem('email');
            localStorage.removeItem('user_id');
            localStorage.removeItem('edit_user');
            localStorage.removeItem('userdata');
            yield put(loginSuccessfull(response.data));
            history.push('/candidate/login');
            toast.success(response.data.message)             
        }
    } catch (error) {
        history.push('/candidate/login')
        console.log('login error : ', error)
    }
}

export function* watchVerifyEmail(){
    yield takeEvery(VERIFY_EMAIL,VerifyEmail)
}

function* getProfileLatestData({payload}){
    const {history} = payload;
    try{
        let User = (localStorage.getItem('user'))?JSON.parse(localStorage.getItem('user')):null;
        let token = (User)?((User.token)?User.token:''):'';
        let headers = { headers: { token: `${token}` } }
        const response = yield axios.post(`${API_URL}/student/getprofile`, payload.data,headers)
        
        // console.log("Response",response.data);
        if(response.data.status !== -2){
            if (response.data.status === false) {                                        
                toast.error(response.data.message)                
            } else {
                yield localStorage.setItem('userdata', JSON.stringify(response.data.data));
                yield put(getProfileLatestDataSuccess(response.data));
                // toast.success(response.data.message)             
            }
        }else{            
            yield put(logoutUser(history))
            history.push('/')
        }
    }catch(error){
        console.log("error:",error)
    }
}

export function* watchGetProfileLatestData(){
    yield takeEvery(GET_PROFILE_DATA,getProfileLatestData)
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


function* editSpecsheetData({payload}){
    const { history } = payload;
    let User = (localStorage.getItem('user'))?JSON.parse(localStorage.getItem('user')):null;
    let token = (User)?((User.token)?User.token:''):'';
    let headers = { headers: { token: `${token}` } }
    try{
        const response =yield axios.post(`${API_URL}/student/update_specsheet`,payload.data,headers)
        // console.log("Response",response.data);
        if(response.data.status !== -2){
            if (response.data.status === false) {                                        
                toast.error(response.data.message)               
            } else {                
                toast.success("Resume details updated successfully.")
            }
        }else{
            toast.error(response.data.message)
            // yield put(resetNotification());
            yield put(logoutUser(history))
            history.push('/')
        }
    }catch(error){
        console.log(error)
    }
}




export function* watchEditSpecsheetData(){
    yield takeEvery(EDIT_SPEC_SHEET_DATA,editSpecsheetData)
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
        fork(watchfetchCareerPath),
        fork(watchVerifyEmail),
        fork(watchGetProfileLatestData),
        fork(watchGetAllCities),
        fork(watchGetAllSkills),
        fork(watchEditSpecsheetData)
    ]);
}