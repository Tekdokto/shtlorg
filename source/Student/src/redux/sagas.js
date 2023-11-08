import { all } from 'redux-saga/effects';
import authSagas from './auth/authsaga';
import categorySagas from './categorymanagement/categorysaga';
import userSagas from './usermanagement/usersaga';
import cmsSagas from './cmsmanagement/cmssaga';
import subcategorySaga from './subcategorymanagement/subcategorysaga';
import skillsSagas from './skills/skillssaga';
import interviewPreperationSagas from './interviewpreperation/interviewpreperationsaga';

export default function* rootSaga(getState) {
  yield all([
    authSagas(),
    categorySagas(),
    userSagas(),
    cmsSagas(),
    subcategorySaga(),
    skillsSagas(),
    interviewPreperationSagas()
  ]);
}
