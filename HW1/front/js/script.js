//set your centos server ip in here
const HOST_API = "http://172.20.10.6"
const firstNumberInput = document.getElementById("input1");
firstNumberInput.value = 0;
const secondNumberInput = document.getElementById("input2");
secondNumberInput.value = 0;
const sum = document.getElementById("sum");
sum.innerText = 0;
const lineNumberInput = document.getElementById("lineNumber");
lineNumberInput.value = 1;
const line = document.getElementById("line");
line.innerText = 'This is a line';
const errorMessage = document.getElementById('errorMessage');

function calculateSum(serverType) {
    const firstNumber = Number(firstNumberInput.value);
    const secondNumber = Number(secondNumberInput.value);
    sendRequest('POST', `${HOST_API}/${serverType}/sha256`, { firstNumber, secondNumber })
        .then(result => {
            if (!result) {
                showError();
                return;
            }
            sum.innerText = result.sum;
        })
}

function getLine(serverType) {
    const lineNumber = Number(lineNumberInput.value);
    sendRequest('GET', `${HOST_API}/${serverType}/write?lineNumber=${lineNumber}`)
        .then(result => {
            if (!result) {
                showError();
                return;
            }
            line.innerText = result.line;
        })
}

function showError(error) {
    $('#errorModal').modal('show');
    errorMessage.innerText = error || 'Seems like there has been a problem in connections'
}

function closeError() {
    $('#errorModal').modal('hide');
}

function sendRequest(type, url, payload) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
        method: type,
        headers: myHeaders,
        body: JSON.stringify(payload),
        redirect: 'follow'
    };
    return fetch(url, requestOptions)
        .then(response => response.text())
        .then(result => JSON.parse(result))
        .catch(error => {
            console.error(error);
            showError(error.errorMessage);
        });
}
