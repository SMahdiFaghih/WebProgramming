import { BASE_URL } from "../config/config";
import { CloseFormPayload, CloseFormRes, CreateFormPayload, CreateFormRes, EditFormPayload, EditFormRes, GetAllFormsRes, GetAllSubmitsPayload, GetAllSubmitsRes, GetFormByIDPayload, GetFormByIDRes, GetUserFormsRes } from "../types/form";
import { EditUserPayload, EditUserRes } from "../types/user";

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
            headers: myHeaders,
            redirect: 'follow'
        })
        .then(response => response.text() as GetUserFormsRes)
    }

    async closeForm(payload: CloseFormPayload){
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        return fetch(`${BASE_URL}/form/close`, {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(payload),
            redirect: 'follow'
        })
        .then(response => response.text() as CloseFormRes)
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
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        return fetch(`${BASE_URL}/form/create`, {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(payload),
            redirect: 'follow'
        })
        .then(response => response.text() as CreateFormRes)
    }

    async getAllSubmits(payload: GetAllSubmitsPayload){
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        return fetch(`${BASE_URL}/form/students`, {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(payload),
            redirect: 'follow'
        })
        .then(response => response.text() as GetAllSubmitsRes)
    }




    async resolveForm(payload: EditUserPayload){
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

    async sendForm(payload: EditUserPayload){
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

    async getRequestData(payload: EditUserPayload){
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

export default FormApi;