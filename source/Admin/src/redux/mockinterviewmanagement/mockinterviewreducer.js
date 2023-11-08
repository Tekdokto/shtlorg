import {
    LIST_MOCK,
    LIST_MOCK_FAIL,
    LIST_MOCK_SUCCESS,
    UPDATE_MOCK,
    UPDATE_MOCK_FAIL,
    UPDATE_MOCK_SUCCESS,
    RESET_MOCK_NOTIFICATION,
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
        case LIST_MOCK:
            return {
                ...state,
                loading : true
            }
        case LIST_MOCK_SUCCESS:
            return {
                ...state,
                users: action.payload.data.data,
                total_user:action.payload.data.total,
                loading: false
            }
        case LIST_MOCK_FAIL:
            return {
                ...state,                
                loading: false,
                user_error: true,
                shownotification: true,
                notification_message:action.payload.message,
            }        
       
        case UPDATE_MOCK:
            return {
                ...state,
                loading : true
            }
        case UPDATE_MOCK_SUCCESS:
            return {
                ...state,
                loading: false,
                user_error: false,
                shownotification: true,
                notification_message:action.payload.message
            }
        case UPDATE_MOCK_FAIL:
            return {
                ...state,                
                loading: false,
                user_error: true,
                shownotification: true,
                notification_message:action.payload.message,
            }
        
        
        case RESET_MOCK_NOTIFICATION:
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
