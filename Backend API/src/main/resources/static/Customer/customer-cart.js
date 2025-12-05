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
    
    // Load temporary cart items from localStorage
    const tempCart = JSON.parse(localStorage.getItem('tempCart') || '[]');
    renderCart(container, tempCart, customerId);
}

function renderCart(container, items, customerId){
    container.innerHTML = '';
    let total = 0;

    if(!Array.isArray(items) || items.length === 0){
        container.innerHTML = '<p>Your cart is empty.</p>'; return;
    }

    items.forEach((item, index) => {
        let displayPrice = item.price || 0;
        
        // Apply price adjustments based on subscription type if price is present
        if(displayPrice > 0){
            if(item.type === 'WEEKLY') displayPrice = Number((displayPrice * 0.85).toFixed(2));
            else if(item.type === 'BIWEEKLY') displayPrice = Number((displayPrice * 0.93).toFixed(2));
        }
        total += displayPrice || 0;

        const cartItemDiv = document.createElement('div');
        cartItemDiv.className = 'cart-item';
        cartItemDiv.dataset.price = displayPrice || 0;

        const h2 = document.createElement('h2'); h2.textContent = item.serviceName || 'Service';
        const p = document.createElement('p'); p.textContent = `${item.type.replace('_',' ')} - ${formatMoney(displayPrice)}`;
        const rem = document.createElement('button'); rem.className = 'remove-btn'; rem.textContent = 'Remove';
        rem.addEventListener('click', function(){
            // Remove from temporary cart
            let cart = JSON.parse(localStorage.getItem('tempCart') || '[]');
            cart.splice(index, 1);
            localStorage.setItem('tempCart', JSON.stringify(cart));
            cartItemDiv.remove();
            updateTotal();
        });

        cartItemDiv.appendChild(h2); cartItemDiv.appendChild(p); cartItemDiv.appendChild(rem);
        container.appendChild(cartItemDiv);
    });

    const summary = document.createElement('div'); summary.className = 'cart-summary';
    const h2 = document.createElement('h2'); h2.textContent = 'Total:';
    const span = document.createElement('span'); span.id = 'cart-total'; span.textContent = formatMoney(total);
    const br = document.createElement('br');
    const checkout = document.createElement('button'); checkout.id = 'checkout-btn'; checkout.textContent = 'Checkout';
    checkout.addEventListener('click', async () => { 
        // Create subscriptions for all items in temp cart
        const tempCart = JSON.parse(localStorage.getItem('tempCart') || '[]');
        if(tempCart.length === 0){ alert('Your cart is empty'); return; }
        
        try{
            const now = new Date().toISOString();
            for(const item of tempCart){
                const payload = {
                    customer: { id: Number(customerId) },
                    services: { id: Number(item.serviceId) },
                    type: item.type,
                    startDate: now,
                    active: true
                };
                
                const r = await fetch(API_SUBSCRIPTIONS, {
                    method: 'POST',
                    headers: { 'Content-Type':'application/json' },
                    body: JSON.stringify(payload)
                });
                
                if(!r.ok){ alert('Checkout failed'); return; }
            }
            // Clear temp cart after successful checkout
            localStorage.removeItem('tempCart');
            location.href = '/Customer/Success.html';
        }catch(err){ console.error('Checkout error', err); alert('Network error during checkout.'); }
    });

    summary.appendChild(h2); summary.appendChild(span); summary.appendChild(br); summary.appendChild(checkout);
    container.appendChild(summary);
}

function updateTotal(){
    let total = 0;
    document.querySelectorAll('.cart-item').forEach(it => { total += Number(it.dataset.price || 0); });
    const el = document.getElementById('cart-total'); if(el) el.textContent = formatMoney(total);
}

document.addEventListener('DOMContentLoaded', function(){ loadCart(); });
