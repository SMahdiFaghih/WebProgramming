export interface GetAllFormsRes {

};

export interface GetUserFormsRes {

};

export interface Form{

}

export interface CloseFormPayload{
    formId:string
}

export interface CloseFormRes{

}

export interface EditFormPayload{
    formId:string,
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
    required: boolean,
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


export interface GetAllSubmitsPayload{
    formId:string,
}

export interface GetAllSubmitsRes{

}