const ImgBox = document.querySelector(".img-box");
const ImgWrap = document.querySelector(".img-wrap");
const ImgOriginal = document.getElementById("original");
const ImgLine = document.getElementById("line");


ImgOriginal.style.width = ImgBox.offsetWidth + "px";

const Leftspace = ImgBox.offsetLeft;

ImgBox.onmousemove = function(e){
 const boxWidth = (e.pageX - Leftspace) + "px";
 ImgWrap.style.width = boxWidth;
 ImgLine.style.left = boxWidth;
}