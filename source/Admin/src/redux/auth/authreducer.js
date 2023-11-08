import { 
    REGISTER_USER,
    REGISTER_SUCCESSFULL,
    REGISTER_FAIL,
    LOGIN_USER,
    LOGIN_SUCCESSFULL,
    LOGIN_FAIL,
    LOGOUT_USER,
    RESET_NOTIFICATION,
    FORGOTPASSWORD_USER,
    FORGOTPASSWORD_SUCCESSFULL,
    FORGOTPASSWORD_FAIL,
    RESETPASSWORD_USER,
    RESETPASSWORD_SUCCESSFULL,
    RESETPASSWORD_FAIL,
    CHANGE_PASSWORD,
    CHANGE_PASSWORD_FAIL,
    CHANGE_PASSWORD_SUCCESSFULL,
    VALIDATETOKEN_USER,
    VALIDATETOKEN_SUCCESSFULL,
    VALIDATETOKEN_FAIL,
    DASHBOARD,
    DASHBOARD_SUCCESSFULL,
    DASHBOARD_FAIL,
    EDIT_ADMIN_PROFILE,
    EDIT_ADMIN_PROFILE_SUCCESS,
    EDIT_ADMIN_PROFILE_FAIL,
    SOCIAL_LOGIN_USER,
    SOCIAL_LOGIN_SUCCESSFULL,
    SOCIAL_LOGIN_FAIL,
    GET_TIMESLOT,
    GET_TIMESLOT_SUCCESSFULL,
    GET_TIMESLOT_FAIL,
    CHANGE_TIMESLOT,
    CHANGE_TIMESLOT_SUCCESSFULL,
    CHANGE_TIMESLOT_FAIL,
    FETCH_CAREER_PATH,
    FETCH_CAREER_PATH_SUCCESSFULL,
    GET_ALL_CITIES_SUCCESS,
    GET_ALL_SKILLS_SUCCESS
 } from '../actionconstant';
const initialState = {
    user : (localStorage.getItem('userdata'))?JSON.parse(localStorage.getItem('userdata')):null,
    token: (localStorage.getItem('token'))?localStorage.getItem('toke'):null,
    shownotification: false,
    dashboard_count : null,
    loginerror : false,    
    notification_message:'',
    loading: false,
    changepassworderror: false,
    timeslotdata : null,
    career_path  :[],
    cities : [],
    all_skills : []
}

const authReducer = (state=initialState,action) => {
    // console.log('Action',action.type,action);
    
    switch(action.type){
        case LOGIN_USER:
            return {
                ...state,
                loading: true
            }
        case LOGIN_SUCCESSFULL:
            return {
                ...state,
                user : action.payload.data,
                token: action.payload.token,
                loginerror: false,
                shownotification : true,
                notification_message: "Login successful.",
                loading: false,
            }
        case LOGIN_FAIL:
            return {
                ...state,
                loading: false,
                loginerror: true,
                shownotification : true,
                notification_message:   action.payload.message
            }
        case REGISTER_USER:
            return {
                ...state,
                loading: true
            }
        case REGISTER_SUCCESSFULL:
            return {
                ...state,
                user : '',
                loginerror: false,
                shownotification : true,
                notification_message: action.payload.message,
                loading: false,
            }
        case REGISTER_FAIL:
            return {
                ...state,
                loading: false,
                loginerror: true,
                shownotification : true,
                notification_message:   action.payload.message
            }    
        case SOCIAL_LOGIN_USER:
            return {
                ...state,
                loading: true
            }
        case SOCIAL_LOGIN_SUCCESSFULL:
            return {
                ...state,
                user : action.payload.data,
                token: action.payload.token,
                loginerror: false,
                shownotification : true,
                notification_message: "Login successful.",
                loading: false,
            }
        case SOCIAL_LOGIN_FAIL:
            return {
                ...state,
                loading: false,
                loginerror: true,
                shownotification : true,
                notification_message:   action.payload.message
            }    
        case RESET_NOTIFICATION:
            return {
                ...state,
                loading:false,
                shownotification:false,
                notification_message: "",
                loginerror:false,
            }
        case FORGOTPASSWORD_USER:
            return {
                ...state,
                loading: true
            }
        case FORGOTPASSWORD_SUCCESSFULL:
            return {
                ...state,
                user : action.payload,
                loginerror: false,
                shownotification : true,
                notification_message: action.payload.message,
                loading: false,
            }
        case FORGOTPASSWORD_FAIL:
            return {
                ...state,
                loading: false,
                loginerror: true,
                shownotification : true,
                notification_message: action.payload.message
            }
        case CHANGE_PASSWORD:
            return {
                ...state,
                loading: true            
            }
        case CHANGE_PASSWORD_SUCCESSFULL:
            return { 
                ...state,
                loading: false,
                shownotification:true,
                changepassworderror:false,
                notification_message: 'Password Changed Successfully.'
            }
        case CHANGE_PASSWORD_FAIL:
            return { 
                ...state,
                loading: false,
                shownotification:true,
                changepassworderror:true,
                notification_message: action.payload.message
            }
        case RESETPASSWORD_USER:
            return {
                ...state,
                loading: true
            }
        case RESETPASSWORD_SUCCESSFULL:
            return {
                ...state,
                user : action.payload,
                loginerror: false,
                shownotification : true,
                notification_message: action.payload.message,
                loading: false,
            }
        case RESETPASSWORD_FAIL:
        return {
            ...state,
            loading: false,
            loginerror: true,
            shownotification : true,
            notification_message: action.payload.message
        }  
        case VALIDATETOKEN_USER:
            return {
                ...state,
                loading: true
            }
        case VALIDATETOKEN_SUCCESSFULL:
            return {
                ...state,
                user : action.payload,
                loginerror: false,
                shownotification : false,
                notification_message: action.payload.message,
                loading: false,
            }
        case VALIDATETOKEN_FAIL:
            return {
                ...state,
                loading: false,
                loginerror: true,
                shownotification : true,
                notification_message: action.payload.message
            }
        case DASHBOARD:
            return {
                ...state,
                loading: true
            }
        case DASHBOARD_SUCCESSFULL:
            return {
                ...state,
                dashboard_count : action.payload.data,
                loginerror: false,
                shownotification : false,
                notification_message: action.payload.message,
                loading: false,
            }
        case DASHBOARD_FAIL:
            return {
                ...state,
                loading: false,
                loginerror: true,
                shownotification : false,
                notification_message: action.payload.message
            } 
        case EDIT_ADMIN_PROFILE:
            return {
                ...state,
                loading: true
            }
        case EDIT_ADMIN_PROFILE_SUCCESS:
            return {
                ...state,
                user : action.payload.data,
                token: action.payload.token,
                loginerror: false,
                shownotification : true,
                notification_message: "Profile Updated Successfullly.",
                loading: false,
            }
        case EDIT_ADMIN_PROFILE_FAIL:
            return {
                ...state,
                loading: false,
                loginerror: true,
                shownotification : true,
                notification_message:   action.payload.message
            } 
        case GET_TIMESLOT:
            return {
                ...state,
                loading: true            
            }
        case GET_TIMESLOT_SUCCESSFULL:
            return { 
                ...state,
                timeslotdata : action.payload.data,
                loading: false,
                shownotification:false,
                changepassworderror:false,
                notification_message: action.payload.message
            }
        case GET_TIMESLOT_FAIL:
            return { 
                ...state,
                loading: false,
                shownotification:false,
                changepassworderror:true,
                notification_message: action.payload.message
            } 
        case CHANGE_TIMESLOT:
            return {
                ...state,
                loading: true            
            }
        case CHANGE_TIMESLOT_SUCCESSFULL:
            return { 
                ...state,
                timeslotdata:null,
                loading: false,
                shownotification:true,
                changepassworderror:false,
                notification_message: action.payload.message
            }
        case CHANGE_TIMESLOT_FAIL:
            return { 
                ...state,
                loading: false,
                shownotification:true,
                changepassworderror:true,
                notification_message: action.payload.message
            } 
        case FETCH_CAREER_PATH:
            return {
                ...state,
                loading : true
            }
        case FETCH_CAREER_PATH_SUCCESSFULL:
            return {
                ...state,
                loading : false,
                career_path : action.payload.data
            }
        case GET_ALL_CITIES_SUCCESS:
            return {
                ...state,
                cities : action.payload.data
            }  
        case GET_ALL_SKILLS_SUCCESS:
            return {
                ...state,
                all_skills : action.payload.data
            }          
        default:
            return state
    }
}
export default authReducer;