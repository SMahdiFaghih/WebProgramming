const BASE_URL = "http://localhost:8080/admin";
const LS = window.localStorage;
let token = LS.getItem('Web._.Token');
let userId = LS.getItem('Web._.UserId');

function getUserInfo(){
  var myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Content-Type", "application/json");
  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };
  fetch(`${BASE_URL}/user/crud/${userId}`, requestOptions)
    .then(response => response.text())
    .then(result => JSON.parse(result))
    .then(data => {
      const container = document.getElementById('main');
      const div = document.createElement('div');
      div.innerHTML = `
      <div class="container-fluid">
      <strong>Name</strong>
      <div class="ml-3">${data.user.name}</div>
      <strong>Email</strong>
      <div class="ml-3">${data.user.email}</div>
     </div>`;
     container.appendChild(div);
    })
    .catch(error => {
      console.error('error', error);
      showError('Server Error!' + error.message);
  });
}


function showError(message){
  const errorToast = document.createElement('div');
  errorToast.innerHTML = `
  <div class="alert alert-danger alert-dismissible fade show" role="alert">
    <strong>Error!</strong> Server Error! ${message}
    <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button>
  </div>`;
  document.getElementById('alertContainer').appendChild(errorToast);
}
