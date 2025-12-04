// Provider services helper
// - Add a service (with optional image)
// - List services and delete a service
// Uses fetch() for API calls. Images are converted to base64 data URLs.

// Base URL for the backend services API. 
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
// file is missing. This is to reduce upload size.
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

//Add button: validate inputs, convert optional image, POST.
function initAddService(){
    const addBtn = document.getElementById('add-service-btn');
    if(!addBtn) return; // page doesn't have the add button, nothing done

    // Get form elements (name, description, price, image)
    const nameEl = document.getElementById('service-name');
    const descEl = document.getElementById('service-description');
    const priceEl = document.getElementById('service-price');
    const fileEl = document.getElementById('service-image');

    // On click it validates fields, prepares image, and sends POST.
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
                // display it immediately.
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

// Initialize behavior on DOM ready: enable add and list.
document.addEventListener('DOMContentLoaded', function(){
    initAddService();
    // If provider services page is loaded, fetch list from API and render it
    if(document.getElementById('services-container')){
        loadServices();
    }
});


// Fetch services and render a card for each.
// Image selection order is local cache, server imageData, server image, placeholder.
async function loadServices(){
    const container = document.getElementById('services-container');
    if(!container) return;
    try{
        const res = await fetch(API_BASE);
        if(!res.ok){ console.warn('GET ' + API_BASE + ' returned', res.status); return; }
        const list = await res.json();
        // clear existing dynamic content but preserve the add button
        const addBtn = container.querySelector('#add-service-btn');
        container.innerHTML = '';
        if(addBtn) container.appendChild(addBtn);

        // render rows 
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

                block.appendChild(del);
                block.appendChild(h2);
                block.appendChild(img);
                block.appendChild(p);

            rowsWrapper.appendChild(block);
        });

        container.appendChild(rowsWrapper);
    }catch(err){ console.error('Error loading services', err); }
}