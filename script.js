import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js';
import { getDatabase, ref, onValue, set } from 'https://www.gstatic.com/firebasejs/9.6.0/firebase-database.js';

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCbhQ7q4xiwDlc4QN81-Xp8RvHKKHpDu20",
    authDomain: "fir-start-df66f.firebaseapp.com",
    databaseURL: "https://fir-start-df66f-default-rtdb.firebaseio.com",
    projectId: "fir-start-df66f",
    storageBucket: "fir-start-df66f.appspot.com",
    messagingSenderId: "367950942282",
    appId: "1:367950942282:web:f8b41912d6ad6d006896b3",
    measurementId: "G-SN652T91ER"
};

const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);

export function handleButtonClick(buttonText) {
    const path = '/writeCommand'; // Change this path accordingly
    const data = buttonText;
    writeToFirebase(path, data);

    setTimeout(() => {
        writeToFirebase(path, null);
    }, 2000);
}

// Function to write data to Firebase
function writeToFirebase(path, data) {
    const dataRef = ref(database, path);
    return set(dataRef, data);
}



// Fetch and display data
const dataTable = document.getElementById('data-table');
const dataMap = new Map();

function fetchData() {
    const meters = ['meter1', 'meter2', 'meter3', 'meter4'];

    meters.forEach((meter) => {
        const dataRef = ref(database, `/${meter}_data`);

        onValue(dataRef, (snapshot) => {
            const data = snapshot.val();
            dataMap.set(meter, data);
            populateTable();
        });
    });
}

function populateTable() {
    const tbody = dataTable.querySelector('tbody');
    tbody.innerHTML = ''; // Clear existing rows

    const parameters = Array.from(dataMap.values())
        .map(data => Object.keys(data))
        .flat()
        .filter((value, index, self) => self.indexOf(value) === index);

    for (const parameter of parameters) {
        const row = document.createElement('tr');
        const parameterCell = document.createElement('td');
        parameterCell.textContent = parameter;
        row.appendChild(parameterCell);

        for (const [meter, data] of dataMap) {
            const valuesCell = document.createElement('td');
            valuesCell.textContent = Array.isArray(data[parameter]) ? data[parameter].join(', ') : data[parameter];
            row.appendChild(valuesCell);
        }

        tbody.appendChild(row);
    }
}

// Initial data fetch
fetchData();

// Function to authenticate
export function authenticate() {
    const passwordInput = document.getElementById('password');
    const loginContainer = document.getElementById('login-container');
    const appContainer = document.getElementById('app-container');

    const enteredPassword = passwordInput.value;

    // Fetch the correct password from Firebase
    const passwordRef = ref(database, '/sem_password');
    onValue(passwordRef, (snapshot) => {
        const correctPassword = snapshot.val();

        if (enteredPassword === correctPassword) {
            // Correct password, show the app
            loginContainer.style.display = 'none';
            appContainer.style.display = 'block';
            fetchData(); // Fetch data when authenticated
        } else {
            // Incorrect password, show an error
            alert('Incorrect password. Please try again.');
        }
    });
}
