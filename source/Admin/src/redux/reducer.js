import { combineReducers } from 'redux';
import authReducer from './auth/authreducer';
import categoryReducer from './categorymanagement/categoryreducer';
import userReducer  from './usermanagement/userreducer';
import videoReducer  from './videomanagement/videoreducer';
import cmsReducer  from './cmsmanagement/cmsreducer';
import subcategory from './subcategorymanagement/subcategoryreducer';
import mockinterviewReducer from './mockinterviewmanagement/mockinterviewreducer';

const reducers = combineReducers({
    authReducer,
    categoryReducer,
    userReducer,
    cmsReducer,
    subcategory,
    videoReducer,
    mockinterviewReducer
})

export default reducers;