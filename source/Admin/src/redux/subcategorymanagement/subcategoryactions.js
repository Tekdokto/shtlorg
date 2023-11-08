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

export const listSubCategory = (data,history) => ({
    type:FETCH_SUBCATEGORY_MANAGEMENT,
    payload: {data,history}
})

export const listSubCategoryFail = (data) => ({
    type: FETCH_SUBCATEGORY_MANAGEMENT_FAIL,
    payload: data
})

export const listSubCategorySuccess = (data) => ({
    type: FETCH_SUBCATEGORY_MANAGEMENT_SUCCESS,
    payload: data
})

export const addSubCategory = (subcategory,history) => ({
    type: ADD_SUBCATEGORY,
    payload : { subcategory,history }
})

export const addSubCategoryFail = (data) => ({
    type: ADD_SUBCATEGORY_FAIL,
    payload: data
})

export const addSubCategorySuccess = (data) => ({
    type: ADD_SUBCATEGORY_SUCCESS,
    payload: data
})

export const editSubCategory = (subcategory,history) => ({
    type: UPDATE_SUBCATEGORY,
    payload : { subcategory,history }
})

export const editSubCategoryFail = (data) => ({
    type: UPDATE_SUBCATEGORY_FAIL,
    payload: data
})

export const editSubCategorySuccess = (data) => ({
    type: UPDATE_SUBCATEGORY_SUCCESS,
    payload: data
})

export const changeSubCategoryStatus = (data,history) => ({
    type: CHANGE_SUBCATEGORY_STATUS,
    payload : {data,history}
})

export const changeSubCategoryStatusFail = (data) => ({
    type: CHANGE_SUBCATEGORY_STATUS_FAIL,
    payload: data
})

export const changeSubCategoryStatusSuccess = (data) => ({
    type: CHANGE_SUBCATEGORY_STATUS_SUCCESS,
    payload: data
})

export const resetSubCategoryNotification = () => ({
    type: RESET_SUBCATEGORY_NOTIFICATION
})

