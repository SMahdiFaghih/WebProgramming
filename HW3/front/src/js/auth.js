const BASE_URL = "http://192.168.1.103/api";

function register(){
  const formInputs = [].slice.call(document.getElementsByClassName('form-control'));
  let valid = true;
  payload = {}
  formInputs.forEach(i => {
    payload[i.id] = i.value;
    if(!i.value) valid = false;
  });
  if(!valid){
    showWarning('please fill all fields');
    return;
  }
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
    saveToLS('Web._.Token',data.token);
    saveToLS('Web._.UserId', data.data.user._id);
    window.location = "/profile.html";
  })
  .catch(error => {
    console.error('error', error)
    showError('Server Error!' + error.message);
  }
  );
}

function login(){
  const formInputs = [].slice.call(document.getElementsByClassName('form-control'));
  let valid = true;
  payload = {}
  formInputs.forEach(i => {
    payload[i.id] = i.value;
    if(!i.value) valid = false;
  });
  if(!valid){
    showWarning('please fill all fields');
    return;
  }
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
    saveToLS('Web._.Token',data.token);
    saveToLS('Web._.UserId', data.data.user._id);
    window.location = "/profile.html";
  })
  .catch(error => {
    console.error('error', error)
    showError('Server Error!' + error.message);
  }
  );
}

function saveToLS(key, value){
  if(!key || !value) return;
  const LS = window.localStorage;
  LS.setItem(key, value);
}

function routeTo(url){
  if(!url) return;
  window.location = url;
}


function showError(message){
  const errorToast = document.createElement('div');
  errorToast.innerHTML = `
  <div class="alert alert-danger alert-dismissible fade show" role="alert">
    <strong>Error!</strong> ${message}
    <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button>
  </div>`;
  document.getElementById('alertContainer').appendChild(errorToast);
}


function showWarning(message){
  const errorToast = document.createElement('div');
  errorToast.innerHTML = `
  <div class="alert alert-warning alert-dismissible fade show" role="alert">
    <strong>Warning!</strong> ${message}
    <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button>
  </div>`;
  document.getElementById('alertContainer').appendChild(errorToast);
}

