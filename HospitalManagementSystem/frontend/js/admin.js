const API_URL = 'http://localhost:5000/api';
const token = localStorage.getItem('token');

// Load doctors for approval
if (document.getElementById('doctorsTable')) {
    async function loadDoctors() {
        try {
            const response = await fetch(API_URL + '/admin/doctors');
            const doctors = await response.json();
            const tbody = document.querySelector('#doctorsTable tbody');
            
            tbody.innerHTML = doctors.map(doc => `
                <tr>
                    <td>${doc.name}</td>
                    <td>${doc.specialization}</td>
                    <td>${doc.qualification}</td>
                    <td>${doc.is_approved ? 'Approved' : 'Pending'}</td>
                    <td>
                        ${!doc.is_approved ? `<button class="btn btn-sm btn-success" onclick="approveDoctor(${doc.id})">Approve</button>` : '-'}
                    </td>
                </tr>
            `).join('');
        } catch (error) {
            document.querySelector('#doctorsTable tbody').innerHTML = '<tr><td colspan="5" class="text-center">Error loading</td></tr>';
        }
    }

    window.approveDoctor = async function(id) {
        try {
            await fetch(API_URL + '/admin/doctors/' + id + '/approve', {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            loadDoctors();
        } catch (error) {
            alert('Approval failed');
        }
    };

    loadDoctors();
}

// Load patients
if (document.getElementById('patientsTable')) {
    async function loadPatients() {
        try {
            const response = await fetch(API_URL + '/admin/patients');
            const patients = await response.json();
            const tbody = document.querySelector('#patientsTable tbody');
            
            tbody.innerHTML = patients.map(patient => `
                <tr>
                    <td>${patient.name}</td>
                    <td>${patient.age}</td>
                    <td>${patient.gender}</td>
                    <td>${patient.phone_number}</td>
                    <td>${patient.email}</td>
                    <td><button class="btn btn-sm btn-danger" onclick="deletePatient(${patient.id})">Delete</button></td>
                </tr>
            `).join('');
        } catch (error) {
            document.querySelector('#patientsTable tbody').innerHTML = '<tr><td colspan="6" class="text-center">Error loading</td></tr>';
        }
    }

    window.deletePatient = async function(id) {
        if (confirm('Are you sure?')) {
            try {
                await fetch(API_URL + '/admin/patients/' + id, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                loadPatients();
            } catch (error) {
                alert('Delete failed');
            }
        }
    };

    loadPatients();
}

// Load appointments
if (document.getElementById('appointmentsTable') && window.location.pathname.includes('manage-appointments')) {
    async function loadAppointments() {
        try {
            const response = await fetch(API_URL + '/appointments');
            const appointments = await response.json();
            const tbody = document.querySelector('#appointmentsTable tbody');
            
            tbody.innerHTML = appointments.map(appt => `
                <tr>
                    <td>${appt.patient_name}</td>
                    <td>${appt.doctor_name}</td>
                    <td>${appt.appointment_date}</td>
                    <td>${appt.appointment_time}</td>
                    <td>${appt.status}</td>
                </tr>
            `).join('');
        } catch (error) {
            document.querySelector('#appointmentsTable tbody').innerHTML = '<tr><td colspan="5" class="text-center">Error loading</td></tr>';
        }
    }

    loadAppointments();
}