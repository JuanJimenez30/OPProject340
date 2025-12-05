// select-service.js
// On Select_Service.html: fetch service by id, show details, compute option prices,
// and POST a Subscription to /api/subscriptions when "Add to Cart" is clicked.

const API_SUBSCRIPTIONS = '/api/subscriptions';
const API_SERVICES = '/api/services';

function getQueryParam(name){
    try{ const u = new URL(location.href); return u.searchParams.get(name);}catch(e){return null;}
}

function parsePriceFromLabel(labelText){
    // find first $number in text
    const m = labelText.match(/\$(\d+(?:\.\d+)?)/);
    if(!m) return null;
    return Number(m[1]);
}

async function loadSelectedService(){
    const serviceId = getQueryParam('id');
    if(!serviceId) return;
    try{
        const res = await fetch(API_SERVICES + '/' + encodeURIComponent(serviceId));
        if(!res.ok){ console.warn('GET service', res.status); return; }
        const s = await res.json();
        // update page
        const block = document.querySelector('.service-block');
        if(block){
            const h2 = block.querySelector('h2'); if(h2) h2.textContent = s.name || '';
            const p = block.querySelector('p'); if(p) p.textContent = s.description || '';
        }
        // compute option prices using base price if present. If service.price missing, keep defaults.
        const base = s.price ? Number(s.price) : null;
        const oneLabel = document.querySelector('label[for="one-time"]');
        const weeklyLabel = document.querySelector('label[for="weekly"]');
        const biLabel = document.querySelector('label[for="bi-weekly"]');
        if(base !== null){
            // heuristic: weekly cheaper, bi-weekly slightly cheaper than one-time
            const one = base;
            const weekly = Math.max(1, (base * 0.85).toFixed(2));
            const bi = Math.max(1, (base * 0.93).toFixed(2));
            if(oneLabel) oneLabel.textContent = `One-Time Service - $${one}`;
            if(weeklyLabel) weeklyLabel.textContent = `Weekly Service - $${weekly} per visit`;
            if(biLabel) biLabel.textContent = `Bi-Weekly Service - $${bi} per visit`;
        }

        // replace the add button behavior
        const addBtn = document.getElementById('add-cart-btn');
        if(addBtn){
            addBtn.removeAttribute('onclick');
            addBtn.addEventListener('click', async function(){
                // find selected radio
                const selected = document.querySelector('input[name="service-type"]:checked');
                if(!selected){ alert('Please choose a service option'); return; }
                const typeValue = selected.value;
                const typeMap = { 'one-time': 'ONE_TIME', 'weekly': 'WEEKLY', 'bi-weekly': 'BIWEEKLY' };
                const type = typeMap[typeValue] || 'ONE_TIME';

                // determine price for display: try reading label text
                const lab = document.querySelector(`label[for="${selected.id}"]`);
                let price = null;
                if(lab) price = parsePriceFromLabel(lab.textContent);
                // If label parsing fails, use service base price
                if(price === null && s.price) price = Number(s.price);

                // get customer id from localStorage
                const customerId = localStorage.getItem('customerId');
                if(!customerId){ if(!confirm('No customer signed in. Go to Sign Up?')) return; location.href='/Customer/SignUp.html'; return; }

                // Add to local cart (localStorage) instead of creating subscription immediately
                let cart = JSON.parse(localStorage.getItem('tempCart') || '[]');
                const cartItem = {
                    serviceId: Number(serviceId),
                    serviceName: s.name,
                    type: type,
                    price: price || 0
                };
                cart.push(cartItem);
                localStorage.setItem('tempCart', JSON.stringify(cart));
                alert('Added to cart!');
                location.href = '/Customer/ViewCartPage.html';
            });
        }
    }catch(err){ console.error('Error loading selected service', err); }
}

document.addEventListener('DOMContentLoaded', function(){ loadSelectedService(); });
