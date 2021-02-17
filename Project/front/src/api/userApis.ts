import { BASE_URL } from "../config/config";
import { EditUserPayload, EditUserRes, SigninPayload, SigninRes, SignupPayload, SignupRes } from "../types/user";

class UserApi{
    async signup(payload : SignupPayload){
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        return fetch(`${BASE_URL}/signup`, {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(payload),
            redirect: 'follow'
        })
        .then(response => response.text() as SignupRes)
    }

    async signin(payload: SigninPayload){
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        return fetch(`${BASE_URL}/signin`, {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(payload),
            redirect: 'follow'
        })
        .then(response => response.text() as SigninRes)
    }

    async editUser(payload: EditUserPayload){
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        return fetch(`${BASE_URL}/user/edit`, {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(payload),
            redirect: 'follow'
        })
        .then(response => response.text() as EditUserRes)
    }

}

export default UserApi;