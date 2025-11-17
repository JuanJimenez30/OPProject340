// Provider reviews helper
// - Load reviews for a provider
// - Let provider post a plain-text reply to a review
// Backend endpoints used: GET /api/reviews/provider/{id}, POST /api/reviews/{id}/provider-response

const REVIEWS_API_BASE = '/api/reviews';

// Add Authorization header from localStorage (if present) to requests.
function getAuthHeaders(extraHeaders){
    const headers = Object.assign({}, extraHeaders || {});
    try{
        const token = window.PROVIDER_AUTH_TOKEN || localStorage.getItem('authToken');
        if(token){ headers['Authorization'] = 'Bearer ' + token; }
    }catch(e){}
    return headers;
}

// Get provider id from #reviews-container data-provider-id or ?providerId= URL param.
function readProviderIdFromPage(){
    try{
        const container = document.getElementById('reviews-container');
        if(container && container.dataset && container.dataset.providerId) return container.dataset.providerId;
        const url = new URL(location.href);
        return url.searchParams.get('providerId');
    }catch(e){
        return null;
    }
}

// If #reviews-container exists, load and render reviews for the provider.
function initProviderReviews(){
    const container = document.getElementById('reviews-container');
    if(!container) return; // nothing to do on pages without the container

    // If HTML sets data-provider-id attribute, we use that; otherwise try query param.
    const providerId = readProviderIdFromPage();
    if(!providerId){
        console.warn('No provider id found for reviews page');
        return;
    }

    // Load and render reviews for this provider.
    loadProviderReviews(providerId);
}

// Build a review card: image, name, rating, comment, date, and provider reply UI.
function buildReviewCard(review){
    // Create a DOM structure matching the existing .review markup so existing CSS applies.
    const card = document.createElement('div');
    card.className = 'review';
    card.dataset.reviewId = review.id;

    // profile image
    const img = document.createElement('img');
    img.src = (review.customer && review.customer.profileImage) ? review.customer.profileImage : '/images2/default_profile.jpg';
    img.alt = 'Default profile';
    img.id = 'default-profile';

    // reviewer name
    const name = document.createElement('h2');
    const fullName = (review.customer && (review.customer.firstName || review.customer.lastName))
        ? `${(review.customer.firstName||'').trim()} ${(review.customer.lastName||'').trim()}`.trim()
        : (review.customer && review.customer.name) || 'Anonymous';
    name.textContent = fullName;

    // rating stars
    const stars = document.createElement('p');
    stars.id = 'stars';
    const ratingNum = (review.overallRating !== undefined && review.overallRating !== null) ? Number(review.overallRating) : 0;
    stars.textContent = '⭐'.repeat(Math.max(0, Math.min(5, ratingNum)));

    // service name and date
    const serviceH3 = document.createElement('h3');
    serviceH3.textContent = review.services && review.services.name ? `Service: ${review.services.name}` : '';
    const dateH3 = document.createElement('h3');
    if (review.createdAt || review.dateCreated) {
        const d = new Date(review.createdAt || review.dateCreated);
        if (!isNaN(d)) dateH3.textContent = `Date Created: ${d.toLocaleDateString()}`;
    }

    // review text
    const text = document.createElement('p');
    text.id = 'review-text';
    text.textContent = review.comment || review.reviewText || '';

    // reply area (Reply button shown when provider owns the service)
    const replyBtn = document.createElement('button');
    replyBtn.className = 'reply-button';
    replyBtn.textContent = 'Reply';

    // If provider already replied, show their response instead of Reply button
    if (review.providerResponse) {
        const respDiv = document.createElement('div');
        respDiv.className = 'reply';
        respDiv.textContent = review.providerResponse;
        // assemble
        card.appendChild(img);
        card.appendChild(name);
        card.appendChild(stars);
        if (serviceH3.textContent) card.appendChild(serviceH3);
        if (dateH3.textContent) card.appendChild(dateH3);
        card.appendChild(text);
        card.appendChild(respDiv);
        return card;
    }

    // Single-provider app: no ownership checks needed. Always allow reply when none exists.

    // assemble with Reply button and attach reply form behavior
    card.appendChild(img);
    card.appendChild(name);
    card.appendChild(stars);
    if (serviceH3.textContent) card.appendChild(serviceH3);
    if (dateH3.textContent) card.appendChild(dateH3);
    card.appendChild(text);
    card.appendChild(replyBtn);

    // On click: show textarea and Submit/Cancel; POST plain text to provider-response endpoint.
    replyBtn.addEventListener('click', function(){
        // prevent multiple forms
        if (card.querySelector('.reply-form')) return;
        replyBtn.style.display = 'none';
        const form = document.createElement('div');
        form.className = 'reply-form';
        const ta = document.createElement('textarea');
        ta.className = 'reply-textarea';
        ta.placeholder = 'Type your reply here...';
        const submit = document.createElement('button');
        submit.className = 'reply-submit';
        submit.textContent = 'Reply';
        const cancel = document.createElement('button');
        cancel.className = 'reply-cancel';
        cancel.textContent = 'Cancel';
        const controls = document.createElement('div');
        controls.className = 'reply-controls';
        controls.appendChild(submit);
        controls.appendChild(cancel);
        form.appendChild(ta);
        form.appendChild(controls);
        replyBtn.insertAdjacentElement('afterend', form);

        submit.addEventListener('click', async function(){
            const textVal = ta.value.trim();
            if(!textVal) return;
            submit.disabled = true;
            submit.textContent = 'Sending...';
            try{
                const res = await fetch(REVIEWS_API_BASE + '/' + encodeURIComponent(review.id) + '/provider-response', {
                    method: 'POST',
                    headers: getAuthHeaders({ 'Content-Type': 'text/plain' }),
                    body: textVal
                });
                if(!res.ok){
                    const t = await res.text();
                    console.error('Reply failed', res.status, t);
                    alert('Reply failed — see console');
                    submit.disabled = false;
                    submit.textContent = 'Reply';
                    return;
                }
                // replace form with read-only reply on success
                form.remove();
                const respDiv = document.createElement('div');
                respDiv.className = 'reply';
                respDiv.textContent = textVal;
                replyBtn.insertAdjacentElement('afterend', respDiv);
            }catch(err){
                console.error('Network error sending reply', err);
                alert('Network error — see console');
                submit.disabled = false;
                submit.textContent = 'Reply';
            }
        });

        cancel.addEventListener('click', function(){
            form.remove();
            replyBtn.style.display = '';
        });
    });

    return card;
}

// Fetch reviews for provider, render list, and show friendly messages on errors.
async function loadProviderReviews(providerId){
    const container = document.getElementById('reviews-container');
    if(!container) return;
    try{
        const res = await fetch(REVIEWS_API_BASE + '/provider/' + encodeURIComponent(providerId), {
            method: 'GET',
            headers: getAuthHeaders()
        });
        if(!res.ok){
            // More specific feedback based on status code
            if (res.status === 404) {
                console.warn('Provider not found', providerId);
                container.textContent = 'Provider not found.';
                return;
            }
            const bodyText = await res.text().catch(() => '');
            console.warn('GET reviews failed', res.status, bodyText);
            container.textContent = `Failed to load reviews (${res.status})`;
            return;
        }

        const list = await res.json();
        // Clear existing content and render list
        container.innerHTML = '';
        if(!Array.isArray(list) || list.length === 0){
            container.textContent = 'No reviews yet.';
            return;
        }

        list.forEach(r => {
            const card = buildReviewCard(r);
            container.appendChild(card);
        });
    }catch(e){
        console.error('Error loading reviews', e);
        container.textContent = 'Error loading reviews';
    }
}

// Auto-init on DOM ready
document.addEventListener('DOMContentLoaded', function(){
    initProviderReviews();
});
