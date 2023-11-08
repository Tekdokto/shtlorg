import { all } from 'redux-saga/effects';
import authSagas from './auth/authsaga';
import categorySagas from './categorymanagement/categorysaga';
import userSagas from './usermanagement/usersaga';
import cmsSagas from './cmsmanagement/cmssaga';
import subcategorySaga from './subcategorymanagement/subcategorysaga';

export default function* rootSaga(getState) {
  yield all([
    authSagas(),
    categorySagas(),
    userSagas(),
    cmsSagas(),
    subcategorySaga()
  ]);
}
