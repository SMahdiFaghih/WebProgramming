const BASE_URL = "http://localhost:8080/admin";
const LS = window.localStorage;
let userId = LS.getItem('Web._.Token');

function createPost(){
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
  myHeaders.append("Authorization", `Bearer ${userId}`);
  myHeaders.append("Content-Type", "application/json");
  var raw = JSON.stringify(payload);
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };
  fetch(`${BASE_URL}/post/crud`, requestOptions)
    .then(response => response.text())
    .then(result => JSON.parse(result))
    .then(data => {window.location = "/posts.html"})
    .catch(error => {
      console.error('error', error);
      showError('Server Error!' + error.message);
    }
    );
}



function getUserPosts(){
  var myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${userId}`);
  myHeaders.append("Content-Type", "application/json");
  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };
  fetch(`${BASE_URL}/post/crud`, requestOptions)
    .then(response => response.text())
    .then(result => JSON.parse(result))
    .then(userPosts =>{
      userPosts.posts.forEach(post => {
        const postContainer = document.getElementById('postsContainer');
        if(!postContainer) return;
        const postHTML = document.createElement('div');
        postHTML.className = "col-sm-6 col-lg-3";
        postHTML.innerHTML = `
          <div class="card text-white bg-primary">
            <div class="card-body card-body pb-0 d-flex justify-content-between align-items-start">
              <strong>
                ${post.title}
              </strong>
              <div class="btn-group">
                <button class="btn btn-transparent dropdown-toggle p-0" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <svg class="c-icon">
                    <use xlink:href="node_modules/@coreui/icons/sprites/free.svg#cil-pen"></use>
                  </svg>
                </button>
                <div class="dropdown-menu dropdown-menu-right">
                <button class="dropdown-item" data-toggle="modal" data-target="#editModal">Edit</button>
                <button class="dropdown-item" id="deletePost${post._id}">Delete</button>
                </div>
              </div>
            </div>
            <div class="mt-3 mx-3" style="height:70px;">
              ${post.content}
            </div>
          </div>
        </div>
        <div class="modal fade" id="editModal" tabindex="-1" role="dialog" aria-labelledby="editPost" aria-hidden="true">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="editLable">Edit Post</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <form>
                  <div class="form-group">
                    <label for="editPost${post._id}Title">Post New Title</label>
                    <input value="${post.title}" type="text" class="form-control" id="editPost${post._id}Title" placeholder="Title">
                  </div>
                  <div class="form-group">
                    <label for="editPost${post._id}Content">Post New Content</label>
                    <textarea value="${post.content}" class="form-control" id="editPost${post._id}Content" rows="10" placeholder="Write your text here"></textarea>
                  </div>
                </form>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" id="editPost${post._id}">Save</button>
              </div>
            </div>
          </div>
        `;
        postContainer.appendChild(postHTML);
        document.getElementById(`deletePost${post._id}`).onclick = ()=>{deletePost(post._id)}
        document.getElementById(`editPost${post._id}`).onclick = ()=>{editPost(post._id)}
        return userPosts;
      })
    })
    .catch(error => {
      console.error('error', error);
      showError('Server Error!' + error.message);
    }
    );
}



function editPost(id){
  if(!id){
    showWarning('something happened! please reload page')
    return;
  }
  const title = document.getElementById(`editPost${id}Title`).value;
  const content = document.getElementById(`editPost${id}Content`).value;
  if(!title || !content){
    showWarning('please fill all fields');
    return;
  }
  const payload = {title, content};
  var myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${userId}`);
  myHeaders.append("Content-Type", "application/json");
  var raw = JSON.stringify(payload);
  var requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };
  fetch(`${BASE_URL}/post/crud/${id}`, requestOptions)
    .then(response => response.text())
    .then(result => JSON.parse(result))
    .then(data => location.reload())
    .catch(error => {
      console.log('error', error);
      showError('Server Error!' + error.message)
      location.reload();
    });

}

function deletePost(id){
  if(!id) return;
  var myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${userId}`);
  myHeaders.append("Content-Type", "application/json");
  var requestOptions = {
    method: 'DELETE',
    headers: myHeaders,
    redirect: 'follow'
  };
  fetch(`${BASE_URL}/post/crud/${id}`, requestOptions)
    .then(response => response.text())
    .then(result => JSON.parse(result))
    .then(data => location.reload())
    .catch(error => {
      console.log('error', error);
      showError('Server Error!' + error.message)
      location.reload();
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


function showWarning(message){
  const errorToast = document.createElement('div');
  errorToast.innerHTML = `
  <div class="alert alert-warning alert-dismissible fade show" role="alert">
    <strong>Warning!</strong> ${message}
    <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button>
  </div>`;
  document.getElementById('alertContainer').appendChild(errorToast);
}

