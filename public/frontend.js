document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('student-form');
  const studentTable = document.getElementById('student-table'); // Change to a table element

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const surname = document.getElementById('surname').value;
    const rollno = document.getElementById('rollno').value;
    const city = document.getElementById('city').value;

    // Your fetch request and other code here...

    fetch('<local host of client>/add-student', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, surname, rollno, city }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          form.reset();
          alert('Student added successfully.');
          // After adding the student, refresh the student table.
          populateStudentTable(); // Call the function to populate the table
        }
      })
      .catch((error) => {
        console.error('Error adding student:', error);
      });
  });

  // Function to create a table row for a student
  
  function createStudentRow(student) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${student.name}</td>
      <td>${student.surname}</td>
      <td>${student.rollno}</td>
      <td>${student.city}</td>
      <td>
        <button class="delete-button">Delete</button>
        <button class="update-button">Edit</button>
      </td>
    `;
    console.log(student.id);
    return row;
  }

  // Function to populate the table with student data
  function populateStudentTable() {
    fetch('<local host of client>/students')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((students) => {
        const tableBody = studentTable.querySelector('tbody');
        tableBody.innerHTML = ''; // Clear the table body

        students.forEach((student) => {
          const row = createStudentRow(student);
          tableBody.appendChild(row);
        });
      })
      .catch((error) => {
        console.error('Error fetching student data:', error);
      });
  }

  // Call the function to initially populate the table
  populateStudentTable();








// Add event listeners for delete and update buttons
  studentTable.querySelector('tbody').addEventListener('click', (event) => {
  const target = event.target;
  if (target.classList.contains('delete-button')) {
    const row = target.closest('tr');
    const studentId = row.querySelector('td:nth-child(3)').textContent; // Assuming the ID is in the 3rd column

    // Make a DELETE request to the server to delete the student
    fetch(`<local host of client>/delete-student/${studentId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          // Remove the corresponding row from the table on success
          row.remove();
          console.log("studentId =", studentId);
        } else {
          throw new Error('Network response was not ok');
        }
      })
      .catch((error) => {
        console.error('Error deleting student:', error);
      });
  } 




});


// Event listener for edit buttons
document.querySelector('#student-table tbody').addEventListener('click', (event) => {
  const target = event.target;
  if (target.classList.contains('update-button')) {
    // Get the table row
    const row = target.closest('tr');

    // Get the cells in the row
    const nameCell = row.cells[0];
    const surnameCell = row.cells[1];
    const rollnoCell = row.cells[2];
    const cityCell = row.cells[3];

    // Create input fields for editing
    const nameInput = document.createElement('input');
    nameInput.value = nameCell.textContent;

    const surnameInput = document.createElement('input');
    surnameInput.value = surnameCell.textContent;

    const rollnoInput = document.createElement('input');
    rollnoInput.value = rollnoCell.textContent;

    const cityInput = document.createElement('input');
    cityInput.value = cityCell.textContent;

    // Replace the cell content with input fields
    nameCell.innerHTML = '';
    nameCell.appendChild(nameInput);

    surnameCell.innerHTML = '';
    surnameCell.appendChild(surnameInput);

    rollnoCell.innerHTML = '';
    rollnoCell.appendChild(rollnoInput);

    cityCell.innerHTML = '';
    cityCell.appendChild(cityInput);

    // Change the "Edit" button to a "Save" button
    target.textContent = 'Save';

    // Add a click event listener for the "Save" button
    target.classList.remove('update-button');
    target.classList.add('save-button');

    target.addEventListener('click', () => {
      // Create an object with the updated data
      const updatedData = {
        name: nameInput.value,
        surname: surnameInput.value,
        rollno: rollnoInput.value,
        city: cityInput.value,
      };

      // Make a PUT request to the server to update the student
      console.log("student id in put = ",updatedData.rollno);
      fetch(`<local host of client>/update-student/${updatedData.rollno}`, {
        method:'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      })
        .then((response) => {
          if (response.ok) {
            // Update the client-side table with the edited values
            nameCell.textContent = updatedData.name;
            surnameCell.textContent = updatedData.surname;
            rollnoCell.textContent = updatedData.rollno;
            cityCell.textContent = updatedData.city;

            // Change the "Save" button back to "Edit"
            target.textContent = 'Edit';
            target.classList.remove('save-button');
            target.classList.add('update-button');
          } else {
            throw new Error('Network response was not ok');
          }
        })
        .catch((error) => {
          console.error('Error updating student:', error);
        });
    });
  }
});



});
