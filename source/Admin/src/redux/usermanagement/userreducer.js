import {
    LIST_USER,
    LIST_USER_FAIL,
    LIST_USER_SUCCESS,
    RLIST_USER,
    RLIST_USER_FAIL,
    RLIST_USER_SUCCESS,
    ADD_USER,
    ADD_USER_SUCCESS,
    ADD_USER_FAIL,
    EDIT_USER,
    EDIT_USER_FAIL,
    EDIT_USER_SUCCESS,
    DELETE_USER,
    DELETE_USER_FAIL,
    DELETE_USER_SUCCESS,
    SPECIAL_USER,
    SPECIAL_USER_FAIL,
    SPECIAL_USER_SUCCESS,
    RESET_USER_NOTIFICATION,
    SET_EDIT_USER,
    LIST_CUSER,
    LIST_CUSER_FAIL,
    LIST_CUSER_SUCCESS,
    ADD_CUSER,
    ADD_CUSER_SUCCESS,
    ADD_CUSER_FAIL,
    EDIT_CUSER,
    EDIT_CUSER_FAIL,
    EDIT_CUSER_SUCCESS,
    DELETE_CUSER,
    DELETE_CUSER_FAIL,
    DELETE_CUSER_SUCCESS,
    SET_EDIT_CUSER
} from '../actionconstant';
const initialState = { 
    users : [],
    company_data:[],
    total_user:0,
    user_error: false,
    shownotification: false,
    notification_message:"",
    loading: false,
    edit_user_id: 0,
    edit_user_obj: (localStorage.getItem('edit_user'))?JSON.parse(localStorage.getItem('edit_user')):null
}

const userReducer = (state=initialState,action) => {
    console.log("action",action.type,action.payload);
    
    switch(action.type){
        case LIST_USER:
            return {
                ...state,
                loading : true
            }
        case LIST_USER_SUCCESS:
            return {
                ...state,
                users: action.payload.data.data,
                total_user:action.payload.data.total,
                loading: false
            }
        case LIST_USER_FAIL:
            return {
                ...state,                
                loading: false,
                user_error: true,
                shownotification: true,
                notification_message:action.payload.message,
            } 

        case ADD_USER:
            return {
                ...state,
                loading : true
            }
        case ADD_USER_SUCCESS:
            return {
                ...state,                
                loading: false,
                user_error: false,
                shownotification: true,
                notification_message:action.payload.message
            }
        case ADD_USER_FAIL:
            return {
                ...state,                
                loading: false,
                user_error: true,
                shownotification: true,
                notification_message:action.payload.message,
            }
        case EDIT_USER:
            return {
                ...state,
                loading : true
            }
        case EDIT_USER_SUCCESS:
            return {
                ...state,
                loading: false,
                user_error: false,
                shownotification: true,
                notification_message:action.payload.message
            }
        case EDIT_USER_FAIL:
            return {
                ...state,                
                loading: false,
                user_error: true,
                shownotification: true,
                notification_message:action.payload.message,
            }
        case SET_EDIT_USER:
            return {
                ...state,
                loading:false,
                user_error: false,
                shownotification: false,
                notification_message:"",
                edit_user_obj : action.payload.data
            }
        case DELETE_USER:
            return {
                ...state,
                loading : true
            }
        case DELETE_USER_SUCCESS:
            return {
                ...state,                
                loading: false,
                user_error: false,
                shownotification: true,
                notification_message:action.payload.message
            }
        case DELETE_USER_FAIL:
            return {
                ...state,                
                loading: false,
                user_error: true,
                shownotification: true,
                notification_message:action.payload.message,
            }
        case SPECIAL_USER:
            return {
                ...state,
                loading : true
            }
        case SPECIAL_USER_SUCCESS:
            return {
                ...state,
                loading: false,
                user_error: false,
                shownotification: true,
                notification_message:action.payload.message
            }
        case SPECIAL_USER_FAIL:
            return {
                ...state,
                loading: false,
                user_error: true,
                shownotification: true,
                notification_message:action.payload.message,
            }

        case LIST_CUSER:
            return {
                ...state,
                loading : true
            }
        case LIST_CUSER_SUCCESS:
            return {
                ...state,
                users: action.payload.data.data,
                company: action.payload.data.company,
                total_user:action.payload.data.total,
                loading: false
            }
        case LIST_CUSER_FAIL:
            return {
                ...state,                
                loading: false,
                user_error: true,
                shownotification: true,
                notification_message:action.payload.message,
            }        
        case ADD_CUSER:
            return {
                ...state,
                loading : true
            }
        case ADD_CUSER_SUCCESS:
            return {
                ...state,                
                loading: false,
                user_error: false,
                shownotification: true,
                notification_message:action.payload.message
            }
        case ADD_CUSER_FAIL:
            return {
                ...state,                
                loading: false,
                user_error: true,
                shownotification: true,
                notification_message:action.payload.message,
            }
        case EDIT_CUSER:
            return {
                ...state,
                loading : true
            }
        case EDIT_CUSER_SUCCESS:
            return {
                ...state,
                loading: false,
                user_error: false,
                shownotification: true,
                notification_message:action.payload.message
            }
        case EDIT_CUSER_FAIL:
            return {
                ...state,                
                loading: false,
                user_error: true,
                shownotification: true,
                notification_message:action.payload.message,
            }
        case SET_EDIT_CUSER:
            return {
                ...state,
                loading:false,
                user_error: false,
                shownotification: false,
                notification_message:"",
                edit_user_obj : action.payload.data
            }
        case DELETE_CUSER:
            return {
                ...state,
                loading : true
            }
        case DELETE_CUSER_SUCCESS:
            return {
                ...state,                
                loading: false,
                user_error: false,
                shownotification: true,
                notification_message:action.payload.message
            }
        case DELETE_CUSER_FAIL:
            return {
                ...state,                
                loading: false,
                user_error: true,
                shownotification: true,
                notification_message:action.payload.message,
            } 
        case RLIST_USER:
            return {
                ...state,
                loading : true
            }
        case RLIST_USER_SUCCESS:
            return {
                ...state,
                users: action.payload.data.data,
                total_user:action.payload.data.total,
                company_data:action.payload.data.company_data,
                loading: false
            }
        case RLIST_USER_FAIL:
            return {
                ...state,                
                loading: false,
                user_error: true,
                shownotification: true,
                notification_message:action.payload.message,
            }     
        case RESET_USER_NOTIFICATION:
            return {
                ...state,
                loading:false,
                shownotification:false,
                notification_message: "",
                user_error:false,
                edit_user_obj:null
            }
        default:
            return state;
    }
}
export default userReducer;