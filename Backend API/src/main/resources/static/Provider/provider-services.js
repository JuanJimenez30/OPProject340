// Client helpers for Provider pages (AddService, PServices, Modify)
// - read form inputs and send a new service to the backend (Add)
// - fetch and render the list of services (List)
// The code uses fetch() for HTTP requests and simple DOM operations to
// build service cards. Image files are converted to base64 data URLs so
// they can be sent inside JSON payloads.

// Base URL for the backend services API. Using a relative path keeps
// requests same-origin when pages are served by the Spring Boot server.
const API_BASE = '/api/services';

// fileToDataUrl(file)
// Convert a browser File object (from a file input) into a base64 data URL.
// Returns a Promise that resolves to the data URL string or null when no
// file was provided. Callers can await this to get the encoded image.
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

// resizeImageFile(file, maxWidth, maxHeight, quality)
// Loads an image file into a hidden canvas, scales it down while keeping
// its aspect ratio, and returns a compressed JPEG data URL. This reduces
// payload size and the chance of exceeding browser storage limits.
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

// initAddService()
// Attach behavior to the Add button on the Add Service page. When clicked
// it validates inputs, converts an optional image file to a base64 string,
// sends a POST to the backend with the service data, and then navigates
// back to the services listing on success.
function initAddService(){
    const addBtn = document.getElementById('add-service-btn');
    if(!addBtn) return; // page doesn't have the add button — nothing to do

    // Grab the form fields from the page. If any are missing we do nothing.
    const nameEl = document.getElementById('service-name');
    const descEl = document.getElementById('service-description');
    const priceEl = document.getElementById('service-price');
    const fileEl = document.getElementById('service-image');

    // Handler for the Add button click. Validation -> optional image -> POST
    addBtn.addEventListener('click', async function(){
        const name = nameEl.value.trim();
        const description = descEl.value.trim();
        const price = parseFloat(priceEl.value);
        const file = fileEl.files && fileEl.files[0];

    // Basic validation: name, description and price must be present
        if(!name || !description || Number.isNaN(price)){
            alert('Please fill in name, description and price.');
            return;
        }

    // If the user selected a file, resize and convert it to a data URL.
    // If resizing fails we fall back to a direct conversion.
    let imageData = null;
    if(file){
        try{
            imageData = await resizeImageFile(file, 1200, 1200, 0.8);
        }catch(e){
            console.warn('resizeImageFile failed, falling back to raw data URL', e);
            imageData = await fileToDataUrl(file);
        }
    }
    // Build the JSON payload. Only include imageData when an image exists.
    const payload = { name: name, description: description, price: price };
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
                // If the server returned the created object, save the uploaded
                // image in browser localStorage keyed by the new service id.
                // This helps the UI show the image immediately while the
                // server-side image persistence is in progress or not available.
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

// getQueryParam(name)
// Read a query parameter value from the current page URL. Returns null if
// the parameter is missing or the URL cannot be parsed.
function getQueryParam(name){
    try{
        const url = new URL(location.href);
        return url.searchParams.get(name);
    }catch(e){ return null; }
}

// initModifyService()
// In this project the inline modify editor is disabled. This stub detects
// a ?id= query parameter and logs the id. It intentionally does not attach
// any editing behavior so Add flow remains the priority.
function initModifyService(){
    const serviceId = getQueryParam('id');
   
    if(serviceId){
        // intentionally do nothing for single-service modify view
        console.log('initModifyService stub: modify/edit UI disabled (serviceId=', serviceId, ')');
    }
}


// Run initialization code when the page has loaded. Each init function is
// safe to call on any page — it checks for required elements before acting.
document.addEventListener('DOMContentLoaded', function(){
    initAddService();
    initModifyService();
    // If provider services page is loaded, fetch list from API and render it
    if(document.getElementById('services-container')){
        loadServices();
    }
});


// loadServices()
// Request the list of services from the backend and build DOM cards for
// each entry inside the #services-container. Each card includes Delete and
// Modify buttons. Images are chosen in this order:
// 1) client-saved image (localStorage), 2) server-provided imageData, 3)
//    server-provided image property, 4) default placeholder image.
async function loadServices(){
    const container = document.getElementById('services-container');
    if(!container) return;
    try{
        const res = await fetch(API_BASE);
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

            const del = document.createElement('button'); del.className = 'delete-service'; del.title = 'Delete service'; del.textContent = '−';
            del.addEventListener('click', async function(){
                if(!confirm('Delete this service?')) return;
                try{
                    const dres = await fetch(API_BASE + '/' + encodeURIComponent(service.id), { method: 'DELETE' });
                    if(dres.ok){
                        // remove any client-side stored image for this service
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
            const modify = document.createElement('button');
            modify.type = 'button';
            modify.className = 'modify-service';
            modify.textContent = 'Modify';
            modify.setAttribute('aria-label', 'Modify service');
         

            block.appendChild(del);
            block.appendChild(h2);
            block.appendChild(img);
            block.appendChild(p);
            block.appendChild(modify);

            rowsWrapper.appendChild(block);
        });

        container.appendChild(rowsWrapper);
    }catch(err){ console.error('Error loading services', err); }
}