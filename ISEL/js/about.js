/* ============================================================
   ABOUT — Gisela Pitrianti
   Space / astronaut animated page:
   - Particle starfield canvas
   - Multimedia icons choreography
   - Cursor glow trail
   - Scroll reveal
   - Photo lightbox
   - Space shooting stars (CSS handled, JS adds extras)
   ============================================================ */
(function(){
	'use strict';

	const $  = s => document.querySelector(s);
	const $$ = s => Array.from(document.querySelectorAll(s));
	const rand = (min,max) => Math.random()*(max-min)+min;

	/* ---------- Particle starfield canvas ---------- */
	function initParticles(){
		const canvas = document.createElement('canvas');
		canvas.style.cssText = 'position:fixed;inset:0;z-index:0;pointer-events:none;mix-blend-mode:screen;';
		document.body.appendChild(canvas);
		const ctx = canvas.getContext('2d');
		let W,H,stars=[];
		function resize(){ W=canvas.width=innerWidth; H=canvas.height=innerHeight; }
		addEventListener('resize',resize); resize();

		const count = Math.max(70, Math.floor((W*H)/80000));
		for(let i=0;i<count;i++){
			stars.push({
				x:Math.random()*W, y:Math.random()*H,
				r:rand(.5,2.4), vx:rand(-.3,.3), vy:rand(-.3,.3),
				hue:rand(200,320), tw:rand(0,Math.PI*2)
			});
		}

		function draw(now){
			ctx.clearRect(0,0,W,H);
			for(const s of stars){
				s.x+=s.vx; s.y+=s.vy;
				if(s.x>W+10)s.x=-10; if(s.x<-10)s.x=W+10;
				if(s.y>H+10)s.y=-10; if(s.y<-10)s.y=H+10;
				const a=0.4+0.6*Math.abs(Math.sin(now/400+s.tw));
				const g=ctx.createRadialGradient(s.x,s.y,s.r*.1,s.x,s.y,s.r*5);
				g.addColorStop(0,`hsla(${s.hue},85%,90%,${a})`);
				g.addColorStop(.4,`hsla(${s.hue},70%,75%,${a*0.4})`);
				g.addColorStop(1,'transparent');
				ctx.fillStyle=g; ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fill();
			}
			requestAnimationFrame(draw);
		}
		requestAnimationFrame(draw);
	}

	/* ---------- Cursor glow trail ---------- */
	function initCursorGlow(){
		const glow=document.createElement('div');
		glow.style.cssText='position:fixed;left:0;top:0;width:44px;height:44px;border-radius:50%;pointer-events:none;mix-blend-mode:screen;z-index:9997;transform:translate(-100px,-100px);background:radial-gradient(circle at 30% 30%, rgba(207,199,255,.9), rgba(102,240,214,.16) 45%, transparent 62%);box-shadow:0 0 30px rgba(160,140,255,.4);';
		document.body.appendChild(glow);
		let mx=-100,my=-100;
		addEventListener('mousemove',e=>{ mx=e.clientX; my=e.clientY; glow.style.transform=`translate(${mx}px,${my}px) translate(-50%,-50%)`; });
		const trail=[];
		function loop(){
			const t=document.createElement('div');
			t.style.cssText=`position:fixed;left:${mx}px;top:${my}px;width:9px;height:9px;border-radius:50%;pointer-events:none;transform:translate(-50%,-50%);background:radial-gradient(circle,#fff,transparent);opacity:.07;z-index:9996;`;
			document.body.appendChild(t); trail.push(t);
			if(trail.length>7){const d=trail.shift();d.remove();}
			setTimeout(loop,80);
		}
		loop();
	}

	/* ---------- Multimedia icons choreography ---------- */
	function initFloating(){
		const icons=$$('.float-icon');
		let t0=performance.now();
		function tick(t){
			t0=t;
			icons.forEach((el,i)=>{
				const x=Math.sin((t/1400)+i)*12;
				const y=Math.cos((t/1100)+i)*16;
				const r=Math.sin((t/1900)+(i*2))*7;
				el.style.transform=`translate3d(${x}px,${y}px,0) rotate(${r}deg)`;
			});
			requestAnimationFrame(tick);
		}
		requestAnimationFrame(tick);
	}

	/* ---------- Scroll reveal (with stagger) ---------- */
	function initScrollReveal(){
		const io=new IntersectionObserver((entries)=>{
			for(const e of entries){
				if(e.isIntersecting){
					e.target.classList.add('in-view');
					io.unobserve(e.target);
				}
			}
		},{threshold:.12});
		$$('.panel').forEach((el,i)=>{
			el.style.transitionDelay = (i%3)*0.08+'s';
			io.observe(el);
		});
	}

	/* ---------- Photo lightbox ---------- */
	function initLightbox(){
		const lb=$('#lightbox'), img=lb.querySelector('img');
		$$('.frame img').forEach(i=>{
			i.parentElement.style.cursor='zoom-in';
			i.parentElement.addEventListener('click',()=>{
				img.src=i.src; lb.classList.add('show');
			});
		});
		lb.addEventListener('click',()=>lb.classList.remove('show'));
	}

	/* ---------- Film video player ---------- */
	function initFilmVideo(){
		$$('.film-video').forEach(vid=>{
			const video=vid.querySelector('video');
			const playBtn=vid.parentElement.querySelector('.play-video');
			if(!video||!playBtn) return;
			playBtn.addEventListener('click',()=>{
				video.play();
				playBtn.style.display='none';
				vid.classList.add('playing');
			});
			video.addEventListener('play',()=>{ playBtn.style.display='none'; vid.classList.add('playing'); });
			video.addEventListener('pause',()=>{ playBtn.style.display='flex'; vid.classList.remove('playing'); });
			video.addEventListener('ended',()=>{ playBtn.style.display='flex'; vid.classList.remove('playing'); });
		});
	}

	/* ---------- Shooting stars spawn occasionally (JS extra) ---------- */
	function initShooting(){
		const bg=$('.space-bg');
		if(!bg) return;
		setInterval(()=>{
			if(Math.random()<0.4){
				const ss=document.createElement('div');
				ss.className='shooting-star';
				ss.style.top=rand(5,85)+'%';
				ss.style.animationDuration=rand(4,6)+'s';
				bg.appendChild(ss);
				setTimeout(()=>ss.remove(),6000);
			}
		},4000);
	}

	/* ---------- Glitch title periodic effect ---------- */
	function initGlitch(){
		const el=$('.glitch-title');
		if(!el) return;
		el.setAttribute('data-text', el.textContent.trim());
		setInterval(()=>{
			el.classList.add('active');
			setTimeout(()=>el.classList.remove('active'),300);
		},3500+Math.random()*2500);
	}

	/* ---------- Set up twinkling accent palette cycle ---------- */
	function initColorCycle(){
		const palettes=[ ['#cfc7ff','#66f0d6','#ffb3c1'], ['#a0e9fd','#c7b3ff','#ffd6a5'], ['#ffb3c1','#9be7ff','#d9c8ff'] ];
		let idx=0;
		setInterval(()=>{
			idx=(idx+1)%palettes.length;
			const [a,b,c]=palettes[idx];
			document.documentElement.style.setProperty('--accent',a);
			document.documentElement.style.setProperty('--accent-2',b);
			document.documentElement.style.setProperty('--accent-3',c);
		},6000);
	}

	/* ---------- Audio player setup ---------- */
	function initAudio(){
		const audio = document.getElementById('bg-audio');
		if(!audio) return;
		if(!audio.src){ audio.src = '../audio/bg-music.mp3'; }
		audio.volume = 0.72;
	}

	/* ---------- Page transition on internal links ---------- */
	function initTransitions(){
		const fade=$('#pageFade');
		$$('a').forEach(a=>{
			const href=a.getAttribute('href');
			if(!href||href.startsWith('#')||href.startsWith('http')||href.startsWith('mailto')) return;
			a.addEventListener('click',e=>{
				e.preventDefault();
				fade.classList.add('active');
				setTimeout(()=>{ location.href=href; },500);
			});
		});
	}

	/* ---------- Init ---------- */
	function initAll(){
		initParticles();
		initCursorGlow();
		initFloating();
		initScrollReveal();
		initLightbox();
		initFilmVideo();
		initShooting();
		initGlitch();
		initColorCycle();
		initAudio();
		initTransitions();
	}

	if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',initAll);
	else initAll();
})();
