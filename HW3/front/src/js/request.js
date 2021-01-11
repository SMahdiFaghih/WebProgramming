const BASE_URL = "http://localhost:3000/api";

export async function sendRequest(type, url, payload) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  var requestOptions = {
      method: type,
      headers: myHeaders,
      body: JSON.stringify(payload),
      redirect: 'follow'
  };
  return fetch(`${BASE_URL}/${url}`, requestOptions)
      .then(response => response.text())
      .then(result => JSON.parse(result))
      .catch(error => {
          showError(error);
      });
}

