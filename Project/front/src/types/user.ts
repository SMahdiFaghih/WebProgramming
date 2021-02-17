export interface SignupPayload{
    email:string,
    username:string,
    password:string,
    role:UserType,
}

export type UserType = "lecturer" | "student"

export interface SignupRes{
    token: string
}

export interface SigninPayload{
    email:string,
    password:string
}

export interface SigninRes{
    token:string
}

export interface EditUserPayload{
    newUsername:string,
    newPassword:string
}

export interface EditUserRes{

}

export type GetUserRes = 
    {
    email: string
    username: string,
    role: string
    }[]