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
    GET_ALL_CITIES_SUCCESS,
    GET_ALL_SKILLS_SUCCESS,
    FETCH_CAREER_PATH_SUCCESSFULL
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
    career_path : [],
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
                loading: false,
            }
        case LOGIN_FAIL:
            return {
                ...state,
                loading: false,
                loginerror: true,                
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
                loading: false,
            }
        case REGISTER_FAIL:
            return {
                ...state,
                loading: false,
                loginerror: true,                
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
                loading: false,
            }
        case SOCIAL_LOGIN_FAIL:
            return {
                ...state,
                loading: false,
                loginerror: true,
                
            }    
        case RESET_NOTIFICATION:
            return {
                ...state,
                loading:false,                
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
                loading: false,
            }
        case FORGOTPASSWORD_FAIL:
            return {
                ...state,
                loading: false,
                loginerror: true,                
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
                changepassworderror:false,                
            }
        case CHANGE_PASSWORD_FAIL:
            return { 
                ...state,
                loading: false,                
                changepassworderror:true,                
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
                loading: false,
            }
        case RESETPASSWORD_FAIL:
        return {
            ...state,
            loading: false,
            loginerror: true,            
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
                loading: false,
            }
        case VALIDATETOKEN_FAIL:
            return {
                ...state,
                loading: false,
                loginerror: true,                
            }
        case DASHBOARD:
            return {
                ...state,
                loading: true
            }
        case DASHBOARD_SUCCESSFULL:
            return {
                ...state,
                dashboard_count : action.payload,
                loginerror: false,                
                loading: false,
            }
        case DASHBOARD_FAIL:
            return {
                ...state,
                loading: false,
                loginerror: true,                
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
                loading: false,
            }
        case EDIT_ADMIN_PROFILE_FAIL:
            return {
                ...state,
                loading: false,
                loginerror: true,
                
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