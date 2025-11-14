// customer-services.js
// Fetch /api/services and render service cards for customers.

const API_SERVICES = '/api/services';

async function loadCustomerServices(){
    const container = document.getElementById('services-container');
    if(!container) return;
    try{
        const res = await fetch(API_SERVICES);
        if(!res.ok){
            console.warn('GET /api/services returned', res.status);
            return;
        }
        const list = await res.json();
        container.innerHTML = '';

        const wrapper = document.createElement('div');
        wrapper.className = 'rows';

        list.forEach(service => {
            const block = document.createElement('div');
            block.className = 'service-block';
            block.dataset.serviceId = service.id;

            const h2 = document.createElement('h2'); h2.textContent = service.name || '';
            const img = document.createElement('img'); img.className = 'service-image';
            img.src = service.imageData || service.image || '/images2/default_profile.jpg';
            const p = document.createElement('p'); p.textContent = service.description || '';

            const btn = document.createElement('button');
            btn.className = 'Select_service';
            btn.type = 'button';
            btn.textContent = 'Select Service';
            btn.addEventListener('click', () => {
                // navigate to select page with query param
                location.href = '/Customer/Select_Service.html?id=' + encodeURIComponent(service.id);
            });

            block.appendChild(h2);
            block.appendChild(img);
            block.appendChild(p);
            block.appendChild(btn);

            wrapper.appendChild(block);
        });

        container.appendChild(wrapper);
    }catch(err){
        console.error('Error loading customer services', err);
    }
}

document.addEventListener('DOMContentLoaded', function(){
    loadCustomerServices();
});
