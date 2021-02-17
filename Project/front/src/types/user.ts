export interface SignupPayload{
    email:string,
    username:string,
    password:string,
    role:UserType,
}

export type UserType = "lecturer" | "student"

export interface SignupRes{

}

export interface SigninPayload{
    email:string,
    password:string
}

export interface SigninRes{

}

export interface EditUserPayload{
    newUsername:string,
    newPassword:string
}

export interface EditUserRes{

}