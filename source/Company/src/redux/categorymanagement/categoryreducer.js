import {
    LIST_CATEGORY,
    LIST_CATEGORY_FAIL,
    LIST_CATEGORY_SUCCESS,
    ADD_CATEGORY,
    ADD_CATEGORY_SUCCESS,
    ADD_CATEGORY_FAIL,
    EDIT_CATEGORY,
    EDIT_CATEGORY_FAIL,
    EDIT_CATEGORY_SUCCESS,
    DELETE_CATEGORY,
    DELETE_CATEGORY_FAIL,
    DELETE_CATEGORY_SUCCESS,
    RESET_CATEGORY_NOTIFICATION,
    GET_MASTER_CATEGORY,
    GET_MASTER_CATEGORY_SUCCESS
} from '../actionconstant';
const initialState = { 
    categories : [],
    all_categories: [],
    total_category:0,
    category_error: false,
    shownotification: false,
    notification_message:"",
    loading: false,
    edit_category_id: 0,
    edit_category_obj: null
}

const categoryReducer = (state=initialState,action) => {
    switch(action.type){
        case LIST_CATEGORY:
            return {
                ...state,
                loading : true
            }
        case LIST_CATEGORY_SUCCESS:
            return {
                ...state,
                categories: action.payload.data.data,
                total_category:action.payload.data.total,
                loading: false
            }
        case LIST_CATEGORY_FAIL:
            return {
                ...state,                
                loading: false,
                category_error: true,
                shownotification: true,
                notification_message:action.payload.message,
            }        
        case ADD_CATEGORY:
            return {
                ...state,
                loading : true
            }
        case ADD_CATEGORY_SUCCESS:
            return {
                ...state,
                loading: false,
                category_error: false,
                shownotification: true,
                notification_message:action.payload.message
            }
        case ADD_CATEGORY_FAIL:
            return {
                ...state,                
                loading: false,
                category_error: true,
                shownotification: true,
                notification_message:action.payload.message,
            }
        case EDIT_CATEGORY:
            return {
                ...state,
                loading : true
            }
        case EDIT_CATEGORY_SUCCESS:
            return {
                ...state,
                loading: false,
                category_error: false,
                shownotification: true,
                notification_message:action.payload.message
            }
        case EDIT_CATEGORY_FAIL:
            return {
                ...state,                
                loading: false,
                category_error: true,
                shownotification: true,
                notification_message:action.payload.message,
            }
        case DELETE_CATEGORY:
            return {
                ...state,
                loading : true
            }
        case DELETE_CATEGORY_SUCCESS:
            return {
                ...state,
                loading: false,
                category_error: false,
                shownotification: true,
                notification_message:action.payload.message
            }
        case DELETE_CATEGORY_FAIL:
            return {
                ...state,                
                loading: false,
                category_error: true,
                shownotification: true,
                notification_message:action.payload.message,
            }
        case GET_MASTER_CATEGORY:
            return {
                ...state
            }
        case GET_MASTER_CATEGORY_SUCCESS:
            return {
                ...state,                
                all_categories : action.payload.data.data
            }
            
        case RESET_CATEGORY_NOTIFICATION:
            return {
                ...state,
                loading:false,
                shownotification:false,
                notification_message: "",
                loginerror:false,
            }
        default:
            return state;
    }
}
export default categoryReducer;
