/*
  customer-reviews.js
  - Matches backend Reviews entity fields:
      { customer:{id}, services:{id}, overallRating, comment }
  - Uses GET /api/reviews/service/{id} to list reviews for a service.
  - POSTs single JSON to /api/reviews.
  - Shows concise server messages in-page to avoid console noise.
*/

// loads pre-existing reviews for selected service
document.addEventListener('DOMContentLoaded', () => {
    const serviceSelect = document.getElementById('service-name');
    const reviewForm = document.getElementById('review-form');
    const reviewsList = document.getElementById('reviews-list');
    let serverMessageEl = document.getElementById('server-message');
    if (!serverMessageEl) {
        serverMessageEl = document.createElement('div');
        serverMessageEl.id = 'server-message';
        serverMessageEl.style.marginTop = '12px';
        reviewForm.after(serverMessageEl);
    }

    // base API URL
    const API_BASE = window.location.origin || 'http://localhost:8080';

    // tries to get current customer id from localStorage
    function getCurrentCustomerId() {
        const v = localStorage.getItem('customerId');
        if (!v) return null;
        const n = Number(v);
        return Number.isFinite(n) && n > 0 ? n : null;
    }

    // safely reads response body as string (JSON or text)
    async function safeReadBodyAsString(response) {
        try {
            const ct = response.headers.get('content-type') || '';
            if (ct.includes('application/json')) {
                const obj = await response.json();
                return JSON.stringify(obj);
            }
            return await response.text();
        } catch (e) {
            return '<unable to read body>';
        }
    }

    // loads services into the select dropdown
    async function loadServices() {
        try {
            // GET /api/services
            const res = await fetch(`${API_BASE}/api/services`);
            if (!res.ok) {
                const body = await safeReadBodyAsString(res);
                serviceSelect.innerHTML = '<option value="">Unable to load services</option>';
                serverMessageEl.textContent = `Could not load services (${res.status}).`;
                return;
            }
            const services = await res.json();
            populateServiceOptions(services);
        } catch (err) {
            serviceSelect.innerHTML = '<option value="">Unable to load services</option>';
            serverMessageEl.textContent = 'Network error loading services.';
        }
    }

    // fills the service select with options
    function populateServiceOptions(services) {
        serviceSelect.innerHTML = '<option value="">Select a service</option>';
        if (!Array.isArray(services)) return;
        services.forEach(s => {
            const value = (s && s.id !== undefined) ? s.id : s;
            const text = (s && s.name !== undefined) ? s.name : s;
            const opt = document.createElement('option');
            opt.value = value;
            opt.textContent = text;
            serviceSelect.appendChild(opt);
        });
    }

    // GET reviews -> /api/reviews/service/{serviceId}
    async function loadReviewsForService(serviceId) {
        reviewsList.innerHTML = '<p>Loading reviews...</p>';
        try {
            const url = `${API_BASE}/api/reviews/service/${encodeURIComponent(serviceId)}`;
            const res = await fetch(url);
            if (!res.ok) {
                const body = await safeReadBodyAsString(res);
                serverMessageEl.style.color = 'crimson';
                serverMessageEl.textContent = `Could not load reviews (${res.status}): ${body}`;
                reviewsList.innerHTML = '<p>No reviews available.</p>';
                return;
            }
            const reviews = await res.json();
            renderReviews(reviews);
        } catch (err) {
            serverMessageEl.style.color = 'crimson';
            serverMessageEl.textContent = 'Network error loading reviews.';
            reviewsList.innerHTML = '<p>Error loading reviews.</p>';
        }
    }

    function renderReviews(reviews) {
        // Render reviews using the provider's card markup and CSS classes
        if (!Array.isArray(reviews) || reviews.length === 0) {
            reviewsList.innerHTML = '<p>No reviews yet for this service.</p>';
            return;
        }
        reviewsList.innerHTML = '';
        reviews.forEach(r => {
            const div = document.createElement('div');
            div.className = 'review';

            // profile image (use default if none)
            const img = document.createElement('img');
            img.src = (r.customer && r.customer.profileImage) ? r.customer.profileImage : '/images2/default_profile.jpg';
            img.alt = 'Reviewer profile';
            img.id = 'default-profile';

            // reviewer name
            const name = document.createElement('h2');

            // Prefer stored customer.name (username); fall back to firstName/lastName, then email, then Anonymous
            let fullName = 'Anonymous';
            if (r.customer) {
                if (r.customer.name && r.customer.name.trim()) fullName = r.customer.name.trim();
                else if (r.customer.firstName || r.customer.lastName) fullName = `${(r.customer.firstName||'').trim()} ${(r.customer.lastName||'').trim()}`.trim();
                else if (r.customer.email) fullName = r.customer.email;
            }
            name.textContent = fullName;

            // stars
            const stars = document.createElement('p');
            stars.id = 'stars';
            // simple star rendering: repeat Provider's star overallRating
            const ratingNum = (r.overallRating !== undefined) ? Number(r.overallRating) : 0;
            stars.textContent = '⭐'.repeat(Math.max(0, Math.min(5, ratingNum)));

            // service and date (if available)
            const serviceH3 = document.createElement('h3');
            serviceH3.textContent = r.services && r.services.name ? `Service: ${r.services.name}` : '';
            const dateH3 = document.createElement('h3');
            if (r.dateCreated) {
                // try to format date string still not working well
                const d = new Date(r.dateCreated);
                if (!isNaN(d)) dateH3.textContent = `Date Created: ${d.toLocaleDateString()}`;
            }

            // review text
            const text = document.createElement('p');
            text.id = 'review-text';
            text.innerHTML = escapeHtml(r.comment || r.reviewText || r.comment || '');

            // assemble the card
            div.appendChild(img);
            div.appendChild(name);
            div.appendChild(stars);
            if (serviceH3.textContent) div.appendChild(serviceH3);
            if (dateH3.textContent) div.appendChild(dateH3);
            div.appendChild(text);

            reviewsList.appendChild(div);
        });
    }

    // simple HTML escape to prevent XSS in review comments
    function escapeHtml(str) {
        return String(str).replace(/[&<>"'\/]/g, s => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;","/":"&#x2F;"}[s]));
    }

    // Submit payload matching Reviews entity on form submit
    reviewForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        serverMessageEl.textContent = '';
        const serviceValue = serviceSelect.value;
        const rating = reviewForm.querySelector('input[name="rating"]:checked')?.value;
        const commentEl = document.getElementById('review-desc');
        const comment = commentEl ? commentEl.value.trim() : '';

        if (!serviceValue) { alert('Please select a service.'); return; }
        if (!rating) { alert('Please select a rating.'); return; }

        const numericId = Number(serviceValue);
        const currentCustomerId = getCurrentCustomerId();
        if (!currentCustomerId) {
            alert('You must be logged in to submit a review. Please log in or sign up.');
            return;
        }

        const payload = {
            customer: { id: currentCustomerId },
            services: { id: numericId },
            overallRating: Number(rating),
            comment
        };

        try {
            // POST /api/reviews
            const res = await fetch(`${API_BASE}/api/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const bodyStr = await safeReadBodyAsString(res);
            if (!res.ok) {
                serverMessageEl.style.color = 'crimson';
                serverMessageEl.textContent = `Server error ${res.status}: ${bodyStr}`;
                return;
            }

            serverMessageEl.style.color = 'green';
            serverMessageEl.textContent = 'Review submitted successfully.';
            reviewForm.reset();

            try {
                const created = JSON.parse(bodyStr);
                // reuse provider-style card creation
                const div = document.createElement('div');
                div.className = 'review';

                const img = document.createElement('img');
                img.src = (created.customer && created.customer.profileImage) ? created.customer.profileImage : '/images2/default_profile.jpg';
                img.alt = 'Reviewer profile';
                img.id = 'default-profile';

                const name = document.createElement('h2');
                // Use created.customer.name when available, otherwise first/last/email then Anonymous
                let createdName = 'Anonymous';
                if (created.customer) {
                    if (created.customer.name && created.customer.name.trim()) createdName = created.customer.name.trim();
                    else if (created.customer.firstName || created.customer.lastName) createdName = `${(created.customer.firstName||'').trim()} ${(created.customer.lastName||'').trim()}`.trim();
                    else if (created.customer.email) createdName = created.customer.email;
                }
                name.textContent = createdName;

                const stars = document.createElement('p');
                stars.id = 'stars';
                const ratingNum = (created.overallRating !== undefined) ? Number(created.overallRating) : payload.overallRating;
                stars.textContent = '⭐'.repeat(Math.max(0, Math.min(5, ratingNum)));

                const text = document.createElement('p');
                text.id = 'review-text';
                text.innerHTML = escapeHtml(created.comment || payload.comment || '');

                div.appendChild(img);
                div.appendChild(name);
                div.appendChild(stars);
                div.appendChild(text);

                reviewsList.prepend(div);
            } catch (_) {}
        } catch (err) {
            serverMessageEl.style.color = 'crimson';
            serverMessageEl.textContent = 'Network error while submitting review. See console.';
            console.error('Network error submitting review:', String(err));
        }
    });

    // when user selects service, try to load reviews for it
    serviceSelect.addEventListener('change', (e) => {
        const val = e.target.value;
        if (!val) { reviewsList.innerHTML = '<p>Select a service to see reviews.</p>'; return; }
        loadReviewsForService(val);
    });

    // initial load
    loadServices();
});