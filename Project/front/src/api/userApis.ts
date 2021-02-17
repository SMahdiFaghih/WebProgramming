import { BASE_URL } from "../config/config";
import { EditUserPayload, EditUserRes, GetUserRes, SigninPayload, SigninRes, SignupPayload, SignupRes } from "../types/user";
import { getAuthHeader, getHeader, handleErrors } from "../Utils/api.utils";

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
        return fetch(`${BASE_URL}/user/edit`, {
            method: 'POST',
            headers: getAuthHeader(),
            body: JSON.stringify(payload),
            redirect: 'follow'
        })
        .then(handleErrors)
        .then(response => response.text())
        .then(res=> JSON.parse(res) as EditUserRes)
    }

    async getUser(){
        return fetch(`${BASE_URL}/user/getUserData`, {
            method: 'GET',
            headers: getAuthHeader(),
            redirect: 'follow'
        })
        .then(handleErrors)
        .then(response => response.text())
        .then(res=> JSON.parse(res) as GetUserRes)
    }

}

export default UserApi;