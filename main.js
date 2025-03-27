const firstNameInput = document.getElementById('firstName');
const middleNameInput = document.getElementById('middleName');
const lastNameInput = document.getElementById('lastName');
const ageInput = document.getElementById('age');
const insertBtn = document.getElementById('insertBtn');
const clearBtn = document.getElementById('clearBtn');
const recordsTable = document.getElementById('recordsTable').getElementsByTagName('tbody')[0];
const tableHeaderRow = document.getElementById('tableHeaderRow');
const sortBySelect = document.getElementById('sortBy');
const sortOrderSelect = document.getElementById('sortOrder'); // New sort order select
const clearRecordsBtn = document.getElementById('clearRecordsBtn'); // Clear Records button
const saveToLocalBtn = document.getElementById('saveToLocal');

let records = [];

// Function to render the table
function renderTable() {
    recordsTable.innerHTML = '';
    
    if (records.length === 0) {
        const noRecordsRow = recordsTable.insertRow();
        const noRecordsCell = noRecordsRow.insertCell(0);
        noRecordsCell.colSpan = 5; // Span across all columns
        noRecordsCell.textContent = 'No records found';
        noRecordsCell.style.color = 'red'; // Set text color to red
        tableHeaderRow.style.display = 'none'; // Hide headers
        return; // Exit the function
    }
    
    tableHeaderRow.style.display = ''; // Show headers

    records.forEach((record, index) => {
        const row = recordsTable.insertRow();
        row.insertCell(0).textContent = record.firstName;
        row.insertCell(1).textContent = record.middleName;
        row.insertCell(2).textContent = record.lastName;
        row.insertCell(3).textContent = record.age;
        
        const actionCell = row.insertCell(4);
        actionCell.className = 'action-buttons';
        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = () => deleteRecord(index);
        
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.onclick = () => editRecord(index);
        
        actionCell.appendChild(deleteBtn);
        actionCell.appendChild(editBtn);
    });
}

// Function to add a record
function addRecord() {
    const firstName = firstNameInput.value.trim();
    const middleName = middleNameInput.value.trim();
    const lastName = lastNameInput.value.trim();
    const age = ageInput.value.trim();
    
    if (firstName && lastName && age) {
        records.push({
            firstName,
            middleName,
            lastName,
            age: parseInt(age)
        });

        saveToLocalStorage(); // Save to localStorage
        clearForm();
        renderTable();
    } else {
        alert('Please fill in all required fields (First Name, Last Name, and Age)');
    }
}

// Function to delete a record
function deleteRecord(index) {
    if (confirm('Are you sure you want to delete this record?')) {
        records.splice(index, 1);
        saveToLocalStorage(); // Save to localStorage after delete
        renderTable();
    }
}

// Function to edit a record
function editRecord(index) {
    const record = records[index];
    firstNameInput.value = record.firstName;
    middleNameInput.value = record.middleName;
    lastNameInput.value = record.lastName;
    ageInput.value = record.age;
    
    // Remove the record being edited
    records.splice(index, 1);
    saveToLocalStorage(); // Save to localStorage after edit
    renderTable();
}

// Function to clear the form
function clearForm() {
    firstNameInput.value = '';
    middleNameInput.value = '';
    lastNameInput.value = '';
    ageInput.value = '';
}

// Function to clear all records
function clearAllRecords() {
    if (confirm('Are you sure you want to clear all records?')) {
        records = []; // Clear the records array
        localStorage.removeItem('records'); // Clear local storage
        renderTable(); // Re-render the table
    }
}

// Function to sort records based on selected criteria and order
function sortRecords() {
    const sortBy = sortBySelect.value;
    const sortOrder = sortOrderSelect.value;

    if (sortBy && sortOrder) { // Only sort if valid options are selected
        records.sort((a, b) => {
            let comparison = 0;
            if (sortBy === 'age') {
                comparison = a[sortBy] - b[sortBy];
            } else {
                comparison = a[sortBy].localeCompare(b[sortBy]);
            }
            return sortOrder === 'asc' ? comparison : -comparison; // Reverse order for Z-A
        });
    }
    renderTable();
}

// Function to save records to local storage
function saveToLocalStorage() {
    localStorage.setItem('records', JSON.stringify(records)); // Save records to local storage
}

// Function to load records from local storage
function loadFromLocalStorage() {
    const savedRecords = localStorage.getItem('records');
    if (savedRecords) {
        records = JSON.parse(savedRecords);
        renderTable();
    }
}

// Event listeners
insertBtn.addEventListener('click', addRecord);
clearBtn.addEventListener('click', clearForm);
clearRecordsBtn.addEventListener('click', clearAllRecords); // Clear records on button click
sortBySelect.addEventListener('change', sortRecords); // Sort records on dropdown change
sortOrderSelect.addEventListener('change', sortRecords); // Sort records on dropdown change
saveToLocalBtn.addEventListener('click', saveToLocalStorage); // Save to local storage

// Initialize
loadFromLocalStorage(); // Load saved records on page load
renderTable();