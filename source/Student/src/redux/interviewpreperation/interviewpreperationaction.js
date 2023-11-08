import {
    LIST_PREPERATION_VIDEO,
    LIST_PREPERATION_VIDEO_SUCCESS,
    CHANGE_VIDEO_WATCH_STATUS,
    SET_MOCK_INTERVIEW_WITH_ADMIN,
    SET_MOCK_INTERVIEW_WITH_ADMIN_SUCCESS,
    FETCH_MOCK_INTERVIEW_STUDENT_DATA,
    FETCH_MOCK_INTERVIEW_STUDENT_DATA_SUCCESS,
    FETCH_ADMIN_INTERVIEW_TIME_SLOT,
    FETCH_ADMIN_INTERVIEW_TIME_SLOT_SUCCESS
} from "../actionconstant";


export const listPreperationVideo = (data,history) => ({
    type : LIST_PREPERATION_VIDEO,
    payload: {data,history}
})

export const listPreperationVideoSuccess = (data) => ({
    type : LIST_PREPERATION_VIDEO_SUCCESS,
    payload : data
})

export const changeVideoWatchStatus = (data,history) => ({
    type : CHANGE_VIDEO_WATCH_STATUS,
    payload : {data,history}
})

export const setMockInterviewWithAdmin = (data,history) => ({
    type : SET_MOCK_INTERVIEW_WITH_ADMIN,
    payload : {data,history}
})


export const setMockInterviewWithAdminSuccess = (data) => ({
    type : SET_MOCK_INTERVIEW_WITH_ADMIN_SUCCESS,
    payload : data
})

export const fetchMockInterviewStudentData = (data,history) => ({
    type : FETCH_MOCK_INTERVIEW_STUDENT_DATA,
    payload : {data,history}
})


export const fetchMockInterviewStudentDataSuccess = (data) => ({
    type : FETCH_MOCK_INTERVIEW_STUDENT_DATA_SUCCESS,
    payload : data
})

export const fetchAdminInterviewTimeSlot = (data,history) => ({
    type : FETCH_ADMIN_INTERVIEW_TIME_SLOT,
    payload : {data,history}
})


export const fetchAdminInterviewTimeSlotSuccess = (data) => ({
    type : FETCH_ADMIN_INTERVIEW_TIME_SLOT_SUCCESS,
    payload : data
})
