const BASE_URL = "http://localhost:8000/api";

function register(){
  const formInputs = [].slice.call(document.getElementsByClassName('form-control'));
  let valid = true;
  payload = {}
  formInputs.forEach(i => {
    console.log(i)
    payload[i.id] = i.value;
    if(!i.value) valid = false;
  });
  if(!valid) return;
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  var raw = JSON.stringify(payload);
  var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};
fetch(`${BASE_URL}/signup`, requestOptions)
  .then(response => response.text())
  .then(result => JSON.parse(result))
  .then(data=>{
    saveToLS(data.token);
    window.location = "/";
  })
  .catch(error => console.error('error', error));
}


function routeTo(url){
  if(!url) return;
  window.location = url;
}

function login(){
  const formInputs = [].slice.call(document.getElementsByClassName('form-control'));
  let valid = true;
  payload = {}
  formInputs.forEach(i => {
    console.log(i)
    payload[i.id] = i.value;
    if(!i.value) valid = false;
  });
  if(!valid) return;
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  var raw = JSON.stringify(payload);
  var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};
fetch(`${BASE_URL}/signin`, requestOptions)
  .then(response => response.text())
  .then(result => JSON.parse(result))
  .then(data=>{
    console.log(data.data.user);
    saveToLS('Web._.Token',data.token);
    saveToLS('Web._.UserId', data.data.user._id)
    window.location = "/";
  })
  .catch(error => console.error('error', error));
}

function saveToLS(key, value){
  if(!key || !value) return;
  const LS = window.localStorage;
  LS.setItem(key, value);
}
