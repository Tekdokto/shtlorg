import { 
    REGISTER_USER,
    REGISTER_SUCCESSFULL,
    REGISTER_FAIL,
    LOGIN_USER,
    LOGIN_SUCCESSFULL,
    LOGIN_FAIL,
    LOGOUT_USER,
    RESET_NOTIFICATION,
    FORGOTPASSWORD_USER,
    FORGOTPASSWORD_SUCCESSFULL,
    FORGOTPASSWORD_FAIL,
    RESETPASSWORD_USER,
    RESETPASSWORD_SUCCESSFULL,
    RESETPASSWORD_FAIL,
    CHANGE_PASSWORD,
    CHANGE_PASSWORD_FAIL,
    CHANGE_PASSWORD_SUCCESSFULL,
    VALIDATETOKEN_USER,
    VALIDATETOKEN_SUCCESSFULL,
    VALIDATETOKEN_FAIL,
    DASHBOARD,
    DASHBOARD_SUCCESSFULL,
    DASHBOARD_FAIL,
    EDIT_ADMIN_PROFILE_FAIL,
    EDIT_ADMIN_PROFILE_SUCCESS,
    EDIT_ADMIN_PROFILE,
    SOCIAL_LOGIN_USER,
    SOCIAL_LOGIN_SUCCESSFULL,
    SOCIAL_LOGIN_FAIL,
    CHANGE_TIMESLOT,
    CHANGE_TIMESLOT_FAIL,
    CHANGE_TIMESLOT_SUCCESSFULL,
    GET_TIMESLOT,
    GET_TIMESLOT_FAIL,
    GET_TIMESLOT_SUCCESSFULL,
    GET_ALL_CITIES,
    GET_ALL_CITIES_SUCCESS,
    GET_ALL_SKILLS,
    GET_ALL_SKILLS_SUCCESS,
    FETCH_CAREER_PATH,
    FETCH_CAREER_PATH_FAIL,
    FETCH_CAREER_PATH_SUCCESSFULL
 } from '../actionconstant';


export const loginUser =(user,history)=>({
    type: LOGIN_USER,
    payload: { user,history }
})


export const loginSuccessfull =(user)=>({
    type: LOGIN_SUCCESSFULL,
    payload: user
})

export const loginFail =(data)=>({
    type: LOGIN_FAIL,
    payload: data 
})
export const registerUser =(user,history)=>({
    type: REGISTER_USER,
    payload: { user,history }
})
export const registerSuccessfull =(user)=>({
    type: REGISTER_SUCCESSFULL,
    payload: user
})

export const registerFail =(data)=>({
    type: REGISTER_FAIL,
    payload: data 
})
export const socialloginUser =(user,history)=>({
    type: SOCIAL_LOGIN_USER,
    payload: { user,history }
})

export const socialloginSuccessfull =(user)=>({
    type: SOCIAL_LOGIN_SUCCESSFULL,
    payload: user
})

export const socialloginFail =(data)=>({
    type: SOCIAL_LOGIN_FAIL,
    payload: data 
})

export const resetNotification=()=>({
    type:RESET_NOTIFICATION
})

export const logoutUser = (history) => ({
    type: LOGOUT_USER,
    payload : history
  });


export const forgotpasswordUser =(user,history)=>({
    type: FORGOTPASSWORD_USER,
    payload: { user,history }
})

export const forgotPasswordSuccessfull =(data)=>({
    type: FORGOTPASSWORD_SUCCESSFULL,
    payload: data
})

export const forgotPasswordFail =(data)=>({
    type: FORGOTPASSWORD_FAIL,
    payload: data 
})

export const changePassword = ( data,history ) => ({
    type : CHANGE_PASSWORD,
    payload: { data , history }
})

export const changePasswordSuccessfully = ( data ) => ({
    type : CHANGE_PASSWORD_SUCCESSFULL,
    payload:  data 
})

export const changePasswordFailed = ( data ) => ({
    type : CHANGE_PASSWORD_FAIL,
    payload:  data 
})

export const resetpasswordUser =(user,history)=>({
    type: RESETPASSWORD_USER,
    payload: { user,history }
})

export const resetPasswordSuccessfull =(data)=>({
    type: RESETPASSWORD_SUCCESSFULL,
    payload: data
})

export const resetPasswordFail =(data)=>({
    type: RESETPASSWORD_FAIL,
    payload: data 
})


export const validatetoken =(user,history)=>({
    type: VALIDATETOKEN_USER,
    payload: { user,history }
})

export const validatetokenSuccessfull =(data)=>({
    type: VALIDATETOKEN_SUCCESSFULL,
    payload: data
})

export const validatetokenFail =(data)=>({
    type: VALIDATETOKEN_FAIL,
    payload: data 
})

export const dashboard =(data,history)=>({
    type: DASHBOARD,
    payload: { data, history }
})

export const dashboardSuccessfull =(data)=>({
    type: DASHBOARD_SUCCESSFULL,
    payload: data
})

export const dashboardFail =(data)=>({
    type: DASHBOARD_FAIL,
    payload: data 
})

export const editAdminProfile =(user,history)=>({
    type: EDIT_ADMIN_PROFILE,
    payload: { user,history }
})

export const editAdminProfileSuccessfull =(user)=>({
    type: EDIT_ADMIN_PROFILE_SUCCESS,
    payload: user
})

export const editAdminProfileFail =(data)=>({
    type: EDIT_ADMIN_PROFILE_FAIL,
    payload: data 
})

export const changeTimeslot = ( data,history ) => ({
    type : CHANGE_TIMESLOT,
    payload: { data , history }
})

export const changeTimeslotSuccessfully = ( data ) => ({
    type : CHANGE_TIMESLOT_SUCCESSFULL,
    payload:  data 
})

export const changeTimeslotFailed = ( data ) => ({
    type : CHANGE_TIMESLOT_FAIL,
    payload:  data 
})
export const getTimeslot = ( data,history ) => ({
    type : GET_TIMESLOT,
    payload: { data , history }
})

export const getTimeslotSuccessfully = ( data ) => ({
    type : GET_TIMESLOT_SUCCESSFULL,
    payload:  data 
})

export const getTimeslotFailed = ( data ) => ({
    type : GET_TIMESLOT_FAIL,
    payload:  data 
})

export const getAllcities = () =>({
    type : GET_ALL_CITIES
})
export const getAllcitiesSuccess = (data) => ({
    type : GET_ALL_CITIES_SUCCESS,
    payload : data
})

export const getAllSkills = () =>({
    type : GET_ALL_SKILLS
})
export const getAllSkillsSuccess = (data) => ({
    type : GET_ALL_SKILLS_SUCCESS,
    payload : data
})

export const fetchCareerPath = () => ({
    type : FETCH_CAREER_PATH
})

export const fetchCareerPathSuccess = (data) => ({
    type : FETCH_CAREER_PATH_SUCCESSFULL,
    payload : data
})
export const fetchCareerPathFail = () => ({
    type : FETCH_CAREER_PATH_FAIL,
    payload : []
})