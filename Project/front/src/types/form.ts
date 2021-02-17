export interface GetAllFormsRes {

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
    fields: EditFormField[]
}

export interface EditFormRes{
    
}

export interface EditFormField{
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
    formId:string,
}

export interface GetFormByIDRes{

}


export interface GetFormSubmitsPayload{
    formId:number,
}

export interface GetFormSubmitsRes{
    forms:[]
}