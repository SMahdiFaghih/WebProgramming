const BASE_URL = "http://localhost:8000/api";

function getAllPosts(){
  console.log('hey im getting posts')
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
    .then(userPosts =>{
      userPosts.data.data.forEach(post => {
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
    .catch(error => console.log('error', error));
}
