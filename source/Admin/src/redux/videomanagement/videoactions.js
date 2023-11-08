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

export const listVideo = (data,history) => ({
    type:LIST_VIDEO,
    payload: {data,history}
})

export const listVideoFail = (data) => ({
    type: LIST_VIDEO_FAIL,
    payload: data
})

export const listVideoSuccess = (data) => ({
    type: LIST_VIDEO_SUCCESS,
    payload: data
})

export const addVideo = (user,history) => ({
    type: ADD_VIDEO,
    payload : { user,history }
})

export const addVideoFail = (data) => ({
    type: ADD_VIDEO_FAIL,
    payload: data
})

export const addVideoSuccess = (data) => ({
    type: ADD_VIDEO_SUCCESS,
    payload: data
})

export const editVideo = (user,history) => ({
    type: EDIT_VIDEO,
    payload : { user,history }
})

export const editVideoFail = (data) => ({
    type: EDIT_VIDEO_FAIL,
    payload: data
})

export const editVideoSuccess = (data) => ({
    type: EDIT_VIDEO_SUCCESS,
    payload: data
})
export const setEditVideo = (data,history) => ({
    type : SET_EDIT_VIDEO,
    payload : {data,history}
})

export const deleteVideo = (user,history) => ({
    type: DELETE_VIDEO,
    payload : { user,history }
})

export const deleteVideoFail = (data) => ({
    type: DELETE_VIDEO_FAIL,
    payload: data
})

export const deleteVideoSuccess = (data) => ({
    type: DELETE_VIDEO_SUCCESS,
    payload: data
})

export const resetVideoNotifcation = () => ({
    type: RESET_VIDEO_NOTIFICATION
})