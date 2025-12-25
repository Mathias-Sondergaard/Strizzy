// site.js — UI helpers: hamburger toggle and small UX niceties
(function(){
    const header = document.querySelector('header');
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');

    if(toggle && header){
        toggle.addEventListener('click', function(){
            const open = header.classList.toggle('open');
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            // prevent body scroll when nav open on mobile
            if(open) document.body.style.overflow = 'hidden'; else document.body.style.overflow = '';
        });

        // close nav on resize to larger screens
        window.addEventListener('resize', function(){
            if(window.innerWidth > 700 && header.classList.contains('open')){
                header.classList.remove('open');
                toggle.setAttribute('aria-expanded','false');
                document.body.style.overflow = '';
            }
        });

        // close nav when clicking outside on mobile
        document.addEventListener('click', function(e){
            if(!header.classList.contains('open')) return;
            if(!header.contains(e.target)){
                header.classList.remove('open');
                toggle.setAttribute('aria-expanded','false');
                document.body.style.overflow = '';
            }
        });
    }

    // Optional: when using hero with light/dark background, toggle header.solid on scroll
    const hero = document.querySelector('.hero');
    if(hero && header){
        const heroBottom = () => hero.getBoundingClientRect().bottom;
        function onScroll(){
            if(window.scrollY > Math.max(60, (hero.offsetHeight || 200) - 80)){
                header.classList.add('solid');
            } else {
                header.classList.remove('solid');
            }
        }
        window.addEventListener('scroll', onScroll, {passive:true});
        onScroll();
    }
    
    // Video carousel initializer (vertical 3D roller)
    window.initVideoCarousel = function(){
        const carousel = document.querySelector('.video-carousel');
        if(!carousel) return;
        const items = Array.from(carousel.querySelectorAll('.video-item'));
        if(items.length === 0) return;

        let current = 0;

        // set initial transforms
        function update(){
            items.forEach((it, i) => {
                const pos = i - current; // position relative to center
                it.setAttribute('data-pos', String(pos));
                const translateX = pos * 420; // horizontal spacing
                const translateZ = -Math.abs(pos) * 260; // depth
                const rotateY = pos * -14; // tilt in Y for horizontal carousel
                const scale = Math.max(0.7, 1 - Math.abs(pos) * 0.08);
                it.style.transform = `translate(-50%, -50%) translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`;
                it.style.opacity = (Math.abs(pos) > 5) ? '0' : String(Math.max(0, 1 - Math.abs(pos) * 0.14));
                it.style.pointerEvents = (pos === 0) ? 'auto' : 'none';
            });
        }

        update();

        function clampIndex(n){
            if(n < 0) return 0;
            if(n > items.length - 1) return items.length -1;
            return n;
        }

        // wheel to navigate (use vertical wheel to scroll horizontally across carousel)
        let wheelTimeout;
        carousel.addEventListener('wheel', function(e){
            // prefer deltaY to navigate left/right
            e.preventDefault();
            const delta = e.deltaY || e.deltaX;
            if(delta > 10){ current = clampIndex(current + 1); }
            else if(delta < -10){ current = clampIndex(current - 1); }
            update();
            clearTimeout(wheelTimeout);
            wheelTimeout = setTimeout(()=>{},150);
        }, {passive:false});

        // keyboard (Left/Right)
        window.addEventListener('keydown', function(e){
            if(e.key === 'ArrowRight'){ current = clampIndex(current + 1); update(); }
            if(e.key === 'ArrowLeft'){ current = clampIndex(current - 1); update(); }
        });

        // touch gestures (swipe left/right)
        let startX = null;
        carousel.addEventListener('touchstart', function(e){ startX = e.touches[0].clientX; }, {passive:true});
        carousel.addEventListener('touchmove', function(e){
            if(startX === null) return;
            const diff = startX - e.touches[0].clientX;
            if(Math.abs(diff) > 40){
                if(diff > 0) current = clampIndex(current + 1);
                else current = clampIndex(current - 1);
                update();
                startX = null;
            }
        }, {passive:true});

        // click center to play (video iframe already wired on thumb click)
        // expose control
        carousel.prev = function(){ current = clampIndex(current -1); update(); };
        carousel.next = function(){ current = clampIndex(current +1); update(); };
    };
})();
