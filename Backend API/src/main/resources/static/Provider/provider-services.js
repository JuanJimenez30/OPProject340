// Provider services helper
// - Add a service (with optional image)
// - List services and delete a service
// Uses fetch() for API calls. Images are converted to base64 data URLs.

// Base URL for the backend services API. Using a relative path keeps
// requests same-origin when pages are served by the Spring Boot server.
const API_BASE = '/api/services';

// Convert a File to a base64 data URL (or null if no file).
function fileToDataUrl(file){
    return new Promise((resolve, reject)=>{
        // If no file given, resolve to null so callers can handle absence.
        if(!file) return resolve(null);
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Resize and compress an image file to a JPEG data URL. Returns null if
// file is missing. Useful to reduce upload size.
function resizeImageFile(file, maxWidth = 1200, maxHeight = 1200, quality = 0.8){
    return new Promise((resolve, reject) => {
        if(!file) return resolve(null);
        const img = new Image();
        const reader = new FileReader();
        reader.onload = () => {
            img.onload = () => {
                // calculate target size while preserving aspect ratio
                let { width, height } = img;
                const aspect = width / height;
                if(width > maxWidth){
                    width = maxWidth;
                    height = Math.round(width / aspect);
                }
                if(height > maxHeight){
                    height = maxHeight;
                    width = Math.round(height * aspect);
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                try{
                    // default to image/jpeg for compression; if original is png we still output jpeg
                    const mime = 'image/jpeg';
                    const dataUrl = canvas.toDataURL(mime, quality);
                    resolve(dataUrl);
                }catch(e){
                    // fallback to original data URL if canvas or toDataURL fails
                    console.warn('Image resize toDataURL failed, falling back', e);
                    resolve(reader.result);
                }
            };
            img.onerror = (e) => { console.warn('Image load error', e); resolve(reader.result); };
            img.src = reader.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Wire the Add button: validate inputs, convert optional image, POST.
function initAddService(){
    const addBtn = document.getElementById('add-service-btn');
    if(!addBtn) return; // page doesn't have the add button — nothing to do

    // Get form elements (name, description, price, image)
    const nameEl = document.getElementById('service-name');
    const descEl = document.getElementById('service-description');
    const priceEl = document.getElementById('service-price');
    const fileEl = document.getElementById('service-image');

    // On click: validate fields, prepare image (if any), send POST.
    addBtn.addEventListener('click', async function(){
        const name = nameEl.value.trim();
        const description = descEl.value.trim();
        const price = parseFloat(priceEl.value);
        const file = fileEl.files && fileEl.files[0];

    // Basic validation: require name, description and price
        if(!name || !description || Number.isNaN(price)){
            alert('Please fill in name, description and price.');
            return;
        }

    // If file selected: try to resize/compress; otherwise convert raw.
    let imageData = null;
    if(file){
        try{
            imageData = await resizeImageFile(file, 1200, 1200, 0.8);
        }catch(e){
            console.warn('resizeImageFile failed, falling back to raw data URL', e);
            imageData = await fileToDataUrl(file);
        }
    }
    // Build JSON payload; include imageData only when present.
    const payload = { name: name, description: description, price: price};
    if (imageData) payload.imageData = imageData;

        console.log('Sending POST payload to backend:', payload);

        try{
            // POST to the backend API (relative path). Controller is mapped to /api/services.
            const res = await fetch(API_BASE, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            console.log('Backend response status:', res.status);
            if(res.ok){
                // Save the image in localStorage by service id so the UI can
                // display it immediately (optional client-side cache).
                let created = null;
                try{ created = await res.json(); }catch(e){ console.warn('Non-JSON create response', e); }
                if(created && imageData){
                    try{ localStorage.setItem('service-image-' + created.id, imageData); }catch(e){ console.warn('localStorage set failed', e); }
                }
                alert('Service added successfully');
                // Clear the file input so the UI does not keep the selected file.
                try{ if(fileEl) fileEl.value = ''; }catch(e){}
                // Navigate to provider services list (page path is served from /Provider)
                location.href = '/Provider/PServices.html';
            } else {
                const text = await res.text();
                console.error('Add failed —', res.status, text);
                alert('Add failed — check console for backend message.');
            }
        }catch(err){
            console.error('Fetch POST error', err);
            alert('Network error — see console');
        }
    });
}

// Read a query parameter value from the page URL (or null if missing).
function getQueryParam(name){
    try{
        const url = new URL(location.href);
        return url.searchParams.get(name);
    }catch(e){ return null; }
}

// (modify UI removed) helper stub was here but not needed.
// Initialize behavior on DOM ready: enable add and list.
document.addEventListener('DOMContentLoaded', function(){
    initAddService();
    // If provider services page is loaded, fetch list from API and render it
    if(document.getElementById('services-container')){
        loadServices();
    }
});


// Fetch services and render a card for each. Cards include a Delete button.
// Image selection order: local cache, server imageData, server image, placeholder.
async function loadServices(){
    const container = document.getElementById('services-container');
    if(!container) return;
    try{
    // For provider view we fetch all services (including unavailable)
    const res = await fetch(API_BASE + '/all');
        if(!res.ok){ console.warn('GET ' + API_BASE + ' returned', res.status); return; }
        const list = await res.json();
        // clear existing dynamic content but preserve the add button if present
        const addBtn = container.querySelector('#add-service-btn');
        container.innerHTML = '';
        if(addBtn) container.appendChild(addBtn);

        // render rows (simple single-column flow; adjust as needed)
        const rowsWrapper = document.createElement('div');
        rowsWrapper.className = 'rows';

        list.forEach(service => {
            const block = document.createElement('div');
            block.className = 'service-block';
            block.dataset.serviceId = service.id;

            // Delete button: confirm then call DELETE /api/services/{id}
            const del = document.createElement('button'); del.className = 'delete-service'; del.title = 'Delete service'; del.textContent = '−';
            del.addEventListener('click', async function(){
                if(!confirm('Delete this service?')) return;
                try{
                    const dres = await fetch(API_BASE + '/' + encodeURIComponent(service.id), { method: 'DELETE' });
                    if(dres.ok){
                        try{ localStorage.removeItem('service-image-' + service.id); }catch(e){}
                        block.remove();
                    } else { alert('Delete failed'); }
                }catch(e){ console.error('Delete error', e); alert('Network error'); }
            });

            const h2 = document.createElement('h2'); h2.textContent = service.name || '';
            // Prefer explicit image data if present; otherwise show a stable
            // placeholder so services without images don't inherit previous
            // visuals.
            const img = document.createElement('img'); img.className = 'service-image';
            // Prefer any client-saved image (from a recent Add flow) keyed by id,
            // then prefer server-provided imageData, then fall back to a stable placeholder.
            let clientImage = null;
            try{ clientImage = localStorage.getItem('service-image-' + service.id); }catch(e){ clientImage = null; }
            img.src = clientImage || service.imageData || service.image || '/images2/default_profile.jpg';
            const p = document.createElement('p'); p.textContent = service.description || '';

                // Modify button: navigate to Modify.html with service id
                const mod = document.createElement('button'); mod.className = 'modify-service'; mod.title = 'Edit service'; mod.textContent = 'Edit';
                mod.addEventListener('click', function(){
                    location.href = '/Provider/Modify.html?id=' + encodeURIComponent(service.id);
                });

                // Append header elements first
                block.appendChild(del);
                block.appendChild(h2);
                block.appendChild(img);
                block.appendChild(p);

                // Availability indicator
                const avail = document.createElement('p');
                avail.className = 'service-availability';
                avail.textContent = 'Available: ' + (service.available ? 'Yes' : 'No');
                block.appendChild(avail);
                // Place modify button at the bottom of the card and style it using existing save-btn class
                mod.className = 'modify-service save-btn';
                block.appendChild(mod);

            rowsWrapper.appendChild(block);
        });

        container.appendChild(rowsWrapper);
    }catch(err){ console.error('Error loading services', err); }
}


// Initialize edit form on Modify.html: load service by id and wire submit.
function initEditService(){
    const form = document.getElementById('modifyServiceForm');
    if(!form) return; // not on Modify page
    const id = getQueryParam('id');
    if(!id){ showModifyStatus('No service id provided in URL', 'error'); return; }
    // populate form
    loadServiceForEdit(id);
    form.addEventListener('submit', async function(e){
        e.preventDefault();
        await handleModifySubmit(id);
    });
}

async function loadServiceForEdit(id){
    try{
        const res = await fetch(API_BASE + '/' + encodeURIComponent(id));
        if(!res.ok){ showModifyStatus('Unable to load service (' + res.status + ')', 'error'); return; }
        const s = await res.json();
        document.getElementById('service-name').value = s.name || '';
        document.getElementById('service-description').value = s.description || '';
        document.getElementById('service-price').value = s.price != null ? s.price : '';
        document.getElementById('service-available').value = (s.available === true) ? 'true' : 'false';
    }catch(err){ console.error('Error loading service for edit', err); showModifyStatus('Network error while loading service', 'error'); }
}

function showModifyStatus(msg, type='info'){
    const el = document.getElementById('modify-status'); if(!el) return; el.textContent = msg; el.className = type;
}

async function handleModifySubmit(id){
    const name = document.getElementById('service-name').value.trim();
    const description = document.getElementById('service-description').value.trim();
    const price = parseFloat(document.getElementById('service-price').value);
    const available = document.getElementById('service-available').value === 'true';
    const fileEl = document.getElementById('service-image');
    const file = fileEl && fileEl.files && fileEl.files[0];
    if(!name || !description || Number.isNaN(price)){ showModifyStatus('Name, description and price are required', 'error'); return; }
    showModifyStatus('Updating...', 'info');
    let imageData = null;
    if(file){
        try{ imageData = await resizeImageFile(file, 1200, 1200, 0.8); }catch(e){ console.warn('resize failed', e); imageData = await fileToDataUrl(file); }
    }
    const payload = { name, description, price, available };
    if(imageData) payload.imageData = imageData;
    try{
        const res = await fetch(API_BASE + '/' + encodeURIComponent(id), {
            method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload)
        });
        if(!res.ok){ const txt = await res.text().catch(()=>res.statusText); showModifyStatus('Update failed ('+res.status+'): '+txt, 'error'); console.error('Update failed', res.status, txt); return; }
        // update local cache if needed
        if(imageData){ try{ localStorage.setItem('service-image-' + id, imageData); }catch(e){}}
        showModifyStatus('Updated successfully — redirecting...', 'success');
        setTimeout(()=> location.href = '/Provider/PServices.html', 1000);
    }catch(err){ console.error('Network error during update', err); showModifyStatus('Network error during update', 'error'); }
}
