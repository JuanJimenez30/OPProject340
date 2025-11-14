// customer-cart.js
// Loads subscriptions for current customer and renders cart items.

const API_SUBSCRIPTIONS = '/api/subscriptions';
const API_SERVICES = '/api/services';

function formatMoney(n){
    if(n === null || n === undefined) return '$0';
    return '$' + Number(n).toFixed(2);
}

async function loadCart(){
    const container = document.getElementById('cart-container');
    if(!container) return;
    const customerId = localStorage.getItem('customerId');
    if(!customerId){
        container.innerHTML = '<p>No customer signed in. <a href="/Customer/SignUp.html">Sign up</a> or log in.</p>';
        return;
    }
    try{
        const res = await fetch(`${API_SUBSCRIPTIONS}/customer/${encodeURIComponent(customerId)}`);
        if(!res.ok){ container.innerHTML = `<p>Could not load cart (${res.status})</p>`; return; }
        const list = await res.json();
        renderCart(container, list);
    }catch(err){ console.error('Error loading cart', err); container.innerHTML = '<p>Network error loading cart.</p>'; }
}

function renderCart(container, subs){
    container.innerHTML = '';
    let total = 0;

    if(!Array.isArray(subs) || subs.length === 0){
        container.innerHTML = '<p>Your cart is empty.</p>'; return;
    }

    subs.forEach(s => {
        const price = (s.services && s.services.price) ? Number(s.services.price) : null;
        // Map subscription type to a per-visit price heuristic if price not present
        let displayPrice = price;
        if(price === null){
            displayPrice = 0;
        } else {
            // approximate per-visit price depending on type
            if(s.type === 'ONE_TIME') displayPrice = price;
            else if(s.type === 'WEEKLY') displayPrice = Number((price * 0.85).toFixed(2));
            else if(s.type === 'BIWEEKLY') displayPrice = Number((price * 0.93).toFixed(2));
        }
        total += displayPrice || 0;

        const item = document.createElement('div');
        item.className = 'cart-item';
        item.dataset.price = displayPrice || 0;

        const h2 = document.createElement('h2'); h2.textContent = s.services ? s.services.name : 'Service';
        const p = document.createElement('p'); p.textContent = `${s.type.replace('_',' ')} - ${formatMoney(displayPrice)}`;
        const rem = document.createElement('button'); rem.className = 'remove-btn'; rem.textContent = 'Remove';
        rem.addEventListener('click', async function(){
            if(!confirm('Remove this item from your subscriptions?')) return;
            try{
                const r = await fetch(`${API_SUBSCRIPTIONS}/${s.id}/cancel`, { method: 'POST' });
                if(r.ok){ item.remove(); updateTotal(); }
                else { alert('Could not remove item'); }
            }catch(err){ console.error('Cancel error', err); alert('Network error'); }
        });

        item.appendChild(h2); item.appendChild(p); item.appendChild(rem);
        container.appendChild(item);
    });

    const summary = document.createElement('div'); summary.className = 'cart-summary';
    const h2 = document.createElement('h2'); h2.textContent = 'Total:';
    const span = document.createElement('span'); span.id = 'cart-total'; span.textContent = formatMoney(total);
    const br = document.createElement('br');
    const checkout = document.createElement('button'); checkout.id = 'checkout-btn'; checkout.textContent = 'Checkout';
    checkout.addEventListener('click', () => { location.href = '/Customer/Success.html'; });

    summary.appendChild(h2); summary.appendChild(span); summary.appendChild(br); summary.appendChild(checkout);
    container.appendChild(summary);
}

function updateTotal(){
    let total = 0;
    document.querySelectorAll('.cart-item').forEach(it => { total += Number(it.dataset.price || 0); });
    const el = document.getElementById('cart-total'); if(el) el.textContent = formatMoney(total);
}

document.addEventListener('DOMContentLoaded', function(){ loadCart(); });
