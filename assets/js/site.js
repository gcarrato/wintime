// Wintime Negócios — UI interactions
(function(){
  // Header scroll state
  const header = document.querySelector('.site-header');
  const onScroll = () => header && header.classList.toggle('scrolled', window.scrollY > 30);
  window.addEventListener('scroll', onScroll, {passive:true}); onScroll();

  // Mobile menu toggle (with backdrop)
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav-links');
  let backdrop;
  if(toggle && nav){
    backdrop = document.createElement('div');
    backdrop.className = 'menu-backdrop';
    document.body.appendChild(backdrop);
    const closeMenu = () => {
      nav.classList.remove('open');
      toggle.classList.remove('open');
      backdrop.classList.remove('show');
      document.body.style.overflow = '';
    };
    const openMenu = () => {
      nav.classList.add('open');
      toggle.classList.add('open');
      backdrop.classList.add('show');
      document.body.style.overflow = 'hidden';
    };
    toggle.addEventListener('click', () => {
      nav.classList.contains('open') ? closeMenu() : openMenu();
    });
    backdrop.addEventListener('click', closeMenu);
    nav.querySelectorAll('.has-dropdown > a').forEach(a=>{
      a.addEventListener('click', e=>{
        if(window.innerWidth <= 960){
          e.preventDefault();
          a.parentElement.classList.toggle('open');
        }
      });
    });
    // close menu when clicking a real link on mobile
    nav.querySelectorAll('a:not(.has-dropdown > a)').forEach(a=>{
      a.addEventListener('click', () => { if(window.innerWidth<=960) closeMenu(); });
    });
    window.addEventListener('resize', () => { if(window.innerWidth>960) closeMenu(); });
  }

  // Hero slider
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  if(slides.length){
    let idx = 0;
    const go = i => {
      slides.forEach((s,j)=>s.classList.toggle('active', j===i));
      dots.forEach((d,j)=>d.classList.toggle('active', j===i));
      idx = i;
    };
    dots.forEach((d,i)=>d.addEventListener('click', ()=>go(i)));
    setInterval(()=>go((idx+1)%slides.length), 6500);
  }

  // Testimonials carousel
  const carousel = document.querySelector('.testi-carousel');
  if(carousel){
    const track = carousel.querySelector('.testi-track');
    const slidesT = carousel.querySelectorAll('.testi-slide');
    const prev = carousel.querySelector('.testi-prev');
    const next = carousel.querySelector('.testi-next');
    const dotsWrap = carousel.querySelector('.testi-dots');
    let pos = 0;
    const perView = () => window.innerWidth <= 640 ? 1 : window.innerWidth <= 960 ? 2 : 3;
    const maxPos = () => Math.max(0, slidesT.length - perView());
    const render = () => {
      const slideW = slidesT[0].getBoundingClientRect().width + 24;
      track.style.transform = `translateX(-${pos * slideW}px)`;
      if(dotsWrap){
        dotsWrap.innerHTML = '';
        for(let i=0;i<=maxPos();i++){
          const b = document.createElement('button');
          if(i===pos) b.classList.add('active');
          b.addEventListener('click',()=>{pos=i;render();});
          dotsWrap.appendChild(b);
        }
      }
    };
    const go = d => { pos = Math.max(0, Math.min(maxPos(), pos+d)); render(); };
    prev && prev.addEventListener('click', ()=>go(-1));
    next && next.addEventListener('click', ()=>go(1));
    window.addEventListener('resize', () => { pos = Math.min(pos, maxPos()); render(); });
    // autoplay
    let auto = setInterval(()=>{ pos = pos>=maxPos()?0:pos+1; render(); }, 5500);
    carousel.addEventListener('mouseenter', ()=>clearInterval(auto));
    // touch swipe
    let sx=0;
    track.addEventListener('touchstart', e=>{ sx = e.touches[0].clientX; },{passive:true});
    track.addEventListener('touchend', e=>{
      const dx = e.changedTouches[0].clientX - sx;
      if(Math.abs(dx) > 40) go(dx<0?1:-1);
    });
    setTimeout(render, 50);
  }

  // Reveal on scroll
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target); }});
  },{threshold:.12});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

  // Tabs (tabela page)
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');
  tabBtns.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const t = btn.dataset.tab;
      tabBtns.forEach(b=>b.classList.toggle('active', b===btn));
      tabPanes.forEach(p=>p.classList.toggle('active', p.id===t));
      const tabsNav = document.querySelector('.tabs-nav');
      if(tabsNav) window.scrollTo({top: tabsNav.offsetTop - 100, behavior:'smooth'});
      // ensure active tab is visible in horizontal scroll
      btn.scrollIntoView({behavior:'smooth', inline:'center', block:'nearest'});
    });
  });


  // Click-to-load video (YouTube) — avoids slow load & player config errors
  document.querySelectorAll('[data-video-id]').forEach(wrap=>{
    const btn = wrap.querySelector('.video-facade');
    if(!btn) return;
    btn.addEventListener('click', ()=>{
      const id = wrap.dataset.videoId;
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1&modestbranding=1`;
      iframe.title = 'Wintime Negócios';
      iframe.setAttribute('allow','accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
      iframe.allowFullscreen = true;
      btn.replaceWith(iframe);
    });
  });

  // Click-to-load map — keeps the homepage fast
  document.querySelectorAll('[data-map-src]').forEach(wrap=>{
    const btn = wrap.querySelector('.media-facade');
    if(!btn) return;
    btn.addEventListener('click', ()=>{
      const iframe = document.createElement('iframe');
      iframe.src = wrap.dataset.mapSrc;
      iframe.title = 'Mapa Clientes Wintime Negócios';
      iframe.loading = 'lazy';
      btn.replaceWith(iframe);
    });
  });

  // Footer year
  const y = document.getElementById('year'); if(y) y.textContent = new Date().getFullYear();
})();
