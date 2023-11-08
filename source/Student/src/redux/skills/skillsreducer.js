import {
    LIST_STUDENT_SKILL,
    LIST_STUDENT_SKILL_SUCCESS,
    ADD_STUDENT_SKILL,
    ADD_STUDENT_SKILL_SUCCESS,
    LIST_CAREER_PATH_SKILL_SUCCESS,
    LOGOUT_USER
} from "../actionconstant"

const initialState = {
    skill_list: [],
    career_path_skill_list : [],
    lastrefresh:''
}

const skillReducer = (state=initialState,action) => {
    if(action.type == LOGOUT_USER){
        // console.log("IN LOGOUT",action)
    }    
    switch(action.type){
        case LIST_STUDENT_SKILL_SUCCESS:
            return {
                ...state,
                skill_list : action.payload.data.data,
                lastrefresh : action.payload.data.lastrefresh
            }
        case LIST_CAREER_PATH_SKILL_SUCCESS:
            return {
                ...state,
                career_path_skill_list : action.payload.data.data
            }
        case LOGOUT_USER:
            // console.log("INSIDE LOGOUT")
            return {
                ...state,
                skill_list : [],
                career_path_skill_list : []
            }
        default:
            return {
                ...state
            }
    }
}
export default skillReducer;