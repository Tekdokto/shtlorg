import {
    LIST_MOCK,
    LIST_MOCK_FAIL,
    LIST_MOCK_SUCCESS,
    UPDATE_MOCK,
    UPDATE_MOCK_FAIL,
    UPDATE_MOCK_SUCCESS,
    RESET_MOCK_NOTIFICATION,
    
} from '../actionconstant';

export const listMock = (data,history) => ({
    type:LIST_MOCK,
    payload: {data,history}
})

export const listMockFail = (data) => ({
    type: LIST_MOCK_FAIL,
    payload: data
})

export const listMockSuccess = (data) => ({
    type: LIST_MOCK_SUCCESS,
    payload: data
})


export const updateMock = (user,history) => ({
    type: UPDATE_MOCK,
    payload : { user,history }
})

export const updateMockFail = (data) => ({
    type: UPDATE_MOCK_FAIL,
    payload: data
})

export const updateMockSuccess = (data) => ({
    type: UPDATE_MOCK_SUCCESS,
    payload: data
})

export const resetMockNotifcation = () => ({
    type: RESET_MOCK_NOTIFICATION
})