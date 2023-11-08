# Shtudy
NODE VERSION : v12.19
NPM VERSION : 6.14.8
NGINX VERSION : nginx/1.16.1

# Configuration
1) API:
Go to /config/constants.js file and edit required configuration like admin email, smtp details,api url, app url, company url, admin url and other
Go to /config/db.js file and edit required db configuration
Go to /shtudy-api.js file and change port if you are developing in local and if you required

2) Admin:
Go to /Admin/src/constants/defaultValues.js file and change api url to your api url

3) Company:
Go to /Company/src/constants/defaultValues.js file and change api url to your api url, APP_URL as company panel url, CANDIDATE_APP_URL as candidate panel url

4) Careers:
Go to /Student/src/constants/defaultValues.js file and change api url to your api url, APP_URL as candidate panel url, COMPANY_APP_URL as company panel url




# Dependencies Install
1) API:
Go to / root directory in terminal and install required module using command "npm install"
2) Admin:
Go to Admin/ directory in terminal and install required module using command "npm install"
3) Company:
Go to Company/ directory in terminal and install required module using command "npm install"
3) Company:
Go to Company/ directory in terminal and install required module using command "npm install"
4) Careers:
Go to Student/ directory in terminal and install required module using command "npm install"


# How to run all code(For local)
1) API:
Go to / root directory and run command "npm start" from terminal
2) admin:
Go to Admin/ directory and run command "npm start" from terminal
3) Company:
Go to Company/ directory and run command "npm start" from terminal
4) Careers:
Go to Student/ directory and run command "npm start" from terminal


# Deployment instructions
1) Admin:
Go to Admin/ directory and run command "npm run build"
It will generate new "build" directory in same Admin/ directory.
Upload whole "build" directory on server for admin panel.
2) Company:
Go to Company-frotend/ directory and run command "npm run build"
It will generate new "build" directory in same Company/ directory.
Upload whole "build" directory on server for Company.
3) Careers:
Go to Student-frotend/ directory and run command "npm run build"
It will generate new "build" directory in same Student/ directory.
Upload whole "build" directory on server for Student.
4) API
Upload api files directly to server

Now need to run the code with starting the server with PM2 service.
- set shtudy-api.js into pm2 service for API
- set ecosystem.config.js into pm2 for run admin,company and student panel 

# Shtudy LIVE Details:
1) Admin:
Url: https://admin.shtudy.io/
Port: 5080
Username: admin@shtudy.info

2) Company:
Url: https://company.shtudy.io/
Port: 5078

3) Careers:
Url: https://careers.shtudy.io/
Port: 5079

4) API:
Url: https://shtudy-api.shtudy.io/
Port: 5081


# DATABASE DETAILS:
Need to connect live DB with "Standart TCP over SSH" method
SSH Hostname: 34.202.185.3
SSH Username: ubuntu
SSH key file: attached shtudy-prod.pem in "Shtudy-AWS-Infrastructure-Setup-Details+key" directory
Mysql Host = shtudy.chx4xqzdd4t4.us-east-1.rds.amazonaws.com
Mysql Database name = shtudy_prod
Mysql Username = proddbuser
Mysql Password = NtL#by73aUu#p5JN6J#Fe


# Shtudy SMTP Details:
SMTP_EMAIL: "noreply@shtudy.co",
SMTP_PASSWORD: "95Y_+YRV3EzByK",
SMTP_HOST: "smtp.gmail.com",
SMTP_PORT: "587",
SMTP_FROM: "noreply@shtudy.co"

# Cron Configuration:
*/5 * * * * curl https://shtudy-api.shtudy.io/cron/student/updateexamresult
5 0 * * * curl https://shtudy-api.shtudy.io/cron/student/send_last_two_student

# AWS Server details:
Find the attached folder "Shtudy-AWS-Infrastructure-Setup-Details+key"
Find "Shtudy-AWS-Infrastructure-Setup-Detail.docx"
To open the doc file, use password "Intuzclisy"

