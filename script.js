const studentName = document.getElementById("studentName");
const sub1 = document.getElementById("sub1");
const sub2 = document.getElementById("sub2");
const sub3 = document.getElementById("sub3");
const sub4 = document.getElementById("sub4");
const addBtn = document.getElementById("addBtn");
const searchInput = document.getElementById("searchInput");

const studentTable = document.getElementById("studentTable");

const totalStudents = document.getElementById("totalStudents");
const highestMarks = document.getElementById("highestMarks");
const averageMarks = document.getElementById("averageMarks");

const studentDetail = document.getElementById("studentDetail");
const popup = document.getElementById("popup");
const closeBtn = document.querySelector(".close");

let students = JSON.parse(localStorage.getItem("students")) || [];

function exportCSV() {

    if(students.length===0){
        alert("No student data available!");
        return;
    }

    let csv = "Rank,Student Name,Maths,Science,English,Computer,Total,Percentage,Grade\n";

    let sortedStudents = [...students].sort((a,b)=>b.total-a.total);

    sortedStudents.forEach((student,index)=>{

        csv += `${index+1},${student.name},${student.m1},${student.m2},${student.m3},${student.m4},${student.total},${student.percent}%,${student.grade}\n`;

    });

    const blob = new Blob([csv], { type: "text/csv" });

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = "Student_Grade_Report.csv";

    a.click();

    window.URL.revokeObjectURL(url);

}



studentDetail.onclick = function () {
    popup.style.display = "flex";
}

closeBtn.onclick = function () {
    popup.style.display = "none";
}

window.onclick = function (event) {
    if (event.target == popup) {
        popup.style.display = "none";
    }
}




function getGrade(percent) {

    if (percent >= 90) return "A+";
    if (percent >= 80) return "A";
    if (percent >= 70) return "B+";
    if (percent >= 60) return "B";
    if (percent >= 50) return "C";
    if (percent >= 40) return "D";

    return "F";

}



function saveData() {

    localStorage.setItem("students", JSON.stringify(students));

}



function updateStats() {

    totalStudents.innerHTML = students.length;

    if (students.length == 0) {

        highestMarks.innerHTML = 0;
        averageMarks.innerHTML = 0;
        return;

    }

    let highest = Math.max(...students.map(s => s.total));

    highestMarks.innerHTML = highest;

    let sum = 0;

    students.forEach(student => {

        sum += student.total;

    });

    averageMarks.innerHTML = (sum / students.length).toFixed(2);

}


function displayStudents() {

    studentTable.innerHTML = "";

    students.sort((a, b) => b.total - a.total);

    let search = searchInput.value.toLowerCase();

    students.forEach((student, index) => {

        if (!student.name.toLowerCase().includes(search))
            return;

        let row = document.createElement("tr");

        if (index == 0)
            row.classList.add("rank1");

        else if (index == 1)
            row.classList.add("rank2");

        else if (index == 2)
            row.classList.add("rank3");

        row.innerHTML = `

        <td>${index + 1}</td>

        <td>${student.name}</td>

        <td>${student.m1}</td>

        <td>${student.m2}</td>

        <td>${student.m3}</td>

        <td>${student.m4}</td>

        <td>${student.total}</td>

        <td>${student.percent}%</td>

        <td>${student.grade}</td>

        <td>

        <button class="editBtn">Edit</button>

        <button class="deleteBtn">Delete</button>

        </td>

        `;


        row.querySelector(".deleteBtn").onclick = function () {

            if (confirm("Delete Student?")) {

                students.splice(index, 1);

                saveData();

                displayStudents();

            }

        };


        row.querySelector(".editBtn").onclick = function () {

            let name = prompt("Student Name", student.name);

            if (name == null) return;

            let m1 = Number(prompt("Maths", student.m1));
            let m2 = Number(prompt("Science", student.m2));
            let m3 = Number(prompt("English", student.m3));
            let m4 = Number(prompt("Computer", student.m4));

            let total = m1 + m2 + m3 + m4;

            let percent = (total / 4).toFixed(2);

            students[index] = {

                name,

                m1,

                m2,

                m3,

                m4,

                total,

                percent,

                grade: getGrade(percent)

            };

            saveData();

            displayStudents();

        };

        studentTable.appendChild(row);

    });

    updateStats();

}


function addStudent() {

    if (studentName.value.trim() == "") {

        alert("Enter Student Name");

        return;

    }

    let m1 = Number(sub1.value);
    let m2 = Number(sub2.value);
    let m3 = Number(sub3.value);
    let m4 = Number(sub4.value);

    if (

        m1 > 100 || m2 > 100 || m3 > 100 || m4 > 100 ||

        m1 < 0 || m2 < 0 || m3 < 0 || m4 < 0

    ) {

        alert("Marks should be between 0 and 100");

        return;

    }

    let total = m1 + m2 + m3 + m4;

    let percent = (total / 4).toFixed(2);

    students.push({

        name: studentName.value,

        m1,

        m2,

        m3,

        m4,

        total,

        percent,

        grade: getGrade(percent)

    });

    studentName.value = "";
    sub1.value = "";
    sub2.value = "";
    sub3.value = "";
    sub4.value = "";

    saveData();

    displayStudents();

}

addBtn.addEventListener("click", addStudent);

searchInput.addEventListener("keyup", displayStudents);

displayStudents();