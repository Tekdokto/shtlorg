import { combineReducers } from 'redux';
import authReducer from './auth/authreducer';
import categoryReducer from './categorymanagement/categoryreducer';
import userReducer  from './usermanagement/userreducer';
import cmsReducer  from './cmsmanagement/cmsreducer';
import subcategory from './subcategorymanagement/subcategoryreducer';

const reducers = combineReducers({
    authReducer,
    categoryReducer,
    userReducer,
    cmsReducer,
    subcategory 
})

export default reducers;