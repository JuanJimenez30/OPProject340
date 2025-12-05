// provider-customers.js
// Fetch list of customers and render them on Provider Customer Info page.

const API_BASE_CUSTOMER = (window.location.origin || 'http://localhost:8080') + '/api/customers';

async function loadProviderCustomers(){
    // Support multiple possible container IDs (some pages use different markup)
    const section = document.getElementById('Customer-Info-Section')
                 || document.getElementById('customer-info-box1')
                 || document.getElementById('customer-info')
                 || document.getElementById('Customer-Info');
    if(!section) {
        // nothing to render into; keep a console trace for debugging
        console.warn('loadProviderCustomers: no container element found (tried several IDs)');
        return;
    }
    console.debug('loadProviderCustomers: rendering into', section.id);

    // Create container area
    const container = document.createElement('div');
    container.className = 'customers-list-container';
    container.style.maxWidth = '900px';
    container.style.margin = '20px auto';

    // Title
    const title = document.createElement('h2');
    title.textContent = 'Customers';
    title.style.textAlign = 'center';
    container.appendChild(title);

    // Fetch customers
    try{
        const res = await fetch(API_BASE_CUSTOMER);
        if(!res.ok){
            const txt = await res.text().catch(()=>null);
            container.appendChild(createErrorBox(`Could not load customers (${res.status}) ${txt ? '- ' + txt : ''}`));
            section.innerHTML = '';
            section.appendChild(container);
            return;
        }
        const list = await res.json();

        // If the page contains a traditional <ul id="customers-list"> (original Provider/CustomerInfo.html layout),
        // populate it in-place and show a friendly message when empty.
        const customersUl = document.getElementById('customers-list');
        if(customersUl){
            customersUl.innerHTML = '';
            if(!Array.isArray(list) || list.length === 0){
                const li = document.createElement('li');
                li.textContent = 'No customers found.';
                customersUl.appendChild(li);
                return;
            }
            list.forEach((c, idx) => {
                const li = document.createElement('li');
                // Keep the original format: "Customer 1: Name <a>: View Details</a>"
                const prefix = document.createTextNode((idx + 1) + '. ' + (c.name || '(no name)') + ': ');
                const anchor = document.createElement('a');
                anchor.href = '/Provider/CustomerInfoPreview.html?id=' + encodeURIComponent(c.id);
                anchor.textContent = 'View Details';
                li.appendChild(prefix);
                li.appendChild(anchor);
                customersUl.appendChild(li);
            });
            // Done — leave the rest of the page markup intact
            return;
        }

        // Otherwise render the card/grid layout used elsewhere
        const listWrapper = document.createElement('div');
        listWrapper.className = 'customers-list';
        listWrapper.style.display = 'grid';
        listWrapper.style.gridTemplateColumns = 'repeat(auto-fit, minmax(260px, 1fr))';
        listWrapper.style.gap = '18px';

        list.forEach(c => {
            const card = document.createElement('div');
            card.className = 'customer-card info-box';
            card.style.textAlign = 'left';

            const name = document.createElement('a');
            name.href = '/Provider/CustomerInfoPreview.html?id=' + encodeURIComponent(c.id);
            name.textContent = c.name || '(no name)';
            name.style.fontSize = '1.25rem';
            name.style.fontWeight = '700';
            name.style.display = 'block';
            name.style.marginBottom = '8px';

            const email = document.createElement('p');
            email.textContent = c.email || '';
            email.style.margin = '4px 0';

            const phone = document.createElement('p');
            phone.textContent = c.phoneNumber || '';
            phone.style.margin = '4px 0';

            const viewBtn = document.createElement('button');
            viewBtn.textContent = 'View Profile';
            viewBtn.className = 'save-btn';
            viewBtn.style.marginTop = '10px';
            viewBtn.addEventListener('click', () => {
                location.href = '/Provider/CustomerInfoPreview.html?id=' + encodeURIComponent(c.id);
            });

            card.appendChild(name);
            card.appendChild(email);
            card.appendChild(phone);
            card.appendChild(viewBtn);

            listWrapper.appendChild(card);
        });

        container.appendChild(listWrapper);
        section.innerHTML = '';
        section.appendChild(container);

    }catch(err){
        console.error('Error loading customers', err);
        section.innerHTML = '';
        section.appendChild(createErrorBox('Network error while loading customers.'));
    }
}

function createInfoBox(msg){
    const b = document.createElement('div');
    b.className = 'info-box';
    b.style.textAlign = 'center';
    b.innerHTML = '<h3>' + msg + '</h3>';
    return b;
}
function createErrorBox(msg){
    const b = document.createElement('div');
    b.className = 'info-box';
    b.style.textAlign = 'center';
    b.style.color = 'crimson';
    b.innerHTML = '<h3>' + msg + '</h3>';
    return b;
}

// expose for DOMContentLoaded
window.loadProviderCustomers = loadProviderCustomers;
