/* ============================================================
   LOGIN — SMKN 1 Katapang
   Cool animated login with multimedia floating icons,
   particle background, form interactions, and routing.
   ============================================================ */
(function(){
	'use strict';

	const $  = s => document.querySelector(s);
	const $$ = s => Array.from(document.querySelectorAll(s));

	/* ---------- Utilities ---------- */
	const rand = (min,max) => Math.random()*(max-min)+min;

	/* ---------- Particle background (canvas) ---------- */
	function initParticles(){
		const canvas = document.createElement('canvas');
		canvas.className = 'particle-canvas';
		Object.assign(canvas.style,{
			position:'fixed',inset:'0',zIndex:'1',
			pointerEvents:'none',mixBlendMode:'screen'
		});
		document.body.appendChild(canvas);
		const ctx = canvas.getContext('2d');
		let W,H,pts=[];
		function resize(){ W=canvas.width=innerWidth; H=canvas.height=innerHeight; }
		addEventListener('resize', resize); resize();

		const count = Math.max(60, Math.floor((W*H)/90000));
		for(let i=0;i<count;i++){
			pts.push({
				x:Math.random()*W, y:Math.random()*H,
				r:rand(.6,2.2), vx:rand(-.2,.6), vy:rand(-.2,.6),
				hue:rand(200,300)
			});
		}

		// connect nearby particles with faint lines (constellation)
		function draw(){
			ctx.clearRect(0,0,W,H);
			for(const p of pts){
				p.x+=p.vx; p.y+=p.vy;
				if(p.x>W+10)p.x=-10; if(p.x<-10)p.x=W+10;
				if(p.y>H+10)p.y=-10; if(p.y<-10)p.y=H+10;
				const g=ctx.createRadialGradient(p.x,p.y,p.r*.1,p.x,p.y,p.r*6);
				g.addColorStop(0,`hsla(${p.hue},80%,85%,.9)`);
				g.addColorStop(.3,`hsla(${p.hue},70%,70%,.25)`);
				g.addColorStop(1,'transparent');
				ctx.fillStyle=g; ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
			}
			// constellation lines
			for(let i=0;i<pts.length;i++){
				for(let j=i+1;j<pts.length;j++){
					const a=pts[i],b=pts[j];
					const d=Math.hypot(a.x-b.x,a.y-b.y);
					if(d<120){
						ctx.strokeStyle=`rgba(160,140,255,${(1-d/120)*0.12})`;
						ctx.lineWidth=.6; ctx.beginPath();
						ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
					}
				}
			}
			requestAnimationFrame(draw);
		}
		draw();
	}

	/* ---------- Cursor glow trail ---------- */
	function initCursorGlow(){
		const glow=document.createElement('div'); glow.className='cursor-glow';
		Object.assign(glow.style,{
			position:'fixed',left:'0',top:'0',width:'40px',height:'40px',borderRadius:'50%',
			pointerEvents:'none',mixBlendMode:'screen',zIndex:'9998',
			transform:'translate(-100px,-100px)',
			background:'radial-gradient(circle at 30% 30%, rgba(207,199,255,.9), rgba(102,240,214,.15) 45%, transparent 62%)'
		});
		document.body.appendChild(glow);
		let mx=-100,my=-100;
		addEventListener('mousemove',e=>{ mx=e.clientX; my=e.clientY; glow.style.transform=`translate(${mx}px,${my}px) translate(-50%,-50%)`; });
		const trail=[];
		function loop(){
			const t=document.createElement('div');
			t.style.cssText=`position:fixed;left:${mx}px;top:${my}px;width:8px;height:8px;border-radius:50%;pointer-events:none;transform:translate(-50%,-50%);background:radial-gradient(circle,#fff,transparent);opacity:.06;z-index:9997;`;
			document.body.appendChild(t); trail.push(t);
			if(trail.length>6){const d=trail.shift();d.remove();}
			setTimeout(loop,80);
		}
		loop();
	}

	/* ---------- Multimedia icons choreography ---------- */
	function initFloating(){
		const icons=$$('.float-icon');
		let t0=performance.now();
		function tick(t){
			const dt=(t-t0)/1000; t0=t;
			icons.forEach((el,i)=>{
				const x=Math.sin((t/1500)+i)*10;
				const y=Math.cos((t/1200)+i)*14;
				const r=Math.sin((t/2000)+(i*2))*6;
				el.style.transform=`translate3d(${x}px,${y}px,0) rotate(${r}deg)`;
			});
			requestAnimationFrame(tick);
		}
		requestAnimationFrame(tick);
	}

	/* ---------- Password visibility toggle ---------- */
	function initTogglePass(){
		const btn=$('#togglePass'), pass=$('#password');
		if(!btn||!pass) return;
		btn.addEventListener('click',()=>{
			const type = pass.type==='password' ? 'text' : 'password';
			pass.type=type;
			btn.textContent = type==='password' ? '👁️' : '🙈';
		});
	}

	/* ---------- Text typing of form title ---------- */
	function initTitle(){
		const el=$('.form-title');
		if(!el) return;
		const text=el.textContent;
		el.textContent='';
		let i=0;
		(function step(){
			if(i<=text.length){ el.textContent=text.slice(0,i); i++; setTimeout(step,45); }
		})();
	}

	/* ---------- Login validation + routing ---------- */
	function initLogin(){
		const form=$('#loginForm'), user=$('#username'), pass=$('#password');
		const err=$('#loginError'), btn=$('#btnLogin');
		const loginCard=$('#loginCard'), dest=$('#destination');
		const welcome=$('#welcomeName');

		// Fixed credentials (SMKN 1 Katapang student portal)
		const VALID_USERNAME = 'isel';
		const VALID_PASSWORD = 'isel galak';

		form.addEventListener('submit',e=>{
			e.preventDefault();
			err.classList.remove('show');

			const username = user.value.trim();
			const password = pass.value;

			// Empty field checks
			if(!username){ showErr('Username tidak boleh kosong!'); return; }
			if(!password){ showErr('Password tidak boleh kosong!'); return; }

			// Credential validation
			if(username !== VALID_USERNAME){
				showErr('Username tidak ditemukan!');
				return;
			}
			if(password !== VALID_PASSWORD){
				showErr('Password salah, coba lagi!');
				return;
			}

			// loading animation
			btn.classList.add('loading');
			btn.disabled=true;
			setTimeout(()=>{
				btn.classList.remove('loading');
				btn.disabled=false;
				// success: switch to destination chooser
				welcome.textContent = username;
				form.style.display='none';
				dest.style.display='block';
			},1200);
		});

		function showErr(msg){ err.textContent=msg; err.classList.add('show'); }
	}

	/* ---------- Logout ---------- */
	function initLogout(){
		const btn=$('#btnLogout');
		if(!btn) return;
		btn.addEventListener('click',()=>{
			const form=$('#loginForm'), dest=$('#destination');
			form.style.display='block';
			dest.style.display='none';
			$('#password').value='';
		});
	}

	/* ---------- Audio playback ---------- */
	function initAudio(){
		const audio = document.getElementById('bg-audio');
		if(!audio) return;
		audio.volume = 0.68;
	}

	/* ---------- Page transition on link click ---------- */
	function initTransitions(){
		const fade=$('#pageFade');
		$$('.dest-btn').forEach(a=>{
			a.addEventListener('click',e=>{
				const href=a.getAttribute('href');
				if(!href||href.startsWith('#')) return;
				e.preventDefault();
				fade.classList.add('active');
				setTimeout(()=>{ location.href=href; },500);
			});
		});
	}

	/* ---------- Shake error feedback ---------- */
	function shakeOnError(){
		const form=$('#loginForm'), err=$('#loginError');
		if(!form) return;
		const observer=new MutationObserver(()=>{
			if(err.classList.contains('show')){
				form.classList.remove('shake');
				void form.offsetWidth;
				form.classList.add('shake');
			}
		});
		observer.observe(err,{attributes:true,attributeFilter:['class']});
	}

	/* ---------- Init all ---------- */
	function initAll(){
		initParticles();
		initCursorGlow();
		initFloating();
		initTogglePass();
		initTitle();
		initLogin();
		initLogout();
		initAudio();
		initTransitions();
		shakeOnError();
	}

	if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',initAll);
	else initAll();
})();
