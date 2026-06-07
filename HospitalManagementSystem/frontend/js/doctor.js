const API_URL = 'http://localhost:5000/api';
const token = localStorage.getItem('token');
const doctorId = localStorage.getItem('doctorId');

// Load doctor appointments
if (document.getElementById('appointmentsTable')) {
    async function loadAppointments() {
        try {
            const response = await fetch(API_URL + '/appointments/doctor/' + doctorId);
            const appointments = await response.json();
            const tbody = document.querySelector('#appointmentsTable tbody');
            
            if (appointments.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" class="text-center">No appointments found</td></tr>';
                return;
            }

            tbody.innerHTML = appointments.map(appt => `
                <tr>
                    <td>${appt.patient_name}</td>
                    <td>${appt.appointment_date}</td>
                    <td>${appt.appointment_time}</td>
                    <td>${appt.status}</td>
                    <td>
                        ${appt.status === 'Pending' ? `
                            <button class="btn btn-sm btn-success" onclick="updateStatus(${appt.id}, 'Approved')">Approve</button>
                            <button class="btn btn-sm btn-danger" onclick="updateStatus(${appt.id}, 'Rejected')">Reject</button>
                        ` : '-'}
                    </td>
                </tr>
            `).join('');
        } catch (error) {
            document.querySelector('#appointmentsTable tbody').innerHTML = '<tr><td colspan="5" class="text-center">Error loading</td></tr>';
        }
    }

    window.updateStatus = async function(id, status) {
        try {
            await fetch(API_URL + '/appointments/' + id + '/status', {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });
            loadAppointments();
        } catch (error) {
            alert('Update failed');
        }
    };

    loadAppointments();
}

// Update availability
if (document.getElementById('availabilityForm')) {
    document.getElementById('availabilityForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        try {
            await fetch(API_URL + '/doctors/' + doctorId + '/availability', {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ 
                    available_time: document.getElementById('available_time').value 
                })
            });
            alert('Availability updated!');
        } catch (error) {
            alert('Update failed');
        }
    });
}