const API_URL = 'http://localhost:5000/api';
const token = localStorage.getItem('token');
const patientId = localStorage.getItem('patientId');
const doctorId = localStorage.getItem('doctorId');

// Load approved doctors
async function loadDoctors() {
    const select = document.getElementById('doctor_id');
    if (!select) return;

    try {
        const response = await fetch(API_URL + '/doctors');
        const doctors = await response.json();
        select.innerHTML = '<option value="">Select Doctor</option>';
        doctors.forEach(doc => {
            select.innerHTML += `<option value="${doc.id}">${doc.name} - ${doc.specialization}</option>`;
        });
    } catch (error) {
        select.innerHTML = '<option value="">Error loading doctors</option>';
    }
}

// Book appointment
if (document.getElementById('appointmentForm')) {
    document.getElementById('appointmentForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const data = {
            patient_id: patientId,
            doctor_id: document.getElementById('doctor_id').value,
            appointment_date: document.getElementById('appointment_date').value,
            appointment_time: document.getElementById('appointment_time').value
        };

        try {
            const response = await fetch(API_URL + '/appointments', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            if (response.ok) {
                alert('Appointment booked successfully!');
                window.location.href = 'view-appointments.html';
            } else {
                alert(result.error);
            }
        } catch (error) {
            alert('Booking failed');
        }
    });

    loadDoctors();
}

// Load patient appointments
if (document.getElementById('appointmentsTable')) {
    async function loadAppointments() {
        try {
            const response = await fetch(API_URL + '/appointments/patient/' + patientId);
            const appointments = await response.json();
            const tbody = document.querySelector('#appointmentsTable tbody');
            
            if (appointments.length === 0) {
                tbody.innerHTML = '<tr><td colspan="4" class="text-center">No appointments found</td></tr>';
                return;
            }

            tbody.innerHTML = appointments.map(appt => `
                <tr>
                    <td>${appt.doctor_name}</td>
                    <td>${appt.appointment_date}</td>
                    <td>${appt.appointment_time}</td>
                    <td>${appt.status}</td>
                </tr>
            `).join('');
        } catch (error) {
            document.querySelector('#appointmentsTable tbody').innerHTML = '<tr><td colspan="4" class="text-center">Error loading</td></tr>';
        }
    }

    loadAppointments();
}