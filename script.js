document.addEventListener("DOMContentLoaded",()=>{
  const loader=document.querySelector(".site-loader");
  window.setTimeout(()=>loader.classList.add("is-hidden"),1150);

  const header=document.querySelector(".header");
  const onScroll=()=>header.classList.toggle("scrolled",window.scrollY>70);
  window.addEventListener("scroll",onScroll,{passive:true}); onScroll();

  const menu=document.querySelector(".mobile-menu");
  const menuBtn=document.querySelector(".menu-toggle");
  const toggleMenu=(open)=>{
    menu.classList.toggle("is-open",open);
    menu.setAttribute("aria-hidden",String(!open));
    menuBtn.setAttribute("aria-expanded",String(open));
    document.body.classList.toggle("modal-open",open);
  };
  menuBtn.addEventListener("click",()=>toggleMenu(!menu.classList.contains("is-open")));
  menu.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>toggleMenu(false)));

  const modal=document.querySelector("#booking-modal");
  const openModal=()=>{modal.classList.add("is-open");modal.setAttribute("aria-hidden","false");document.body.classList.add("modal-open");setTimeout(()=>modal.querySelector("input")?.focus(),120)};
  const closeModal=()=>{modal.classList.remove("is-open");modal.setAttribute("aria-hidden","true");document.body.classList.remove("modal-open")};
  document.querySelectorAll("[data-booking]").forEach(b=>b.addEventListener("click",openModal));
  document.querySelectorAll("[data-close-modal]").forEach(b=>b.addEventListener("click",closeModal));
  document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeModal();toggleMenu(false)}});

  document.querySelector("#booking-form").addEventListener("submit",e=>{
    e.preventDefault();
    const data=new FormData(e.currentTarget);
    const name=data.get("name")||"Belirtilmedi";
    const service=data.get("service")||"Belirtilmedi";
    const date=data.get("date")||"Belirtilmedi";
    const note=data.get("note")||"Yok";
    const msg="Merhaba Feyza Durmazoğlu Bolu, randevu talebinde bulunmak istiyorum.%0A%0AAd: "+encodeURIComponent(name)+"%0AHizmet: "+encodeURIComponent(service)+"%0ATercih edilen gün: "+encodeURIComponent(date)+"%0ANot: "+encodeURIComponent(note);
    window.open("https://wa.me/905347099081?text="+msg,"_blank","noopener");
  });

  const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if(!reduced && window.gsap){
    gsap.registerPlugin(ScrollTrigger);

    gsap.from(".hero-content>*",{y:35,opacity:0,duration:1.1,stagger:.08,ease:"power3.out",delay:1.05});
    gsap.to(".hero-media",{yPercent:18,ease:"none",scrollTrigger:{trigger:".hero",start:"top top",end:"bottom top",scrub:true}});
    gsap.to(".editorial-frame",{scale:1.16,scrollTrigger:{trigger:".editorial-image",start:"top 85%",end:"bottom 15%",scrub:1}});
    gsap.to(".editorial-frame img",{scale:.92,scrollTrigger:{trigger:".editorial-image",start:"top 85%",end:"bottom 15%",scrub:1}});
    gsap.from(".statement-copy h2",{y:70,opacity:0,duration:1,scrollTrigger:{trigger:".statement",start:"top 65%"}});
    gsap.to(".fullscreen-media img",{scale:1.08,scrollTrigger:{trigger:".fullscreen-panel",start:"top bottom",end:"bottom top",scrub:true}});
    gsap.from(".service-item",{y:35,opacity:0,stagger:.08,duration:.8,ease:"power3.out",scrollTrigger:{trigger:".service-list",start:"top 75%"}});
    gsap.from(".story-image",{y:70,opacity:0,duration:1,scrollTrigger:{trigger:".story",start:"top 70%"}});
    gsap.from(".review-grid blockquote",{y:40,opacity:0,stagger:.1,duration:.8,scrollTrigger:{trigger:".review-grid",start:"top 75%"}});
  }

  document.querySelectorAll(".magnetic").forEach(el=>{
    if(window.matchMedia("(pointer:fine)").matches){
      el.addEventListener("pointermove",e=>{
        const r=el.getBoundingClientRect(),x=e.clientX-r.left-r.width/2,y=e.clientY-r.top-r.height/2;
        el.style.transform="translate("+x*.12+"px,"+y*.12+"px)";
      });
      el.addEventListener("pointerleave",()=>el.style.transform="");
    }
  });
});