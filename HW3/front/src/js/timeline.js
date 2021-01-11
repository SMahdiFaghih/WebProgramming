const BASE_URL = "http://localhost:8000/api";
const LS = window.localStorage;
const isLoggedIn = LS.getItem('Web._.Token') !== null;
initHeader();
getAllPosts();


function initHeader(){
  const header = document.getElementById('header');
  const div = document.createElement('div');
  div.innerHTML = isLoggedIn?
  `<li class="c-header-nav-item dropdown">
  <a class="c-header-nav-link" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">
  <div class="c-avatar">
    <svg class="c-icon mr-2">
      <use xlink:href="node_modules/@coreui/icons/sprites/free.svg#cil-user"></use>
    </svg>
  </a>
  <div class="dropdown-menu dropdown-menu-right pt-0">
    <a class="dropdown-item" href="posts.html">
      <svg class="c-icon mr-2">
        <use xlink:href="node_modules/@coreui/icons/sprites/free.svg#cil"></use>
      </svg>Dashboard</a>
  </div>
  </li>`
  :
  `<li class="c-header-nav-item dropdown">
  <a class="c-header-nav-link" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">
  <div class="c-avatar">
    <svg class="c-icon mr-2">
      <use xlink:href="node_modules/@coreui/icons/sprites/free.svg#cil-user"></use>
    </svg>
  </a>
  <div class="dropdown-menu dropdown-menu-right pt-0">
    <a class="dropdown-item" href="login.html">
      <svg class="c-icon mr-2">
        <use xlink:href="node_modules/@coreui/icons/sprites/free.svg#cil"></use>
      </svg>Sign In</a>
    <a class="dropdown-item" href="register.html">
        <svg class="c-icon mr-2">
          <use xlink:href="node_modules/@coreui/icons/sprites/free.svg#cil"></use>
        </svg>Sign Up</a>
  </div>
  </li>`
  header.appendChild(div);
}

function getAllPosts(){
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };
  fetch(`${BASE_URL}/post/`, requestOptions)
    .then(response => response.text())
    .then(result => JSON.parse(result))
    .then(userPosts => {
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
            </div>
            <div class="mt-3 mx-3" style="height:70px;">
              ${post.content}
            </div>
          </div>
        </div>
        `;
        postContainer.appendChild(postHTML);
        return userPosts;
      })
    })
    .catch(error => {
      console.error(error);
      showError('Server Error!' + error.message);
    });
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

