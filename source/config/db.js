var config = {
	host: 'shtudy.chx4xqzdd4t4.us-east-1.rds.amazonaws.com',
	user: 'proddbuser', // Database username
	password: 'NtL#by73aUu#p5JN6J#Fe', // Database password
	database: 'shtudy_prod', //database name
	port: '3306',
	multipleStatements: true, // allow multiple query execution at a time
	whichdb: "LOCAL" // which db it is i.e. local-live-staging
};
module.exports = config;
