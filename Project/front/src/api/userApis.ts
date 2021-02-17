import { responsiveFontSizes } from "@material-ui/core";
import { BASE_URL } from "../config/config";
import { EditUserPayload, EditUserRes, SigninPayload, SigninRes, SignupPayload, SignupRes } from "../types/user";
import { getHeader, handleErrors } from "../Utils/api.utils";

class UserApi{
    async signup(payload : SignupPayload){
        return fetch(`${BASE_URL}/signup`, {
            method: 'POST',
            headers: getHeader(),
            body: JSON.stringify(payload),
            redirect: 'follow'
        })
        .then(handleErrors)
        .then(response => response.text())
        .then(res=> JSON.parse(res) as SignupRes)
    }

    async signin(payload: SigninPayload){
        return fetch(`${BASE_URL}/signin`, {
            method: 'POST',
            headers: getHeader(),
            body: JSON.stringify(payload),
            redirect: 'follow'
        })
        .then(handleErrors)
        .then(response => response.text())
        .then(res=> JSON.parse(res) as SigninRes)
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