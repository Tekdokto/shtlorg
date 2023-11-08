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

export const listCms = (data,history) => ({
    type:LIST_CMS,
    payload: {data,history}
})

export const listCmsFail = (data) => ({
    type: LIST_CMS_FAIL,
    payload: data
})

export const listCmsSuccess = (data) => ({
    type: LIST_CMS_SUCCESS,
    payload: data
})


export const editCms = (user,history) => ({
    type: EDIT_CMS,
    payload : { user,history }
})

export const editCmsFail = (data) => ({
    type: EDIT_CMS_FAIL,
    payload: data
})

export const editCmsSuccess = (data) => ({
    type: EDIT_CMS_SUCCESS,
    payload: data
})
export const setEditCms = (data,history) => ({
    type : SET_EDIT_CMS,
    payload : {data,history}
})

export const resetCmsNotifcation = () => ({
    type: RESET_CMS_NOTIFICATION
})