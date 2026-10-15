/* VIDEO MANAGER — edit paths here only. Use <video data-video="key"></video> */
const VIDEOS = {
  "showreel":{src:"assets/video/showreel.mp4",poster:"assets/img/showreel.jpg"},
  "thumb-reel":{src:"assets/video/thumb-reel.mp4",poster:"assets/img/thumb-reel.jpg"}
};
const VideoManage = {
  init(){
    const io = new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting?e.target.play().catch(()=>{}):e.target.pause()),{threshold:.25});
    document.querySelectorAll("[data-video]").forEach(v=>{
      const d = VIDEOS[v.dataset.video]; if(!d) return console.warn("Missing video key:",v.dataset.video);
      v.src = d.src; v.poster = d.poster||""; v.muted = true; v.loop = true; v.playsInline = true; v.preload = "metadata";
      io.observe(v); });
  }
};
document.addEventListener("DOMContentLoaded", VideoManage.init);
