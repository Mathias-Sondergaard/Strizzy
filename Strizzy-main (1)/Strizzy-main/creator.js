// Simple client-side creator portal script
// NOTE: This is a demo using sessionStorage/localStorage only. Do not rely on this for production auth.
(function(){
    const demoPassword = 'letmein'; // Change or remove for your production setup

    const loginSection = document.getElementById('loginSection');
    const loginForm = document.getElementById('loginForm');
    const passwordInput = document.getElementById('password');

    const dashboard = document.getElementById('dashboard');
    const logoutBtn = document.getElementById('logoutBtn');

    const postForm = document.getElementById('postForm');
    const titleInput = document.getElementById('title');
    const descInput = document.getElementById('description');
    const urlInput = document.getElementById('url');
    const tagsInput = document.getElementById('tags');
    const postsList = document.getElementById('postsList');
    const noPosts = document.getElementById('noPosts');
    const clearBtn = document.getElementById('clearBtn');

    function isLoggedIn(){
        return sessionStorage.getItem('sg_logged_in') === '1';
    }

    function showLogin(){
        loginSection.style.display = 'block';
        dashboard.style.display = 'none';
    }

    function showDashboard(){
        loginSection.style.display = 'none';
        dashboard.style.display = 'block';
        renderPosts();
    }

    loginForm.addEventListener('submit', function(e){
        e.preventDefault();
        const pw = passwordInput.value;
        if(pw === demoPassword){
            sessionStorage.setItem('sg_logged_in','1');
            passwordInput.value = '';
            showDashboard();
        } else {
            alert('Incorrect password for demo portal. Change in script for your own use.');
        }
    });

    logoutBtn.addEventListener('click', function(){
        sessionStorage.removeItem('sg_logged_in');
        showLogin();
    });

    function loadPosts(){
        try{
            const raw = localStorage.getItem('sg_posts');
            return raw ? JSON.parse(raw) : [];
        }catch(e){
            console.error('Failed to parse posts', e);
            return [];
        }
    }

    function savePosts(arr){
        localStorage.setItem('sg_posts', JSON.stringify(arr));
    }

    postForm.addEventListener('submit', function(e){
        e.preventDefault();
        const title = titleInput.value.trim();
        if(!title){
            alert('Title is required');
            return;
        }
        const post = {
            id: Date.now(),
            title,
            description: descInput.value.trim(),
            url: urlInput.value.trim(),
            tags: tagsInput.value.split(',').map(t=>t.trim()).filter(Boolean),
            published: true,
            createdAt: new Date().toISOString()
        };
        const posts = loadPosts();
        posts.unshift(post);
        savePosts(posts);
        postForm.reset();
        renderPosts();
    });

    clearBtn.addEventListener('click', function(){
        postForm.reset();
    });

    function renderPosts(){
        const posts = loadPosts();
        postsList.innerHTML = '';
        if(posts.length === 0){
            noPosts.style.display = 'block';
            return;
        }
        noPosts.style.display = 'none';

        posts.forEach(p => {
            const el = document.createElement('div');
            el.className = 'post';

            const meta = document.createElement('div');
            meta.className = 'meta';
            const h4 = document.createElement('h4');
            h4.textContent = p.title;
            const desc = document.createElement('p');
            desc.className = 'small-muted';
            desc.textContent = p.description || '';
            const info = document.createElement('div');
            info.className = 'small-muted';
            info.textContent = `Created: ${new Date(p.createdAt).toLocaleString()}`;
            meta.appendChild(h4);
            meta.appendChild(desc);
            meta.appendChild(info);

            if(p.tags && p.tags.length){
                const tagsWrap = document.createElement('div');
                tagsWrap.style.marginTop = '8px';
                p.tags.forEach(t => {
                    const span = document.createElement('span');
                    span.className = 'pill';
                    span.style.marginRight = '6px';
                    span.textContent = t;
                    tagsWrap.appendChild(span);
                });
                meta.appendChild(tagsWrap);
            }

            const actions = document.createElement('div');
            actions.className = 'actions';

            const viewBtn = document.createElement('a');
            viewBtn.className = 'btn';
            viewBtn.textContent = 'View';
            viewBtn.href = p.url || '#';
            viewBtn.target = '_blank';

            const toggleBtn = document.createElement('button');
            toggleBtn.className = 'btn';
            toggleBtn.textContent = p.published ? 'Unpublish' : 'Publish';
            toggleBtn.addEventListener('click', function(){
                togglePublished(p.id);
            });

            const delBtn = document.createElement('button');
            delBtn.className = 'btn';
            delBtn.textContent = 'Delete';
            delBtn.addEventListener('click', function(){
                if(confirm('Delete this post?')) deletePost(p.id);
            });

            actions.appendChild(viewBtn);
            actions.appendChild(toggleBtn);
            actions.appendChild(delBtn);

            el.appendChild(meta);
            el.appendChild(actions);
            postsList.appendChild(el);
        });
    }

    function togglePublished(id){
        const posts = loadPosts();
        const idx = posts.findIndex(p=>p.id===id);
        if(idx!==-1){
            posts[idx].published = !posts[idx].published;
            savePosts(posts);
            renderPosts();
        }
    }

    function deletePost(id){
        let posts = loadPosts();
        posts = posts.filter(p=>p.id!==id);
        savePosts(posts);
        renderPosts();
    }

    // Init
    if(isLoggedIn()) showDashboard(); else showLogin();

})();
