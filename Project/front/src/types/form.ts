import { types } from "util"

export interface GetAllFormsRes {
    forms: FormData[]
};  

export interface GetUserFormsRes {
    forms : FormData[]
};

export interface FormData{
    title: string,
    description: string,
    form_id: number,
    lecturer_email: string,
    status: string,
    student_emai?:string,
    result:string
}

export interface Form{

}

export interface CloseFormPayload{
    formId: number,
}

export interface CloseFormRes{

}

export interface EditFormPayload{
    formId:number,
    fields: FormFieldData[]
}

export interface EditFormRes{
    
}

export interface FormFieldData{
    field_name: string,
    data: string,
    id:number
}

export interface CreateFormPayload{
    formContent:FormContent
}

export interface FormContent{
    title: string,
    description: string,
    fields:FormField[]
}

export interface FormField{
    id: number,
    field_name:string,
    required: boolean | number,
    type: FormFieldType,
    checklist_options?: string
}

export type FormFieldType = "TextField" | "CheckList"

export interface CreateFormRes{

}

export interface GetFormByIDPayload{
    formId:number,
}

export interface GetFormByIDRes{
    formContent:{
        description: string
        form_id: number
        lecturer_email: string
        status: "Open" | "Closed"
        title: string
    },
    fields: FormField[]
}


export interface GetFormSubmitsPayload{
    formId:number,
}

export interface GetFormSubmitsRes {
    forms:Request[]
}

export interface Request{
    form_id:number,
    result:string,
    student_email:string
}


export interface FormSubmitState extends FormContent{
    email:string
}

export interface SubmitFormPayload{
    formId:number,
    fields: FormFieldData[]
}

export interface SubmitFormRes{

}

export interface GetRequestDataPayload{
    formId: number,
    student_email:string
}

export interface GetRequestDataRes{
    formContent:{
        form_id:number,
        student_email:string,
        field_name:string,
        data:string,
        id:number,
    }[]
}

export interface  SearchFormsPayload{
    content: string
}

export interface ResolveRequestsPayload{
    formId: number,
    student_email:string,
    result:"Accepted" | "Rejected"
}

export interface ResolveRequestsRes{

}