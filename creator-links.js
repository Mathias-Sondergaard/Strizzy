/*
  Configurable creator links + suggested videos renderer.

  How to use:
  - Edit the `config.platforms` array to add your platform links and Font Awesome icon classes.
  - Edit the `config.videos` array to add your YouTube video IDs (only ID, not full URL).
    Example: { id: 'dQw4w9WgXcQ', title: 'My Tutorial', description: 'Short desc' }

  This file is intentionally client-side only so you can edit values without a build step.
*/
(function(){
    const config = {
        platforms: [
            {name: 'YouTube', url: 'https://www.youtube.com/@StrizzyGG', icon: 'fab fa-youtube'},
            {name: 'Instagram', url: 'https://www.instagram.com/strizzyg/', icon: 'fab fa-instagram'},
            {name: 'X', url: 'https://x.com/StrizzyGG', icon: 'fab fa-twitter'}
        ],
        // Replace VIDEO_ID_X with your YouTube video IDs. Keep placeholder IDs until you update.
        videos: [
            {id: 'UTKLQQbn59k', title: 'Featured video', description: ''},
            {id: '_6WSY3bUOD0', title: 'Featured video 2', description: ''},
            {id: 'gjNTUXgSPYA', title: 'Featured video 3', description: ''}
        ]
    };

    function renderLinks(target){
        const container = document.getElementById(target);
        if(!container) return;
        container.innerHTML = '';
        // render icon-only cards with a small "Follow" button beneath each
        config.platforms.forEach(p => {
            const item = document.createElement('div');
            item.className = 'platform-item';

            const a = document.createElement('a');
            a.href = p.url;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            a.className = 'platform-card';
            a.setAttribute('aria-label', p.name);
            a.title = p.name;
            a.innerHTML = `<i class="${p.icon}" aria-hidden="true"></i>`;
            item.appendChild(a);

            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'platform-follow';
            btn.textContent = 'Follow';
            btn.setAttribute('aria-label', `Follow ${p.name}`);
            // Clicking Follow will try a platform-specific follow/subscribe intent where supported
            function getFollowUrl(platform){
                try{
                    if(platform.follow) return platform.follow;
                    const u = new URL(platform.url);
                    const host = u.hostname.replace('www.','').toLowerCase();
                    const parts = u.pathname.split('/').filter(Boolean);
                    const username = parts[0] || '';

                    // X / Twitter: follow intent
                    if(host.includes('twitter.com') || host.includes('x.com')){
                        if(username) return `https://twitter.com/intent/follow?screen_name=${username}`;
                    }

                    // YouTube: try adding subscription confirmation (works with channel or user paths)
                    if(host.includes('youtube.com')){
                        let base = platform.url;
                        if(base.endsWith('/')) base = base.slice(0,-1);
                        return base + (base.includes('?') ? '&' : '?') + 'sub_confirmation=1';
                    }

                    // Instagram / TikTok / LinkedIn etc.: no public follow-intent; open profile instead
                    if(host.includes('instagram.com') && username){
                        return `https://www.instagram.com/${username}/`;
                    }
                    if(host.includes('tiktok.com') && username){
                        return `https://www.tiktok.com/@${username}`;
                    }

                    // Fallback to the provided URL
                    return platform.url;
                }catch(err){
                    return platform.url;
                }
            }

            btn.addEventListener('click', function(e){
                e.stopPropagation();
                const followUrl = getFollowUrl(p) || p.url;
                // open follow intent or profile in new tab
                window.open(followUrl, '_blank', 'noopener');
            });

            item.appendChild(btn);
            container.appendChild(item);
        });
    }

    // Render videos by showing only the 3D feed for a clean, futuristic presentation
    function renderVideos(){
        const container = document.getElementById('suggestedVideos');
        if(!container) return;
        container.innerHTML = '';
        // Let render3DFeed handle the visible UI
        render3DFeed();
    }

    // Improved render3DFeed: lazy thumbnail loads, keyboard accessibility, ARIA
    function render3DFeed(){
        const container = document.getElementById('youtube3dFeed') || document.getElementById('suggestedVideos');
        if(!container) return;
        container.innerHTML = '';
        container.style.minHeight = '220px';
        container.style.flexBasis = '100%';
        container.setAttribute('role', 'region');
        container.setAttribute('aria-label', 'Featured videos');
        console.log('[creator-links] render3DFeed: videos count=', config.videos.length);
        // small debug badge so we can see the container in case of visual issues
        const debugBadge = document.createElement('div');
        debugBadge.className = 'yt-debug-badge';
        debugBadge.textContent = `Loading ${config.videos.length} videos...`;
        debugBadge.style.cssText = 'position:absolute;left:12px;top:12px;padding:6px 8px;background:rgba(0,0,0,0.45);color:#fff;border-radius:6px;font-size:12px;z-index:50;pointer-events:none';
        container.appendChild(debugBadge);

        config.videos.forEach((v, idx)=>{
            const card = document.createElement('div');
            card.className = 'yt-card';
            card.setAttribute('data-id', v.id || '');
            card.setAttribute('data-idx', idx);
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            card.setAttribute('aria-label', `Play ${v.title || 'video'}`);

            const depth = document.createElement('div');
            depth.className = 'depth-layer';

            const thumb = document.createElement('div');
            thumb.className = 'thumb';
            // create inner layer for true parallax
            const inner = document.createElement('div');
            inner.className = 'thumb-inner';
            inner.style.backgroundImage = "linear-gradient(90deg,#131315,#0b0b13)";

            // lazy load real image into inner layer
            if(v.id && !v.id.startsWith('VIDEO_ID')){
                const url = `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`;
                const img = new Image();
                img.src = url;
                img.onload = function(){
                    inner.style.backgroundImage = `url('${url}')`;
                    inner.style.filter = 'none';
                };
            }
            thumb.appendChild(inner);

            const play = document.createElement('div');
            play.className = 'play';
            play.innerHTML = '<i class="fas fa-play"></i>';

            const meta = document.createElement('div');
            meta.className = 'meta';
            const title = document.createElement('div');
            title.className = 'title';
            title.textContent = v.title || '';
            const channel = document.createElement('div');
            channel.className = 'small-muted';
            channel.textContent = v.channel || '';
            meta.appendChild(title);
            meta.appendChild(channel);

            depth.appendChild(thumb);
            card.appendChild(depth);
            card.appendChild(play);
            card.appendChild(meta);

            // mouse tilt (parallax inner layer)
            card.addEventListener('mousemove', function(e){
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                const rx = (-y) * 9;
                const ry = x * 13;
                card.style.transform = `translateY(-12px) translateZ(48px) rotateX(${rx}deg) rotateY(${ry}deg)`;
                // inner parallax moves more
                inner.style.transform = `translateZ(90px) translateX(${x*6}px) translateY(${y*6}px) scale(1.06)`;
            });
            card.addEventListener('mouseleave', function(){
                card.style.transform = '';
                inner.style.transform = '';
            });

            // click / keyboard to open
            function activate(){
                if(!v.id || v.id.startsWith('VIDEO_ID')) return;
                openLightbox(v.id);
            }
            card.addEventListener('click', activate);
            card.addEventListener('keydown', function(e){
                if(e.key === 'Enter' || e.key === ' '){
                    e.preventDefault();
                    activate();
                }
            });

            container.appendChild(card);
        });
        console.log('[creator-links] render3DFeed: rendered cards=', container.children.length);
        if(typeof debugBadge !== 'undefined' && debugBadge){
            debugBadge.textContent = `${container.children.length} cards rendered`;
            setTimeout(()=>{ try{ debugBadge.style.transition='opacity .35s'; debugBadge.style.opacity='0'; setTimeout(()=>{ if(debugBadge && debugBadge.parentNode) debugBadge.parentNode.removeChild(debugBadge); },350); }catch(e){} },800);
        }
    }

    // small helper: relative date formatter for ISO dates
    function formatRelativeDate(iso){
        try{
            const d = new Date(iso);
            const now = new Date();
            const diff = Math.floor((now - d) / 1000);
            const mins = Math.floor(diff/60);
            const hours = Math.floor(mins/60);
            const days = Math.floor(hours/24);
            const months = Math.floor(days/30);
            if(days < 1) return `${Math.max(mins,1)} minutes ago`;
            if(days < 7) return `${days} day${days>1?'s':''} ago`;
            if(months < 12) return `${months} month${months>1?'s':''} ago`;
            return `${d.getFullYear()}`;
        }catch(e){return ''}
    }

    // Lightbox helper
    function openLightbox(videoId){
        let lb = document.getElementById('yt-lightbox');
        if(!lb){
            lb = document.createElement('div');
            lb.id = 'yt-lightbox';
            lb.addEventListener('click', function(e){
                if(e.target === lb) closeLightbox();
            });
            const frame = document.createElement('div');
            frame.className = 'frame';
            lb.appendChild(frame);
            document.body.appendChild(lb);
        }
        const frame = lb.querySelector('.frame');
        frame.innerHTML = `<iframe class="yt-iframe" src="https://www.youtube.com/embed/${videoId}?autoplay=1" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="width:100%; height:100%; border:0;"></iframe>`;
        lb.classList.add('active');
    }
    function closeLightbox(){
        const lb = document.getElementById('yt-lightbox');
        if(!lb) return;
        lb.classList.remove('active');
        setTimeout(()=>{ const f = lb.querySelector('.frame'); if(f) f.innerHTML = ''; }, 250);
    }



    // Render on pages
    document.addEventListener('DOMContentLoaded', function(){
        renderLinks('creatorLinks');
        renderVideos();
    });

    // Expose config for quick editing from console if desired
    window.__creatorConfig = config;
})();
