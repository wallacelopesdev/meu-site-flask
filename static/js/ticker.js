  // ticker: scroll vertical vira movimento horizontal
  (function(){
    const space=$('scroll-space'), track=$('ticker-track');
    if(!window.gsap||!window.ScrollTrigger||reduce){space.classList.add('static');return}
    gsap.registerPlugin(ScrollTrigger);
    const move=gsap.to(track,{x:()=>-(track.scrollWidth-window.innerWidth),ease:'none',
      scrollTrigger:{trigger:space,start:'top top',end:'bottom bottom',scrub:1,invalidateOnRefresh:true}});
    track.querySelectorAll('.word-group').forEach(g=>gsap.fromTo(g,{scale:.95,opacity:.5},{scale:1,opacity:1,ease:'none',
      scrollTrigger:{trigger:g,containerAnimation:move,start:'left 90%',end:'left 60%',scrub:true}}));
    track.querySelectorAll('path[data-draw]').forEach(p=>{
      const len=p.getTotalLength();gsap.set(p,{strokeDasharray:len,strokeDashoffset:len});
      gsap.to(p,{strokeDashoffset:0,ease:'none',scrollTrigger:{trigger:p,containerAnimation:move,start:'left 85%',end:'left 45%',scrub:true}});
    });
  })();

