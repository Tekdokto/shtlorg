import {
    LIST_CMS,
    LIST_CMS_FAIL,
    LIST_CMS_SUCCESS,
    EDIT_CMS,
    EDIT_CMS_FAIL,
    EDIT_CMS_SUCCESS,
    RESET_CMS_NOTIFICATION,
    SET_EDIT_CMS
} from '../actionconstant';
const initialState = { 
    users : [],
    total_user:0,
    user_error: false,
    shownotification: false,
    notification_message:"",
    loading: false,
    edit_user_id: 0,
    edit_user_obj: (localStorage.getItem('edit_user1'))?JSON.parse(localStorage.getItem('edit_user1')):null,
}

const userReducer = (state=initialState,action) => {
    // console.log("action",action.type,action.payload);
    
    switch(action.type){
        case LIST_CMS:
            return {
                ...state,
                loading : true
            }
        case LIST_CMS_SUCCESS:
            return {
                ...state,
                users: action.payload.data.data,
                total_user:action.payload.data.total,
                loading: false
            }
        case LIST_CMS_FAIL:
            return {
                ...state,                
                loading: false,
                user_error: true,
                shownotification: true,
                notification_message:action.payload.message,
            }        
        case EDIT_CMS:
            return {
                ...state,
                loading : true
            }
        case EDIT_CMS_SUCCESS:
            return {
                ...state,
                loading: false,
                user_error: false,
                shownotification: true,
                notification_message:action.payload.message
            }
        case EDIT_CMS_FAIL:
            return {
                ...state,                
                loading: false,
                user_error: true,
                shownotification: true,
                notification_message:action.payload.message,
            }
        case SET_EDIT_CMS:
            return {
                ...state,
                loading:false,
                user_error: false,
                shownotification: false,
                notification_message:"",
                edit_user_obj : action.payload.data
            }
        case RESET_CMS_NOTIFICATION:
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
