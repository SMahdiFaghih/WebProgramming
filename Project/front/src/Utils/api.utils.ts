export function getHeader(){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    return myHeaders;
}

export function getAuthHeader(){
    const token = localStorage.getItem('Token')
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);
    return myHeaders;
}

export function handleErrors(response:any) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}