import { BASE_URL } from "../config/config";
import { CloseFormPayload, CloseFormRes, CreateFormPayload, CreateFormRes, EditFormPayload, EditFormRes, GetAllFormsRes, GetFormByIDPayload, GetFormByIDRes, GetFormSubmitsPayload, GetFormSubmitsRes, GetUserFormsRes } from "../types/form";
import { EditUserPayload, EditUserRes } from "../types/user";
import { getAuthHeader, handleErrors } from "../Utils/api.utils";

class FormApi{
    async getAllForms(){
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        return fetch(`${BASE_URL}/form/all`, {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        })
        .then(response => response.text() as GetAllFormsRes)
    }

    async searchForms(payload: EditUserPayload){
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

    async getUserForms(){
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        return fetch(`${BASE_URL}/form/user`, {
            method: 'GET',
            headers: getAuthHeader(),
            redirect: 'follow'
        })
        .then(handleErrors)
        .then(response => response.text())
        .then(res=> JSON.parse(res) as GetUserFormsRes)
    }

    async closeForm(payload: CloseFormPayload){
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        return fetch(`${BASE_URL}/form/close`, {
            method: 'POST',
            headers: getAuthHeader(),
            body: JSON.stringify(payload),
            redirect: 'follow'
        }).then(handleErrors)
        .then(response => response.text())
        .then(res=> JSON.parse(res) as CloseFormRes)
    }

    async editForm(payload: EditFormPayload){
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        return fetch(`${BASE_URL}/form/edit`, {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(payload),
            redirect: 'follow'
        })
        .then(response => response.text() as EditFormRes)
    }

    async getFormById(payload: GetFormByIDPayload){
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        return fetch(`${BASE_URL}/form/emptyFormData`, {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(payload),
            redirect: 'follow'
        })
        .then(response => response.text() as GetFormByIDRes)
    }

    async createForm(payload: CreateFormPayload){
        return fetch(`${BASE_URL}/form/create`, {
            method: 'POST',
            headers: getAuthHeader(),
            body: JSON.stringify(payload),
            redirect: 'follow'
        })
        .then(handleErrors)
        .then(response => response.text())
        .then(res=> JSON.parse(res) as CreateFormRes)
    }

    async getFormSubmits(payload: GetFormSubmitsPayload){
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        return fetch(`${BASE_URL}/form/students`, {
            method: 'POST',
            headers: getAuthHeader(),
            body: JSON.stringify(payload),
            redirect: 'follow'
        }) 
        .then(handleErrors)
        .then(response => response.text())
        .then(res=> JSON.parse(res) as GetFormSubmitsRes)
    }
}

export default FormApi;