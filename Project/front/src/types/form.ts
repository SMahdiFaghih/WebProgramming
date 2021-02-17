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
    data: string
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

export interface GetFormSubmitsRes{
    forms:[]
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

export interface GetRequestsPayload{
    formId: number,
    student_email:string
}

export interface GetRequestsRes{
    formId: number,
    student_email:string
}

export interface  SearchFormsPayload{
    content: string
}