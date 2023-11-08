import {
    LIST_VIDEO,
    LIST_VIDEO_FAIL,
    LIST_VIDEO_SUCCESS,
    ADD_VIDEO,
    ADD_VIDEO_SUCCESS,
    ADD_VIDEO_FAIL,
    EDIT_VIDEO,
    EDIT_VIDEO_FAIL,
    EDIT_VIDEO_SUCCESS,
    DELETE_VIDEO,
    DELETE_VIDEO_FAIL,
    DELETE_VIDEO_SUCCESS,
    RESET_VIDEO_NOTIFICATION,
    SET_EDIT_VIDEO
} from '../actionconstant';
const initialState = { 
    users : [],
    total_user:0,
    user_error: false,
    shownotification: false,
    notification_message:"",
    loading: false,
    edit_user_id: 0,
    edit_user_obj: (localStorage.getItem('edit_user'))?JSON.parse(localStorage.getItem('edit_user')):null
}

const videoReducer = (state=initialState,action) => {
    console.log("action",action.type,action.payload);
    
    switch(action.type){
        case LIST_VIDEO:
            return {
                ...state,
                loading : true
            }
        case LIST_VIDEO_SUCCESS:
            return {
                ...state,
                users: action.payload.data.data,
                total_user:action.payload.data.total,
                loading: false
            }
        case LIST_VIDEO_FAIL:
            return {
                ...state,                
                loading: false,
                user_error: true,
                shownotification: true,
                notification_message:action.payload.message,
            }        
        case ADD_VIDEO:
            return {
                ...state,
                loading : true
            }
        case ADD_VIDEO_SUCCESS:
            return {
                ...state,                
                loading: false,
                user_error: false,
                shownotification: true,
                notification_message:action.payload.message
            }
        case ADD_VIDEO_FAIL:
            return {
                ...state,                
                loading: false,
                user_error: true,
                shownotification: true,
                notification_message:action.payload.message,
            }
        case EDIT_VIDEO:
            return {
                ...state,
                loading : true
            }
        case EDIT_VIDEO_SUCCESS:
            return {
                ...state,
                loading: false,
                user_error: false,
                shownotification: true,
                notification_message:action.payload.message
            }
        case EDIT_VIDEO_FAIL:
            return {
                ...state,                
                loading: false,
                user_error: true,
                shownotification: true,
                notification_message:action.payload.message,
            }
        case SET_EDIT_VIDEO:
            return {
                ...state,
                loading:false,
                user_error: false,
                shownotification: false,
                notification_message:"",
                edit_user_obj : action.payload.data
            }
        case DELETE_VIDEO:
            return {
                ...state,
                loading : true
            }
        case DELETE_VIDEO_SUCCESS:
            return {
                ...state,                
                loading: false,
                user_error: false,
                shownotification: true,
                notification_message:action.payload.message
            }
        case DELETE_VIDEO_FAIL:
            return {
                ...state,                
                loading: false,
                user_error: true,
                shownotification: true,
                notification_message:action.payload.message,
            }
        case RESET_VIDEO_NOTIFICATION:
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
export default videoReducer;
