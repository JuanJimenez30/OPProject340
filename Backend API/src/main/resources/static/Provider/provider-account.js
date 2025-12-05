// provider-account.js
// Handles loading and updating provider profile (GET /api/providers/{id} and PUT)

const API_BASE_PROVIDER = window.location.origin || 'http://localhost:8080';

async function loadProviderProfileContainer() {
    const container = document.querySelector('#provider-profile');
    if (!container) return;
    const id = sessionStorage.getItem('glc_provider_id');
    if (!id) {
        container.innerHTML = `<h2>No provider logged in</h2><p>Please log in as a provider.</p>`;
        return;
    }
    try {
        const res = await fetch(`${API_BASE_PROVIDER}/api/providers/${encodeURIComponent(id)}`);
        if (!res.ok) { container.innerHTML = `<p>Unable to load profile (${res.status})</p>`; return; }
        const p = await res.json();
        renderProviderProfile(container, p);
    } catch (err) {
        container.innerHTML = `<p>Network error loading provider profile.</p>`;
        console.error(err);
    }
}

function renderProviderProfile(container, p) {
    container.innerHTML = '';
    const h1 = document.createElement('h1'); h1.textContent = 'Provider Profile'; container.appendChild(h1);
    const img = document.createElement('img'); img.src = '/images2/PProfileIcon.png'; img.id='Pprofile-picture'; container.appendChild(img);

    const addField = (label, value) => {
        const lab = document.createElement('p'); lab.innerHTML = `<b>${label}</b>:`; container.appendChild(lab);
        const val = document.createElement('p'); val.textContent = value || ''; container.appendChild(val);
    };

    addField('Name', p.name);
    addField('Email', p.email);
    addField('Phone', p.phoneNumber || '');

    const btnGroup = document.createElement('div');
    btnGroup.style.marginTop = '18px';
    const back = document.createElement('button'); back.textContent = 'Back to Home'; back.addEventListener('click', ()=> location.href='/Provider/Home.html');
    const edit = document.createElement('button'); edit.textContent = 'Edit Profile'; edit.addEventListener('click', ()=> location.href='/Provider/EditProviderProfile.html');
    btnGroup.appendChild(back); btnGroup.appendChild(edit);
    container.appendChild(btnGroup);
}

// Load data into edit form
async function loadEditProviderForm() {
    const id = sessionStorage.getItem('glc_provider_id');
    if (!id) {
        showEditStatus('No provider logged in. Redirecting to login...', 'error');
        setTimeout(()=> location.href='/LogIn.html', 1500);
        return;
    }
    try {
        const res = await fetch(`${API_BASE_PROVIDER}/api/providers/${encodeURIComponent(id)}`);
        if (!res.ok) { showEditStatus(`Could not load profile (${res.status})`, 'error'); return; }
        const provider = await res.json();
        populateProviderEditForm(provider);
    } catch (err) {
        showEditStatus('Network error while loading profile.', 'error');
        console.error(err);
    }
}

function populateProviderEditForm(provider) {
    document.getElementById('edit-name').value = provider.name || '';
    document.getElementById('edit-email').value = provider.email || '';
    document.getElementById('edit-phone').value = provider.phoneNumber || '';
    document.getElementById('edit-password').value = '';
    window.currentProviderId = provider.id;
    const form = document.getElementById('editProviderForm');
    form.addEventListener('submit', (e) => handleProviderEditSubmit(e, provider.id));
}

function showEditStatus(message, type='info'){
    const statusEl = document.getElementById('edit-status'); if(!statusEl) return; statusEl.textContent = message; statusEl.className = type;
}

async function handleProviderEditSubmit(e, providerId){
    e.preventDefault();
    const name = document.getElementById('edit-name').value.trim();
    const email = document.getElementById('edit-email').value.trim();
    const phone = document.getElementById('edit-phone').value.trim();
    const password = document.getElementById('edit-password').value;
    if(!name || !email){ showEditStatus('Name and email are required.', 'error'); return; }
    const payload = { name, email, phoneNumber: phone };
    if(password && password.length>0) payload.password = password;
    try{
        showEditStatus('Updating profile...', 'info');
        const res = await fetch(`${API_BASE_PROVIDER}/api/providers/${encodeURIComponent(providerId)}`, {
            method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload)
        });
        if(!res.ok){ const txt = await res.text().catch(()=>res.statusText); showEditStatus(`Update failed (${res.status}): ${txt}`, 'error'); console.error('Update failed', res.status, txt); return; }
        showEditStatus('Profile updated successfully! Redirecting...', 'success');
        setTimeout(()=> location.href='/Provider/PProfile.html', 1200);
    }catch(err){ showEditStatus('Network error during update. See console.', 'error'); console.error(err); }
}

// Expose for inline calls
window.loadProviderProfileContainer = loadProviderProfileContainer;
window.loadEditProviderForm = loadEditProviderForm;
window.handleProviderEditSubmit = handleProviderEditSubmit;
