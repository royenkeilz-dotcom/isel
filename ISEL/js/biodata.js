/* Advanced UI effects for biodata page
   - Particle background
   - Typewriter text reveal
   - Cursor glow trail
   - Scroll reveal (IntersectionObserver)
   - Parallax background
   - Floating objects
   - 3D card tilt
   - Glitch text
   - Color-changing accents
   - Image gallery lightbox
   - Music visualizer (optional)
   - Page transition
*/
(function(){
	// Utilities
	const $ = s => document.querySelector(s);
	const $$ = s => Array.from(document.querySelectorAll(s));

	/* --- Particle Background --- */
	function initParticles(){
		const canvas = document.createElement('canvas');
		canvas.className = 'particle-canvas';
		document.body.appendChild(canvas);
		const ctx = canvas.getContext('2d');
		let W, H, particles = [];

		function resize(){ W = canvas.width = innerWidth; H = canvas.height = innerHeight; }
		addEventListener('resize', resize);
		resize();

		const count = Math.max(60, Math.floor((W*H)/90000));
		function rand(min,max){return Math.random()*(max-min)+min}

		for(let i=0;i<count;i++){
			particles.push({
				x: Math.random()*W,
				y: Math.random()*H,
				r: rand(0.6,2.2),
				vx: rand(-0.2,0.6),
				vy: rand(-0.2,0.6),
				hue: rand(200,300)
			});
		}

		function draw(){
			ctx.clearRect(0,0,W,H);
			for(let p of particles){
				p.x += p.vx; p.y += p.vy;
				if(p.x>W+10) p.x=-10; if(p.x<-10) p.x=W+10;
				if(p.y>H+10) p.y=-10; if(p.y<-10) p.y=H+10;
				ctx.beginPath();
				const g = ctx.createRadialGradient(p.x,p.y,p.r*0.1,p.x,p.y,p.r*6);
				g.addColorStop(0, `hsla(${p.hue},80%,85%,0.9)`);
				g.addColorStop(0.3, `hsla(${p.hue},70%,70%,0.25)`);
				g.addColorStop(1, 'transparent');
				ctx.fillStyle = g; ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
			}
			requestAnimationFrame(draw);
		}
		draw();
	}

	/* --- Typewriter reveal for name --- */
	function initTypewriter(){
		const el = document.querySelector('header h1');
		if(!el) return;
		const text = el.textContent.trim();
		el.textContent = '';
		el.setAttribute('data-text', text);
		const caret = document.createElement('span'); caret.className='typewriter-caret';
		el.parentNode.appendChild(caret);
		let i=0;
		const speed = 70;
		function step(){
			if(i<=text.length){ el.textContent = text.slice(0,i); el.setAttribute('data-text', text); i++; setTimeout(step, speed + Math.random()*30); }
			else caret.remove();
		}
		step();
	}

	/* --- Cursor glow trail --- */
	function initCursorGlow(){
		const glow = document.createElement('div'); glow.className='cursor-glow'; document.body.appendChild(glow);
		let mx = -100, my = -100;
		addEventListener('mousemove', e=>{ mx=e.clientX; my=e.clientY; glow.style.transform = `translate(${mx}px, ${my}px)`; });
		// trailing small circles
		const trail = [];
		function trailLoop(){
			const t = document.createElement('div');
			t.style.position='fixed'; t.style.left=(mx)+'px'; t.style.top=(my)+'px'; t.style.width='10px'; t.style.height='10px'; t.style.borderRadius='50%';
			t.style.pointerEvents='none'; t.style.transform='translate(-50%,-50%)'; t.style.background='radial-gradient(circle,#fff,transparent)'; t.style.opacity='0.08'; t.style.zIndex=9998;
			document.body.appendChild(t); trail.push(t);
			if(trail.length>6){ const d=trail.shift(); d.remove(); }
			setTimeout(trailLoop,80);
		}
		trailLoop();
	}

	/* --- Scroll reveal --- */
	function initScrollReveal(){
		const io = new IntersectionObserver((entries)=>{
			for(const e of entries){ if(e.isIntersecting){ e.target.classList.add('in-view'); io.unobserve(e.target); }}
		},{threshold:0.14});
		$$('main > section, .gallery-grid img, .panel-accent').forEach(el=>io.observe(el));
	}

	/* --- Parallax effect --- */
	function initParallax(){
		const bg = document.body;
		addEventListener('scroll', ()=>{
			const sc = pageYOffset || document.documentElement.scrollTop;
			bg.style.backgroundPosition = `center ${-sc*0.02}px, center ${100 - sc*0.01}px, center`;
		},{passive:true});
	}

	/* --- Floating objects --- */
	function initFloating(){
		const floats = $$('.floating');
		let t0 = performance.now();
		function tick(t){
			const dt = (t - t0)/1000; t0 = t;
			floats.forEach((el,i)=>{
				const x = Math.sin((t/1500) + i)*6;
				const y = Math.cos((t/1200) + i)*8;
				el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
			});
			requestAnimationFrame(tick);
		}
		requestAnimationFrame(tick);
	}

	/* --- 3D card tilt --- */
	function initTilt(){
		$$('.panel-accent').forEach(card=>{
			card.classList.add('tilt');
			card.addEventListener('mousemove', e=>{
				const r = card.getBoundingClientRect();
				const px = (e.clientX - r.left)/r.width; const py = (e.clientY - r.top)/r.height;
				const rx = (py - 0.5)*8; const ry = (px - 0.5)*-8;
				card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(6px)`;
			});
			card.addEventListener('mouseleave', ()=>{ card.style.transform='perspective(900px) rotateX(0) rotateY(0)'; });
		});
	}

	/* --- Glitch text --- */
	function initGlitch(){
		const g = document.querySelector('.glitch');
		if(!g) return;
		g.setAttribute('data-text', g.textContent);
		setInterval(()=>{ g.classList.add('active'); setTimeout(()=>g.classList.remove('active'), 420); }, 2500 + Math.random()*2400);
	}

	/* --- Color changing accents --- */
	function initColorCycle(){
		const palette = [ ['#cfc7ff','#66f0d6'], ['#ffd6a5','#ffb3c1'], ['#a0e9fd','#c7b3ff'], ['#ffd36b','#9be7ff'] ];
		let idx=0;
		setInterval(()=>{
			idx = (idx+1)%palette.length; const [a,b]=palette[idx];
			document.documentElement.style.setProperty('--accent', a);
			document.documentElement.style.setProperty('--accent-2', b);
		}, 4200);
	}

	/* --- Image gallery lightbox --- */
	function initGallery(){
		const lightbox = document.createElement('div'); lightbox.className='lightbox';
		const img = document.createElement('img'); lightbox.appendChild(img); document.body.appendChild(lightbox);
		lightbox.addEventListener('click', ()=>lightbox.classList.remove('show'));
		$$('.gallery-grid img').forEach(i=>{
			i.style.cursor='zoom-in';
			i.addEventListener('click', ()=>{ img.src = i.src; lightbox.classList.add('show'); });
		});
	}

	/* --- Music visualizer (optional) --- */
	async function initVisualizer(){
		const audio = document.getElementById('bg-audio');
		if(!audio || !audio.src) return; // no audio provided
		try{
			const ctx = new (window.AudioContext||window.webkitAudioContext)();
			const src = ctx.createMediaElementSource(audio);
			const analyser = ctx.createAnalyser(); analyser.fftSize = 128;
			src.connect(analyser); analyser.connect(ctx.destination);
			const bufferLength = analyser.frequencyBinCount; const data = new Uint8Array(bufferLength);
			// inject visual container
			const vis = document.createElement('div'); vis.className='visualizer'; document.body.appendChild(vis);
			for(let i=0;i<bufferLength;i++){ const b=document.createElement('div'); b.className='bar'; vis.appendChild(b); }
			const bars = Array.from(vis.children);
			function loop(){ analyser.getByteFrequencyData(data); for(let i=0;i<bars.length;i++){ const h = Math.max(4,(data[i]/255)*60); bars[i].style.height = h + 'px'; } requestAnimationFrame(loop); }
			audio.play().catch(()=>{}); loop();
		}catch(e){ console.warn('visualizer init failed',e); }
	}

	/* --- Page transition --- */
	function initPageTransition(){
		const fade = document.createElement('div'); fade.className='page-fade'; document.body.appendChild(fade);
		setTimeout(()=>fade.classList.add('hidden'),100);
		// intercept internal links
		document.addEventListener('click', e=>{
			const a = e.target.closest('a'); if(!a) return; const href = a.getAttribute('href');
			if(!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('http')) return;
			e.preventDefault(); fade.classList.remove('hidden'); setTimeout(()=> location.href = href, 420);
		});
	}

	/* Init all */
	function initAll(){ initParticles(); initTypewriter(); initCursorGlow(); initScrollReveal(); initParallax(); initFloating(); initTilt(); initGlitch(); initColorCycle(); initGallery(); initVisualizer(); initPageTransition(); }

	if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', initAll); else initAll();

})();
