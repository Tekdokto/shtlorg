export default function authHeader() {
    // return authorization header with jwt token
    let user = JSON.parse(localStorage.getItem('user'));
    // console.log("user",user)
    if (user && user.token) {
        // console.log("user",user,user.token)
        // console.log("che")
        return true;
       // return { 'Authorization': 'Bearer ' + user.token };
    } else {
        // console.log("nathi")
        return false;
    }
}