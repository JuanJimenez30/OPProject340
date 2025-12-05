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
    // Allow viewing a specific customer via query param `id`, else fall back to localStorage
    let id = null;
    try{
        const url = new URL(location.href);
        id = url.searchParams.get('id') || null;
    }catch(e){ id = null; }
    if(!id) id = localStorage.getItem('customerId');
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
        // Determine whether the viewer is the owner of this profile
        const ownId = localStorage.getItem('customerId');
        const isOwn = ownId && String(ownId) === String(id);
        renderCustomerProfile(profileContainer, customer, isOwn);
        // If the viewer is the owner, also load their subscriptions
        if (isOwn && window.loadCustomerSubscriptions) {
            try {
                window.loadCustomerSubscriptions(customer.id);
            } catch (err) {
                console.error('Error invoking loadCustomerSubscriptions:', err);
            }
        }
    } catch (err) {
        profileContainer.innerHTML = `<h2>Error</h2><p>Network error while loading profile.</p>`;
        console.error('Error loading customer profile:', err);
    }
}

// renders the customer profile into the container
function renderCustomerProfile(container, c, isOwn = true) {
    // clear and fill
    container.innerHTML = '';
    const h2 = document.createElement('h2');
    h2.textContent = 'Profile';
    const img = document.createElement('img');
    img.src = '/images2/default_profile.jpg';
    img.alt = 'Default profile';
    img.id = 'default-profile';

    // helper to create label + value elements
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

    // Only show edit button when viewing own profile (prevent provider editing customer directly)
    if (isOwn) {
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit Profile';
        editBtn.addEventListener('click', () => { location.href = '/Customer/EditCustomerProfile.html'; });
        container.appendChild(editBtn);
    }
}

// Expose functions for inline use if needed
window.signupCustomer = signupCustomer;
window.loadCustomerProfile = loadCustomerProfile;

// Load customer profile data into the edit form
async function loadEditProfileForm() {
    const id = localStorage.getItem('customerId');
    if (!id) {
        showEditStatus('No customer id found. Please log in.', 'error');
        setTimeout(() => { location.href = '/LogIn.html'; }, 2000);
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/api/customers/${encodeURIComponent(id)}`);
        if (!res.ok) {
            showEditStatus(`Could not load profile (${res.status})`, 'error');
            return;
        }
        const customer = await res.json();
        populateEditForm(customer);
    } catch (err) {
        showEditStatus('Network error while loading profile.', 'error');
        console.error('Error loading customer profile:', err);
    }
}

// Populate the edit form with current customer data
function populateEditForm(customer) {
    document.getElementById('edit-name').value = customer.name || customer.username || '';
    document.getElementById('edit-email').value = customer.email || '';
    document.getElementById('edit-phone').value = customer.phoneNumber || '';
    document.getElementById('edit-address').value = customer.address || '';
    document.getElementById('edit-card-number').value = customer.cardNumber || '';
    document.getElementById('edit-password').value = '';
    
    // Store customer ID for use in form submission
    window.currentCustomerId = customer.id;
    
    // Set up form submit handler
    const form = document.getElementById('editCustomerForm');
    form.addEventListener('submit', (e) => handleEditFormSubmit(e, customer.id));
}

// Show status messages in the edit form
function showEditStatus(message, type = 'info') {
    const statusEl = document.getElementById('edit-status');
    if (!statusEl) return;
    
    statusEl.textContent = message;
    statusEl.className = type;
}

// Handle the edit form submission
async function handleEditFormSubmit(e, customerId) {
    e.preventDefault();
    
    const name = document.getElementById('edit-name').value.trim();
    const email = document.getElementById('edit-email').value.trim();
    const phone = document.getElementById('edit-phone').value.trim();
    const address = document.getElementById('edit-address').value.trim();
    const cardNumber = document.getElementById('edit-card-number').value.trim();
    const password = document.getElementById('edit-password').value;
    
    // Validation
    if (!name || !email) {
        showEditStatus('Name and email are required.', 'error');
        return;
    }
    
    // Optional: Validate card number if provided
    if (cardNumber && cardNumber.length > 0) {
        const cleanCardNumber = cardNumber.replace(/\s/g, '');
        if (cleanCardNumber.length < 13 || cleanCardNumber.length > 19) {
            showEditStatus('Card number must be between 13 and 19 digits.', 'error');
            return;
        }
        if (!/^\d+$/.test(cleanCardNumber)) {
            showEditStatus('Card number must contain only digits.', 'error');
            return;
        }
    }
    
    // Build update payload
    const payload = {
        name,
        email,
        phoneNumber: phone,
        address
    };
    
    // Only include card number if provided - convert to Long (send last 16 digits or full number if valid)
    if (cardNumber && cardNumber.length > 0) {
        const cleanCardNumber = cardNumber.replace(/\s/g, '');
        // Send as number - backend expects Long
        const cardNumAsLong = parseInt(cleanCardNumber, 10);
        if (!isNaN(cardNumAsLong)) {
            payload.cardNumber = cardNumAsLong;
        }
    }
    
    if (password && password.length > 0) {
        payload.password = password;
    }
    
    try {
        showEditStatus('Updating profile...', 'info');
        
        const res = await fetch(`${API_BASE}/api/customers/${encodeURIComponent(customerId)}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        if (!res.ok) {
            const text = await res.text();
            showEditStatus(`Update failed (${res.status}): ${text}`, 'error');
            console.error('Update failed:', res.status, text);
            return;
        }
        
        showEditStatus('Profile updated successfully! Redirecting...', 'success');
        
        // Redirect to profile page after brief delay
        setTimeout(() => {
            location.href = '/Customer/CustomerProfile.html';
        }, 1500);
        
    } catch (err) {
        showEditStatus('Network error during update. See console.', 'error');
        console.error('Network error during update:', err);
    }
}

// Expose edit functions for inline use
window.loadEditProfileForm = loadEditProfileForm;
window.handleEditFormSubmit = handleEditFormSubmit;

// Load and display customer subscriptions
async function loadCustomerSubscriptions(customerId) {
    console.log('Loading subscriptions for customer:', customerId);
    try {
        const res = await fetch(`${API_BASE}/api/subscriptions/customer/${encodeURIComponent(customerId)}`);
        console.log('Subscriptions response:', res.status);
        if (!res.ok) {
            console.error('Could not load subscriptions:', res.status);
            // Still render the subscriptions box with "No active subscriptions" message
            renderSubscriptions([]);
            return;
        }
        const subscriptions = await res.json();
        console.log('Subscriptions data:', subscriptions);
        renderSubscriptions(subscriptions);
    } catch (err) {
        console.error('Error loading subscriptions:', err);
        // Still render the subscriptions box with "No active subscriptions" message
        renderSubscriptions([]);
    }
}

// Render subscriptions in a dedicated section
function renderSubscriptions(subs) {
    console.log('Rendering subscriptions:', subs);
    const section = document.getElementById('Customer-Info-Section');
    console.log('Section element:', section);
    if (!section) {
        console.error('Customer-Info-Section not found');
        return;
    }

    const subsBox = document.createElement('div');
    subsBox.className = 'subscriptions-box';

    const h2 = document.createElement('h2');
    h2.textContent = 'Active Subscriptions';
    subsBox.appendChild(h2);

    if (!Array.isArray(subs) || subs.length === 0) {
        const noSubs = document.createElement('p');
        noSubs.className = 'no-subscriptions';
        noSubs.textContent = 'No active subscriptions';
        subsBox.appendChild(noSubs);
    } else {
        subs.forEach(sub => {
            const item = document.createElement('div');
            item.className = 'subscription-item';

            const name = document.createElement('h4');
            name.textContent = sub.services ? sub.services.name : 'Service';
            item.appendChild(name);

            const type = document.createElement('p');
            type.innerHTML = `<span class="sub-type">${sub.type.replace('_', ' ')}</span>`;
            item.appendChild(type);

            if (sub.services && sub.services.description) {
                const desc = document.createElement('p');
                desc.textContent = sub.services.description;
                item.appendChild(desc);
            }

            if (sub.services && sub.services.price) {
                const price = document.createElement('p');
                price.textContent = `Price: $${Number(sub.services.price).toFixed(2)}`;
                item.appendChild(price);
            }

            // Add cancel button
            const cancelBtn = document.createElement('button');
            cancelBtn.className = 'cancel-subscription-btn';
            cancelBtn.textContent = 'Cancel Subscription';
            cancelBtn.addEventListener('click', async function() {
                if (!confirm(`Cancel subscription to ${sub.services ? sub.services.name : 'Service'}?`)) {
                    return;
                }
                try {
                    const res = await fetch(`${API_BASE}/api/subscriptions/${sub.id}/cancel`, { method: 'POST' });
                    if (res.ok) {
                        console.log('Subscription cancelled successfully');
                        item.remove();
                        // Check if there are any more subscriptions
                        const remainingItems = document.querySelectorAll('.subscription-item');
                        if (remainingItems.length === 0) {
                            // Reload subscriptions to show "No active subscriptions" message
                            const customerId = localStorage.getItem('customerId');
                            if (customerId) {
                                loadCustomerSubscriptions(customerId);
                            }
                        }
                    } else {
                        alert('Could not cancel subscription');
                    }
                } catch (err) {
                    console.error('Error cancelling subscription:', err);
                    alert('Network error while cancelling subscription');
                }
            });
            item.appendChild(cancelBtn);

            subsBox.appendChild(item);
        });
    }

    // Try to place the subscriptions box right after the profile info-box
    const profileBox = section.querySelector('.info-box');
    if (profileBox && profileBox.parentNode) {
        profileBox.parentNode.insertBefore(subsBox, profileBox.nextSibling);
    } else {
        section.appendChild(subsBox);
    }
    console.log('Subscriptions box appended:', subsBox);
}

// Expose subscription functions for inline use
window.loadCustomerSubscriptions = loadCustomerSubscriptions;
