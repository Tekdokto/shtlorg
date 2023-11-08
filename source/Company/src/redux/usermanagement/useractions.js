import {
    LIST_USER,
    LIST_USER_FAIL,
    LIST_USER_SUCCESS,
    ADD_USER,
    ADD_USER_SUCCESS,
    ADD_USER_FAIL,
    EDIT_USER,
    EDIT_USER_FAIL,
    EDIT_USER_SUCCESS,
    DELETE_USER,
    DELETE_USER_FAIL,
    DELETE_USER_SUCCESS,
    RESET_USER_NOTIFICATION,
    SET_EDIT_USER
} from '../actionconstant';

export const listUser = (data,history) => ({
    type:LIST_USER,
    payload: {data,history}
})

export const listUserFail = (data) => ({
    type: LIST_USER_FAIL,
    payload: data
})

export const listUserSuccess = (data) => ({
    type: LIST_USER_SUCCESS,
    payload: data
})

export const addUser = (user,history) => ({
    type: ADD_USER,
    payload : { user,history }
})

export const addUserFail = (data) => ({
    type: ADD_USER_FAIL,
    payload: data
})

export const addUserSuccess = (data) => ({
    type: ADD_USER_SUCCESS,
    payload: data
})

export const editUser = (user,history) => ({
    type: EDIT_USER,
    payload : { user,history }
})

export const editUserFail = (data) => ({
    type: EDIT_USER_FAIL,
    payload: data
})

export const editUserSuccess = (data) => ({
    type: EDIT_USER_SUCCESS,
    payload: data
})
export const setEditUser = (data,history) => ({
    type : SET_EDIT_USER,
    payload : {data,history}
})

export const deleteUser = (user,history) => ({
    type: DELETE_USER,
    payload : { user,history }
})

export const deleteUserFail = (data) => ({
    type: DELETE_USER_FAIL,
    payload: data
})

export const deleteUserSuccess = (data) => ({
    type: DELETE_USER_SUCCESS,
    payload: data
})

export const resetUserNotifcation = () => ({
    type: RESET_USER_NOTIFICATION
})