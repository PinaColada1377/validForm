const submit = document.getElementById('sub');
// читаю значения у текущей ссылки и достаю значения
const currentURL = window.location.href;
const [url, params] = currentURL.split('?');
const searchParams = new URLSearchParams(params);
let values = [];
for (let value of searchParams) {
    values.push(value); 
};

    document.getElementById('FName').value = values[0][1];
    document.getElementById('LName').value = values[1][1];
    document.getElementById('Email').value = values[2][1];


submit.addEventListener('click', (event) => {
    event.preventDefault();
    // по клику беру значения у всех value
    const fName = document.getElementById('FName').value;
    const lName = document.getElementById('LName').value;
    const email = document.getElementById('Email').value;
    const phone = document.getElementById('Phone').value;
    
    let formData = {};

    const sex = function () {
        const male = document.getElementById('Male');
        const female = document.getElementById('Female');
        if (male.checked){return male.value}
        else {return female.value}
    }
    
    const skills = function () {
        let selectedCheckedSkills = document.querySelectorAll('input.checkbox:checked');
        let checkedSkills = Array.from(selectedCheckedSkills).map(cb => cb.value);
        return checkedSkills;
    }

    const depValue = document.getElementById('months');
    const department = depValue.options[depValue.selectedIndex].value;

    //простая проверка на то, заполнены ли все поля
    if (fName == '' || lName == '' || email == '' || phone == '' || sex() == '' || skills() == '' || department == ''){
        submit.innerHTML = "<p style = 'color: red'>Заполните все поля</p>"
        return false
    } else {
        submit.innerHTML = "<p style = 'color: green'>Всё хорошо</p>";
    }

    // заношу значения в объект
    formData["FName"] = fName;
    formData["LName"] = lName;
    formData["Email"] = email;
    formData["Phone"] = phone;
    formData["Sex"] = sex();
    formData["Skills"] = skills();
    formData["Department"] = department; 

    console.log(formData);

    const hostName = 'localhost';
    const port = '3000';
    // создаю запрос исходя из значений    
    const str = Object.keys(formData)
        .map(key => [key, formData[key]])
        .map(([key, val]) => [key, Array.isArray(val) ? val.join('|') : val])
        .map(([key, val]) => key.concat('=').concat(val))
        .join('&');
    let requestURL =`http://${hostName}:${port}/index.html`+ '?' + str; //можно добавить ещё UTF-8 кодировку символа (`?${encodeURI(str)}`)

    /*или так
    const requestURL = new URLSearchParams(formData);
    console.log(requestURL.toString())*/

    // делаю POST запрос
    function sendRequest(method, url, formData = null){
        const headers ={
            'Content-Type': 'application/json'
        }
        return fetch (url, {
            method: method,
            formData: JSON.stringify(formData),
            headers: headers
        }).then(response => {
            if (response.ok){
                return response.json();
            }

            return response.json().then(error =>{
                const e = new Error('Ошибка');
                e.data = error;
                throw e;
            })
        })
    }
        
    sendRequest('POST', requestURL, formData)
        .then(data => console.log(data))
        .catch(err => console.log(err))    
});


