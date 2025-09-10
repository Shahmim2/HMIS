let patients = JSON.parse(localStorage.getItem("patients")) || [];
let doctors = JSON.parse(localStorage.getItem("doctors")) || [];
let appointments = JSON.parse(localStorage.getItem("appointments")) || [];
let bills = JSON.parse(localStorage.getItem("bills")) || [];

// ---------- AUTH ----------
function login() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;
  if (user === "admin" && pass === "admin") {
    document.getElementById("loginScreen").style.display = "none";
    document.getElementById("appScreen").style.display = "block";
    renderAll();
  } else {
    alert("Invalid credentials. Use admin/admin.");
  }
}

function logout() {
  document.getElementById("loginScreen").style.display = "block";
  document.getElementById("appScreen").style.display = "none";
}

// ---------- PATIENTS ----------
function addPatient() {
  const name = document.getElementById("patientName").value;
  const age = document.getElementById("patientAge").value;
  const gender = document.getElementById("patientGender").value;

  if (!name || !age || !gender) {
    alert("Fill all fields");
    return;
  }

  const id = "P" + (patients.length + 1);
  const patient = { id, name, age, gender };
  patients.push(patient);
  localStorage.setItem("patients", JSON.stringify(patients));
  renderPatients();
  updateDropdowns();
  updateStats();
}

function renderPatients() {
  const tbody = document.querySelector("#patientsTable tbody");
  tbody.innerHTML = "";
  patients.forEach((p, i) => {
    tbody.innerHTML += `<tr>
      <td>${p.id}</td><td>${p.name}</td><td>${p.age}</td><td>${p.gender}</td>
      <td><button onclick="deletePatient(${i})">Delete</button></td>
    </tr>`;
  });
}

function deletePatient(index) {
  patients.splice(index, 1);
  localStorage.setItem("patients", JSON.stringify(patients));
  renderPatients();
  updateDropdowns();
  updateStats();
}

// ---------- DOCTORS ----------
function addDoctor() {
  const name = document.getElementById("doctorName").value;
  const specialty = document.getElementById("doctorSpecialty").value;

  if (!name || !specialty) {
    alert("Fill all fields");
    return;
  }

  const id = "D" + (doctors.length + 1);
  const doctor = { id, name, specialty };
  doctors.push(doctor);
  localStorage.setItem("doctors", JSON.stringify(doctors));
  renderDoctors();
  updateDropdowns();
  updateStats();
}

function renderDoctors() {
  const tbody = document.querySelector("#doctorsTable tbody");
  tbody.innerHTML = "";
  doctors.forEach(d => {
    tbody.innerHTML += `<tr>
      <td>${d.id}</td><td>${d.name}</td><td>${d.specialty}</td>
    </tr>`;
  });
}

// ---------- APPOINTMENTS ----------
function addAppointment() {
  const patientId = document.getElementById("appointmentPatient").value;
  const doctorId = document.getElementById("appointmentDoctor").value;
  const date = document.getElementById("appointmentDate").value;
  const time = document.getElementById("appointmentTime").value;

  if (!patientId || !doctorId || !date || !time) {
    alert("Fill all fields");
    return;
  }

  const id = "A" + (appointments.length + 1);
  const appointment = { id, patientId, doctorId, date, time };
  appointments.push(appointment);
  localStorage.setItem("appointments", JSON.stringify(appointments));
  renderAppointments();
  updateStats();
}

function renderAppointments() {
  const tbody = document.querySelector("#appointmentsTable tbody");
  tbody.innerHTML = "";
  appointments.forEach(a => {
    const patient = patients.find(p => p.id === a.patientId)?.name || "Unknown";
    const doctor = doctors.find(d => d.id === a.doctorId)?.name || "Unknown";
    tbody.innerHTML += `<tr>
      <td>${a.id}</td><td>${patient}</td><td>${doctor}</td><td>${a.date}</td><td>${a.time}</td>
    </tr>`;
  });
}

// ---------- BILLS ----------
function addBill() {
  const patientId = document.getElementById("billPatient").value;
  const amount = parseFloat(document.getElementById("billAmount").value);

  if (!patientId || !amount) {
    alert("Fill all fields");
    return;
  }

  const id = "B" + (bills.length + 1);
  const bill = { id, patientId, amount };
  bills.push(bill);
  localStorage.setItem("bills", JSON.stringify(bills));
  renderBills();
  updateStats();
}

function renderBills() {
  const tbody = document.querySelector("#billsTable tbody");
  tbody.innerHTML = "";
  bills.forEach(b => {
    const patient = patients.find(p => p.id === b.patientId)?.name || "Unknown";
    tbody.innerHTML += `<tr>
      <td>${b.id}</td><td>${patient}</td><td>${b.amount}</td>
    </tr>`;
  });
}

// ---------- REPORTS ----------
function generateReport() {
  const type = document.getElementById("reportType").value;
  const reportArea = document.getElementById("reportArea");
  let html = "";

  if (type === "patients") {
    html = "<h3>Patients Report</h3><table><tr><th>ID</th><th>Name</th><th>Age</th><th>Gender</th></tr>";
    patients.forEach(p => {
      html += `<tr><td>${p.id}</td><td>${p.name}</td><td>${p.age}</td><td>${p.gender}</td></tr>`;
    });
    html += "</table>";
  }

  if (type === "doctors") {
    html = "<h3>Doctors Report</h3><table><tr><th>ID</th><th>Name</th><th>Specialty</th></tr>";
    doctors.forEach(d => {
      html += `<tr><td>${d.id}</td><td>${d.name}</td><td>${d.specialty}</td></tr>`;
    });
    html += "</table>";
  }

  if (type === "appointments") {
    html = "<h3>Appointments Report</h3><table><tr><th>ID</th><th>Patient</th><th>Doctor</th><th>Date</th><th>Time</th></tr>";
    appointments.forEach(a => {
      const patient = patients.find(p => p.id === a.patientId)?.name || "Unknown";
      const doctor = doctors.find(d => d.id === a.doctorId)?.name || "Unknown";
      html += `<tr><td>${a.id}</td><td>${patient}</td><td>${doctor}</td><td>${a.date}</td><td>${a.time}</td></tr>`;
    });
    html += "</table>";
  }

  if (type === "bills") {
    html = "<h3>Billing Report</h3><table><tr><th>ID</th><th>Patient</th><th>Amount</th></tr>";
    bills.forEach(b => {
      const patient = patients.find(p => p.id === b.patientId)?.name || "Unknown";
      html += `<tr><td>${b.id}</td><td>${patient}</td><td>${b.amount}</td></tr>`;
    });
    html += "</table>";
  }

  reportArea.innerHTML = html;
}

function downloadCSV() {
  const type = document.getElementById("reportType").value;
  let csv = "";

  if (type === "patients") {
    csv = "ID,Name,Age,Gender\n";
    patients.forEach(p => csv += `${p.id},${p.name},${p.age},${p.gender}\n`);
  }

  if (type === "doctors") {
    csv = "ID,Name,Specialty\n";
    doctors.forEach(d => csv += `${d.id},${d.name},${d.specialty}\n`);
  }

  if (type === "appointments") {
    csv = "ID,Patient,Doctor,Date,Time\n";
    appointments.forEach(a => {
      const patient = patients.find(p => p.id === a.patientId)?.name || "Unknown";
      const doctor = doctors.find(d => d.id === a.doctorId)?.name || "Unknown";
      csv += `${a.id},${patient},${doctor},${a.date},${a.time}\n`;
    });
  }

  if (type === "bills") {
    csv = "ID,Patient,Amount\n";
    bills.forEach(b => {
      const patient = patients.find(p => p.id === b.patientId)?.name || "Unknown";
      csv += `${b.id},${patient},${b.amount}\n`;
    });
  }

  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = type + "_report.csv";
  a.click();
}

function printReport() {
  const report = document.getElementById("reportArea").innerHTML;
  const win = window.open("", "", "width=800,height=600");
  win.document.write("<html><head><title>Print Report</title></head><body>");
  win.document.write(report);
  win.document.write("</body></html>");
  win.print();
  win.close();
}

// ---------- HELPERS ----------
function updateDropdowns() {
  const patientOptions = patients.map(p => `<option value="${p.id}">${p.name}</option>`).join("");
  const doctorOptions = doctors.map(d => `<option value="${d.id}">${d.name}</option>`).join("");

  document.getElementById("appointmentPatient").innerHTML = patientOptions;
  document.getElementById("billPatient").innerHTML = patientOptions;
  document.getElementById("appointmentDoctor").innerHTML = doctorOptions;
}

function updateStats() {
  document.getElementById("statPatients").innerText = patients.length;
  document.getElementById("statDoctors").innerText = doctors.length;
  document.getElementById("statAppointments").innerText = appointments.length;
  document.getElementById("statBilling").innerText = bills.reduce((sum, b) => sum + Number(b.amount), 0);
}

function renderAll() {
  renderPatients();
  renderDoctors();
  renderAppointments();
  renderBills();
  updateDropdowns();
  updateStats();
}

renderAll();
