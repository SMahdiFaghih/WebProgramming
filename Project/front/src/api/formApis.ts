import { BASE_URL } from "../config/config";
import { CloseFormPayload, CloseFormRes, CreateFormPayload, CreateFormRes, EditFormPayload, EditFormRes, GetAllFormsRes, GetFormByIDPayload, GetFormByIDRes, GetFormSubmitsPayload, GetFormSubmitsRes, GetRequestsPayload, GetRequestsRes, GetUserFormsRes, SearchFormsPayload, SubmitFormPayload, SubmitFormRes } from "../types/form";
import { getAuthHeader, getHeader, handleErrors } from "../Utils/api.utils";

class FormApi{
    async getAllForms(){
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        return fetch(`${BASE_URL}/form/all`, {
            method: 'GET',
            headers: getHeader(),
            redirect: 'follow'
        })
        .then(handleErrors)
        .then(response => response.text())
        .then(res=> JSON.parse(res) as GetAllFormsRes)
    }

    async getFormById(payload: GetFormByIDPayload){
        return fetch(`${BASE_URL}/form/emptyFormData`, {
            method: 'POST',
            headers: getAuthHeader(),
            body: JSON.stringify(payload),
            redirect: 'follow'
        })
        .then(handleErrors)
        .then(response => response.text())
        .then(res=> JSON.parse(res) as GetFormByIDRes)
    }

    async searchForms(payload: SearchFormsPayload){
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        return fetch(`${BASE_URL}/form/search`, {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(payload),
            redirect: 'follow'
        })
        .then(handleErrors)
        .then(response => response.text())
        .then(res=> JSON.parse(res) as GetAllFormsRes)
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

    async submitForm(payload: SubmitFormPayload){
        return fetch(`${BASE_URL}/form/send`, {
            method: 'POST',
            headers: getAuthHeader(),
            body: JSON.stringify(payload),
            redirect: 'follow'
        })
        .then(handleErrors)
        .then(response => response.text())
        .then(res=> JSON.parse(res) as SubmitFormRes)
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

    async getRequests(payload: GetRequestsPayload){
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        return fetch(`${BASE_URL}/form/filledFormData`, {
            method: 'POST',
            headers: getAuthHeader(),
            body: JSON.stringify(payload),
            redirect: 'follow'
        }) 
        .then(handleErrors)
        .then(response => response.text())
        .then(res=> JSON.parse(res) as GetRequestsRes)
    }
}

export default FormApi;