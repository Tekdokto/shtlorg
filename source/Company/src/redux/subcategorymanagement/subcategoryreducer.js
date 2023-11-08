import {
    FETCH_SUBCATEGORY_MANAGEMENT,
    FETCH_SUBCATEGORY_MANAGEMENT_FAIL,
    FETCH_SUBCATEGORY_MANAGEMENT_SUCCESS,
    ADD_SUBCATEGORY,
    ADD_SUBCATEGORY_FAIL,
    ADD_SUBCATEGORY_SUCCESS,
    CHANGE_SUBCATEGORY_STATUS,
    CHANGE_SUBCATEGORY_STATUS_SUCCESS,
    CHANGE_SUBCATEGORY_STATUS_FAIL,
    UPDATE_SUBCATEGORY,
    UPDATE_SUBCATEGORY_SUCCESS,
    UPDATE_SUBCATEGORY_FAIL,
    RESET_SUBCATEGORY_NOTIFICATION
} from '../actionconstant';

const initialState = { 
    subcategories : [],
    total_sub_category:0,
    subcategory_error: false,
    shownotification: false,
    notification_message:"",
    loading: false,
    edit_subcategory_id: 0,
    edit_subcategory_obj: null
}

const subcategoryReducer = (state=initialState,action) => {
    switch(action.type){
        case FETCH_SUBCATEGORY_MANAGEMENT:
            return {
                ...state,
                loading : true
            }
        case FETCH_SUBCATEGORY_MANAGEMENT_SUCCESS:
            return {
                ...state,
                subcategories: action.payload.data.data,
                total_sub_category:action.payload.data.total,
                loading: false
            }
        case FETCH_SUBCATEGORY_MANAGEMENT_FAIL:
            return {
                ...state,                
                loading: false,
                subcategory_error: true,
                shownotification: true,
                notification_message:action.payload.message,
            }        
        case ADD_SUBCATEGORY:
            return {
                ...state,
                loading : true
            }
        case ADD_SUBCATEGORY_SUCCESS:
            return {
                ...state,
                loading: false,
                subcategory_error: false,
                shownotification: true,
                notification_message:action.payload.message,
            }
        case ADD_SUBCATEGORY_FAIL:
            return {
                ...state,                
                loading: false,
                subcategory_error: true,
                shownotification: true,
                notification_message:action.payload.message,
            }
        case UPDATE_SUBCATEGORY:
            return {
                ...state,
                loading : true
            }
        case UPDATE_SUBCATEGORY_SUCCESS:
            return {
                ...state,
                loading: false,
                subcategory_error: false,
                shownotification: true,
                notification_message:action.payload.message,
            }
        case UPDATE_SUBCATEGORY_FAIL:
            return {
                ...state,                
                loading: false,
                subcategory_error: true,
                shownotification: true,
                notification_message:action.payload.message,
            }
            case CHANGE_SUBCATEGORY_STATUS:
            return {
                ...state,
                loading : true
            }
        case CHANGE_SUBCATEGORY_STATUS_FAIL:
            return {
                ...state,
                loading: false,
                subcategory_error: true,
                shownotification: true,
                notification_message:action.payload.message,
            }
        case CHANGE_SUBCATEGORY_STATUS_SUCCESS:
            return {
                ...state,                
                loading: false,
                subcategory_error: false,
                shownotification: true,
                notification_message:action.payload.message,
            }
        case RESET_SUBCATEGORY_NOTIFICATION:
            return {
                ...state,
                loading:false,
                shownotification:false,
                notification_message: "",
                subcategory_error:false
            }
        default:
            return state;
    }
}
export default subcategoryReducer;