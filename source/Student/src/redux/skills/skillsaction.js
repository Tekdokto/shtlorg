import {
    LIST_STUDENT_SKILL,
    LIST_STUDENT_SKILL_SUCCESS,
    LIST_CAREER_PATH_SKILL,
    LIST_CAREER_PATH_SKILL_SUCCESS,
    ADD_STUDENT_SKILL,
    ADD_STUDENT_SKILL_SUCCESS,
    CHANGE_STUDENT_SKILL_STATUS
} from "../actionconstant";


export const listStudent = (data,history) => ({
    type : LIST_STUDENT_SKILL,
    payload: {data,history}
})

export const listStudentSuccess = (data) => ({
    type : LIST_STUDENT_SKILL_SUCCESS,
    payload : data
})

export const changeStudentSillStatus = (data,history) => ({
    type : CHANGE_STUDENT_SKILL_STATUS,
    payload : {data,history}
})

export const listCareerPathSkill = (data,history) => ({
    type : LIST_CAREER_PATH_SKILL,
    payload: {data,history}
})

export const listCareerPathSuccess = (data) => ({
    type : LIST_CAREER_PATH_SKILL_SUCCESS,
    payload : data
})

export const addStudentSkill = (data,history) => ({
    type : ADD_STUDENT_SKILL,
    payload : {data,history}
})

export const addStudentSkillSuccess = (data) => ({
    type : ADD_STUDENT_SKILL_SUCCESS,
    payload : data
})