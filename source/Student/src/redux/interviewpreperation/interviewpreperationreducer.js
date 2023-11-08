import {
    LIST_PREPERATION_VIDEO,
    LIST_PREPERATION_VIDEO_SUCCESS,
    FETCH_MOCK_INTERVIEW_STUDENT_DATA_SUCCESS,
    SET_MOCK_INTERVIEW_WITH_ADMIN_SUCCESS,
    FETCH_ADMIN_INTERVIEW_TIME_SLOT_SUCCESS
} from "../actionconstant"

const initialState = {
    videos : [],
    mock_interview_data : [],
    admin_time_slot : []
}

const preperationReducer = (state=initialState,action) => {
    switch(action.type){
        case LIST_PREPERATION_VIDEO_SUCCESS:
            return {
                ...state,
                videos : action.payload.data.data
            }
        case FETCH_MOCK_INTERVIEW_STUDENT_DATA_SUCCESS:
            return {
                ...state,
                mock_interview_data : action.payload.data.data
            }
        case FETCH_ADMIN_INTERVIEW_TIME_SLOT_SUCCESS:
            return {
                ...state,
                admin_time_slot : action.payload.data
            }
        default:
            return {
                ...state
            }
    }
}
export default preperationReducer;