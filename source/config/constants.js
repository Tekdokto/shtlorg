/* Constant values which are used through out app */
const USER_IMAGE_PATH = "/uploads/user/"; // user image path
const NO_IMAGE_PATH = "site/no_image.jpg"; // for showing no image where image is not avaialable
const DEFAULT_API_LANGUAGE = 'en'; // Declaring default language
const JWT_SECRET_KEY = "shtudyproject";//"jwtsecretkey";
const ADMIN_EMAIL = 'admin@shtudy.info';

module.exports = {
        APP_NAME: "Shtudy", // Aplication name
        MAIL_FROM: "noreply@shtudy.co", // Email id from mail has been sent
        USER_IMAGE_PATH: USER_IMAGE_PATH,
        NO_IMAGE_PATH: NO_IMAGE_PATH,
        PAGE_SIZE: 10,
        // SMTP Configurations
        SMTP: {
                 SMTP_EMAIL: "noreply@shtudy.co",
                 SMTP_PASSWORD: "95Y_+YRV3EzByK",
                 SMTP_HOST: "smtp.gmail.com",
                 SMTP_PORT: "587",
                 SMTP_FROM: "noreply@shtudy.co"
        },
        API_URL: 'https://shtudy-api.shtudy.io/',// app api url
        APP_URL : 'https://careers.shtudy.io/',
        COMPANY_APP_URL : 'https://company.shtudy.io/',
        ADMIN_URL : "https://admin.shtudy.io/",
        ADMIN_EMAIL : ADMIN_EMAIL,
        DEFAULT_API_LANGUAGE: DEFAULT_API_LANGUAGE,
        JWT_SECRET_KEY : JWT_SECRET_KEY,
        DEBUG_ERROR:false,
        ITEMS_PER_PAGE:10,
        FACEBOOK_CLIENT_ID:'sdfsafasdfsafsdfsagfdgdsgsf',
        FACEBOOK_CLIENT_SECRET:'adfasfdsafds',
        GOOGLE_CLIENT_ID:'dljdfgl',
        GOOGLE_CLIENT_SECRET:'dhgjyufh',
        TWITTER_CONSUMER_API_KEY:'fgjyuiyud5',
        TWITTER_CONSUMER_API_SECRET_KEY:'ghgfjhgkiuo89',
        APPLE_CLIENT_ID:'hlslel@gmail.com',
        APPLE_TEAM_ID:'lsjkdfgoirj',
        APPLE_KEY_ID:'skjfdghlrig8g',
        DO_NOT_REMIND_ME: 0, //this flag for do not remind me functionality enable or not 1=enable,2=disable
        IS_PASSWORD_CHANGED:1,//this is the value for DB insert into DB while signup user 0= need to reset password 1=not required to change. only set 0 if DO_NOT_REMIND_ME = 1 otherwise 1
        AUTO_LOGOUT:0, //0 =no,1=yes
        AUTO_LOGOUT_TIME: 1440, //In minutes if auto logout =1 then need to set time
        EXPERIENCE: {
                1: "Undergraduate Student",
                2: "Graduate Student",
                3: "Entry Level",
                4: "Mid-level",
                5: "Senior-Level"
        },
        EMPLOYMENT: {
                0: "Part time",
                1: "Full time",
        },
        COMPANY_SIZE: {
                1: "<10",
                2: "11-50",
                3: "51-100",
                4: "101-500",
                5: "500-1000",
                6: "1000+",
        },
        OFFER_ANY: {
                1: "Generous Vacation",
                2: "Free Food",
                3: "Gym/Fitness",
                4: "Travel",
                5: "Company retreats",
                6: "Happy Hours",
                7: "401k contribution",
                8: "Philanthropic contributions",
                9: "Team activities",
                10: "Health insurance",
                11: "Flexible hours",
              
        },
        RACIAL_IDENTITY: {
                1: "Hispanic or Latino",
                2: "Black or African American (Not Hispanic or Latino)",
                3: "Native American or Alaska Native (Not Hispanic or Latino)",
                4: "Native Hawaiian or Other Pacific Islander (Not Hispanic or Latino)",
                5: "Asian (Not Hispanic or Latino)",
                6: "White (Not Hispanic or Latino)",
                7: "Multi-Racial (Two or more races)"
        }

};
