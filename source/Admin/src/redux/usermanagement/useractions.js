import {
    LIST_USER,
    LIST_USER_FAIL,
    LIST_USER_SUCCESS,
    RLIST_USER,
    RLIST_USER_FAIL,
    RLIST_USER_SUCCESS,
    ADD_USER,
    ADD_USER_SUCCESS,
    ADD_USER_FAIL,
    EDIT_USER,
    EDIT_USER_FAIL,
    EDIT_USER_SUCCESS,
    DELETE_USER,
    DELETE_USER_FAIL,
    DELETE_USER_SUCCESS,
    SPECIAL_USER,
    SPECIAL_USER_FAIL,
    SPECIAL_USER_SUCCESS,
    RESET_USER_NOTIFICATION,
    SET_EDIT_USER,
    LIST_CUSER,
    LIST_CUSER_FAIL,
    LIST_CUSER_SUCCESS,
    ADD_CUSER,
    ADD_CUSER_SUCCESS,
    ADD_CUSER_FAIL,
    EDIT_CUSER,
    EDIT_CUSER_FAIL,
    EDIT_CUSER_SUCCESS,
    DELETE_CUSER,
    DELETE_CUSER_FAIL,
    DELETE_CUSER_SUCCESS,
    SET_EDIT_CUSER
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

export const rlistUser = (data,history) => ({
    type:RLIST_USER,
    payload: {data,history}
})

export const rlistUserFail = (data) => ({
    type: RLIST_USER_FAIL,
    payload: data
})

export const rlistUserSuccess = (data) => ({
    type: RLIST_USER_SUCCESS,
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
export const specialUser = (user,history) => ({
    type: SPECIAL_USER,
    payload : { user,history }
})

export const specialUserFail = (data) => ({
    type: SPECIAL_USER_FAIL,
    payload: data
})

export const specialUserSuccess = (data) => ({
    type: SPECIAL_USER_SUCCESS,
    payload: data
})
//company user below
export const listcUser = (data,history) => ({
    type:LIST_CUSER,
    payload: {data,history}
})

export const listcUserFail = (data) => ({
    type: LIST_CUSER_FAIL,
    payload: data
})

export const listcUserSuccess = (data) => ({
    type: LIST_CUSER_SUCCESS,
    payload: data
})

export const addcUser = (user,history) => ({
    type: ADD_CUSER,
    payload : { user,history }
})

export const addcUserFail = (data) => ({
    type: ADD_CUSER_FAIL,
    payload: data
})

export const addcUserSuccess = (data) => ({
    type: ADD_CUSER_SUCCESS,
    payload: data
})

export const editcUser = (user,history) => ({
    type: EDIT_CUSER,
    payload : { user,history }
})

export const editcUserFail = (data) => ({
    type: EDIT_CUSER_FAIL,
    payload: data
})

export const editcUserSuccess = (data) => ({
    type: EDIT_CUSER_SUCCESS,
    payload: data
})
export const setEditcUser = (data,history) => ({
    type : SET_EDIT_CUSER,
    payload : {data,history}
})

export const deletecUser = (user,history) => ({
    type: DELETE_CUSER,
    payload : { user,history }
})

export const deletecUserFail = (data) => ({
    type: DELETE_CUSER_FAIL,
    payload: data
})

export const deletecUserSuccess = (data) => ({
    type: DELETE_CUSER_SUCCESS,
    payload: data
})
export const resetUserNotifcation = () => ({
    type: RESET_USER_NOTIFICATION
})