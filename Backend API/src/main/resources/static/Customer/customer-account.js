// customer-account.js
// Handles signup (POST /api/customers) and profile loading (GET /api/customers/{id})

const API_BASE = window.location.origin || 'http://localhost:8080';

async function signupCustomer(form) {
    // prefer an explicit username field if provided, otherwise fall back to Name
    let name = '';
    const userEl = form.querySelector('#username');
    if (userEl && userEl.value && userEl.value.trim()) {
        name = userEl.value.trim();
    } else {
        const nameEl = form.querySelector('#Name');
        name = nameEl ? nameEl.value.trim() : '';
    }
    // gather email password, address, phone number
    const email = form.querySelector('#email').value.trim();
    const password = form.querySelector('#password').value;
    const address = form.querySelector('#address').value.trim();
    const phoneNumber = form.querySelector('#phonenumber').value.trim();

    // construct payload
    const payload = {
        name,
        email,
        password,
        address,
        phoneNumber
    };

    const statusEl = ensureStatusElement(form);
    statusEl.textContent = '';

    try {
        // make the POST request
        const res = await fetch(`${API_BASE}/api/customers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        // parse response based on content type
        const contentType = res.headers.get('content-type') || '';
        let text;
        if (contentType.includes('application/json')) {
            text = await res.json();
        } else {
            text = await res.text();
        }

        // handles a failure response
        if (!res.ok) {
            const msg = typeof text === 'string' ? text : JSON.stringify(text);
            statusEl.style.color = 'crimson';
            statusEl.textContent = `Signup failed (${res.status}): ${msg}`;
            console.error('Signup failed:', res.status, text);
            return null;
        }

        // successful, save id and redirect to profile page
        const created = (typeof text === 'object') ? text : JSON.parse(text);
        console.log('signup created:', created);
        const id = created.id || createdIdFrom(created);
        if (id) {
            localStorage.setItem('customerId', String(id));
            statusEl.style.color = 'green';
            statusEl.textContent = 'Account created — redirecting to profile...';
            // short delay to show message
            setTimeout(() => { window.location.href = '/Customer/CustomerProfile.html'; }, 900);
            return created;
        } 
        // no id found in response
        else {
            statusEl.style.color = 'crimson';
            statusEl.textContent = 'Signup succeeded but no id returned.';
            return created;
        }
    } 
    // network or other error
    catch (err) {
        statusEl.style.color = 'crimson';
        statusEl.textContent = 'Network error during signup. See console.';
        console.error('Network error during signup:', err);
        return null;
    }
}

// ensures there's a status element in the form to show messages
function ensureStatusElement(form) {
    let el = document.getElementById('signup-status');
    if (!el) {
        el = document.createElement('div');
        el.id = 'signup-status';
        el.style.marginTop = '12px';
        form.appendChild(el);
    }
    return el;
}

// tries to extract an id from various object shapes
function createdIdFrom(obj) {
    if (!obj) return null;
    if (obj.id) return obj.id;
    if (obj.data && obj.data.id) return obj.data.id;
    return null;
}

// loads and displays the customer profile
async function loadCustomerProfile() {
    const profileContainer = document.querySelector('#Customer-Info-Section .info-box');
    if (!profileContainer) return;
    // get customer id from localStorage
    const id = localStorage.getItem('customerId');
    if (!id) {
        // no id: show message and link to signup
        profileContainer.innerHTML = `<h2>No profile</h2><p>No customer id found. Please sign up or log in.</p><button onclick="location.href='/Customer/SignUp.html'">Sign Up</button>`;
        return;
    }
    try {
        const res = await fetch(`${API_BASE}/api/customers/${encodeURIComponent(id)}`);
        if (!res.ok) {
            profileContainer.innerHTML = `<h2>Error</h2><p>Could not load profile (${res.status})</p>`;
            return;
        }
        const customer = await res.json();
        renderCustomerProfile(profileContainer, customer);
    } catch (err) {
        profileContainer.innerHTML = `<h2>Error</h2><p>Network error while loading profile.</p>`;
        console.error('Error loading customer profile:', err);
    }
}

// renders the customer profile into the container
function renderCustomerProfile(container, c) {
    // clear and fill
    container.innerHTML = '';
    const h2 = document.createElement('h2');
    h2.textContent = 'Profile';
    const img = document.createElement('img');
    img.src = '/images2/default_profile.jpg';
    img.alt = 'Default profile';
    img.id = 'default-profile';

    const makeField = (label, value) => {
        const lab = document.createElement('h3');
        lab.textContent = label;
        const p = document.createElement('p');
        p.textContent = value || '';
        return [lab, p];
    };

    // append elements to container
    container.appendChild(h2);
    container.appendChild(img);

    const [nLab, nP] = makeField('Name', c.name || c.username || '');
    container.appendChild(nLab); container.appendChild(nP);
    const [eLab, eP] = makeField('Email', c.email || '');
    container.appendChild(eLab); container.appendChild(eP);
    const [phLab, phP] = makeField('Phone Number', c.phoneNumber || '');
    container.appendChild(phLab); container.appendChild(phP);
    const [aLab, aP] = makeField('Address', c.address || '');
    container.appendChild(aLab); container.appendChild(aP);
    const [payLab, payP] = makeField('Payment Method', c.cardNumber ? `card ending ${String(c.cardNumber).slice(-4)}` : 'None');
    container.appendChild(payLab); container.appendChild(payP);

    const backBtn = document.createElement('button');
    backBtn.textContent = 'Back to Home';
    backBtn.addEventListener('click', () => { location.href = '/Customer/CustomerHome.html'; });
    container.appendChild(backBtn);
}

// Expose functions for inline use if needed
window.signupCustomer = signupCustomer;
window.loadCustomerProfile = loadCustomerProfile;
