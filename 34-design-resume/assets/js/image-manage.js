/* IMAGE MANAGER — edit paths here only. Use <img data-img="key"> */
const IMAGES = {
  "latest-1":"assets/img/latest-1.jpg","latest-2":"assets/img/latest-2.jpg","latest-3":"assets/img/latest-3.jpg",
  "services":"assets/img/services.jpg",
  "work-1":"assets/img/work-1.jpg","work-2":"assets/img/work-2.jpg","work-3":"assets/img/work-3.jpg","work-4":"assets/img/work-4.jpg",
  "about":"assets/img/about.jpg",
  "logo-1":"assets/img/logo-1.png","logo-2":"assets/img/logo-2.png","logo-3":"assets/img/logo-3.png","logo-4":"assets/img/logo-4.png",
  "logo-5":"assets/img/logo-5.png","logo-6":"assets/img/logo-6.png","logo-7":"assets/img/logo-7.png","logo-8":"assets/img/logo-8.png"
};
const ImageManage = {
  init(){ document.querySelectorAll("[data-img]").forEach(el=>{
    const src = IMAGES[el.dataset.img]; if(!src) return console.warn("Missing image key:",el.dataset.img);
    el.src = src; el.loading = "lazy"; if(!el.alt) el.alt = el.dataset.img; }); }
};
document.addEventListener("DOMContentLoaded", ImageManage.init);
