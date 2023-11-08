import { combineReducers } from 'redux';
import authReducer from './auth/authreducer';
import categoryReducer from './categorymanagement/categoryreducer';
import userReducer  from './usermanagement/userreducer';
import cmsReducer  from './cmsmanagement/cmsreducer';
import subcategory from './subcategorymanagement/subcategoryreducer';
import skillsReducer from './skills/skillsreducer';
import preperationReducer from './interviewpreperation/interviewpreperationreducer';

const reducers = combineReducers({
    authReducer,
    categoryReducer,
    userReducer,
    cmsReducer,
    subcategory,
    skillsReducer,
    preperationReducer
})

export default reducers;