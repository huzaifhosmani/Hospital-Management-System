const API_URL = 'http://localhost:5000/api';

// Patient Login
if (document.getElementById('loginForm')) {
    const loginForm = document.getElementById('loginForm');
    const isPatient = window.location.pathname.includes('patient');
    const isDoctor = window.location.pathname.includes('doctor');
    const isAdmin = window.location.pathname.includes('admin');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        let endpoint = '/auth/patient/login';
        if (isDoctor) endpoint = '/auth/doctor/login';
        if (isAdmin) endpoint = '/auth/admin/login';

        try {
            const response = await fetch(API_URL + endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('role', data.role);
                if (data.role === 'patient') localStorage.setItem('patientId', data.patientId);
                if (data.role === 'doctor') localStorage.setItem('doctorId', data.doctorId);
                
                if (data.role === 'patient') window.location.href = 'patient-dashboard.html';
                if (data.role === 'doctor') window.location.href = 'doctor-dashboard.html';
                if (data.role === 'admin') window.location.href = 'admin-dashboard.html';
            } else {
                alert(data.error);
            }
        } catch (error) {
            alert('Login failed');
        }
    });
}

// Patient Register
if (document.getElementById('registerForm')) {
    const registerForm = document.getElementById('registerForm');
    const isPatient = window.location.pathname.includes('patient');
    const isDoctor = window.location.pathname.includes('doctor');

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(registerForm);
        const data = Object.fromEntries(formData);

        let endpoint = '/auth/patient/register';
        if (isDoctor) endpoint = '/auth/doctor/register';

        try {
            const response = await fetch(API_URL + endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            if (response.ok) {
                alert('Registration successful! Please login.');
                window.location.href = isPatient ? 'patient-login.html' : 'doctor-login.html';
            } else {
                alert(result.error);
            }
        } catch (error) {
            alert('Registration failed');
        }
    });
}

// Logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('patientId');
    localStorage.removeItem('doctorId');
    localStorage.removeItem('role');
    window.location.href = '../index.html';
}