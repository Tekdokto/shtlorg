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
    GET_MASTER_CATEGORY_FAIL,
    GET_MASTER_CATEGORY_SUCCESS
} from '../actionconstant';

export const getAllCategory = () => ({
    type : GET_MASTER_CATEGORY
})

export const listallCategoryFail = (data) => ({
    type : GET_MASTER_CATEGORY_FAIL,
    payload : data
})

export const listallCategorySuccess = (data) => ({
    type : GET_MASTER_CATEGORY_SUCCESS,
    payload : data
})

export const listCategory = (data,history) => ({
    type:LIST_CATEGORY,
    payload: {data,history}
})

export const listCategoryFail = (data) => ({
    type: LIST_CATEGORY_FAIL,
    payload: data
})

export const listCategorySuccess = (data) => ({
    type: LIST_CATEGORY_SUCCESS,
    payload: data
})

export const addCategory = (category,history) => ({
    type: ADD_CATEGORY,
    payload : { category,history }
})

export const addCategoryFail = (data) => ({
    type: ADD_CATEGORY_FAIL,
    payload: data
})

export const addCategorySuccess = (data) => ({
    type: ADD_CATEGORY_SUCCESS,
    payload: data
})

export const editCategory = (category,history) => ({
    type: EDIT_CATEGORY,
    payload : { category,history }
})

export const editCategoryFail = (data) => ({
    type: EDIT_CATEGORY_FAIL,
    payload: data
})

export const editCategorySuccess = (data) => ({
    type: EDIT_CATEGORY_SUCCESS,
    payload: data
})

export const deleteCategory = (category,history) => ({
    type: DELETE_CATEGORY,
    payload : { category,history }
})

export const deleteCategoryFail = (data) => ({
    type: DELETE_CATEGORY_FAIL,
    payload: data
})

export const deleteCategorySuccess = (data) => ({
    type: DELETE_CATEGORY_SUCCESS,
    payload: data
})

export const resetCategoryNotifcation = () => ({
    type: RESET_CATEGORY_NOTIFICATION
})