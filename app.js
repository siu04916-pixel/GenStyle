(function(){
var HEART="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";
var SUB="Produk pilihan GenStyle. Klik tombol untuk menuju toko penjual.";
var rank={},liked={},tracked={};
var g=document.getElementById("grid"),q=document.getElementById("q"),s=document.getElementById("s"),sub=document.getElementById("sub");
var calm=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
try{liked=JSON.parse(localStorage.getItem("gs-liked")||"{}")||{}}catch(e){liked={}}
function saveLiked(){try{localStorage.setItem("gs-liked",JSON.stringify(liked))}catch(e){}}
function esc(t){var d=document.createElement("div");d.textContent=t;return d.innerHTML.replace(/"/g,"&quot;")}

function draw(){
var k=q.value.trim().toLowerCase();
var L=P.filter(function(p){return (p.name+" "+p.meta).toLowerCase().indexOf(k)>-1});
if(s.value==="az"){L.sort(function(a,b){return a.name.localeCompare(b.name)})}
else{L.sort(function(a,b){var ra=rank[a.id]||99,rb=rank[b.id]||99;return ra!==rb?ra-rb:P.indexOf(a)-P.indexOf(b)})}
g.innerHTML=L.length?L.map(function(p){
var r=rank[p.id];
return '<article class="card'+(r?' hot':'')+'"><div class="pic"><img src="'+p.img+'" alt="'+esc(p.name)+'" loading="lazy" onerror="this.style.display=\'none\'">'
+(r?'<span class="rank">Top '+r+'</span>':'')
+'<button class="heart" type="button" data-id="'+p.id+'" aria-pressed="'+(!!liked[p.id])+'" aria-label="Suka '+esc(p.name)+'"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="'+HEART+'" fill="url(#hg)"/></svg></button></div>'
+'<div class="info"><b>'+esc(p.name)+'</b>'+(p.meta?'<span>'+esc(p.meta)+'</span>':'')
+'<a class="btn" data-id="'+p.id+'" href="'+p.url+'" rel="sponsored noopener noreferrer" target="_blank">Menuju Ke Toko</a></div></article>';
}).join(""):'<div class="empty">Produk tidak ditemukan.</div>';
sub.textContent=Object.keys(rank).length?SUB+" Label Top menandai produk yang paling sering dikunjungi 7 hari terakhir.":SUB;
}

function burst(btn){
btn.classList.remove("burst");void btn.offsetWidth;btn.classList.add("burst");
setTimeout(function(){btn.classList.remove("burst")},950);
if(calm)return;
for(var i=0;i<8;i++){
var p=document.createElement("i");p.className="pt";p.textContent="\u2665";
p.style.setProperty("--dx",(Math.random()*110-70)+"px");
p.style.setProperty("--dy",(-(30+Math.random()*70))+"px");
p.style.setProperty("--s",(.7+Math.random()*.9).toFixed(2));
btn.appendChild(p);
(function(n){setTimeout(function(){if(n.parentNode)n.parentNode.removeChild(n)},1000)})(p);
}
}

function track(id){
if(tracked[id])return;tracked[id]=1;
try{fetch("/api/click",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:id}),keepalive:true}).catch(function(){})}catch(e){}
}

function loadTop(){
try{
fetch("/api/top").then(function(r){return r.ok?r.json():null}).then(function(j){
if(!j||!j.top||!j.top.length)return;
var ids={};P.forEach(function(p){ids[p.id]=1});
var next={},n=0;
j.top.forEach(function(t){if(ids[t.id]&&n<5){n++;next[t.id]=n}});
rank=next;draw();
}).catch(function(){});
}catch(e){}
}

g.addEventListener("click",function(e){
var h=e.target.closest(".heart");
if(h){var id=h.getAttribute("data-id");liked[id]=!liked[id];h.setAttribute("aria-pressed",!!liked[id]);saveLiked();if(liked[id])burst(h);return}
var a=e.target.closest("a.btn[data-id]");if(a)track(a.getAttribute("data-id"));
});
g.addEventListener("auxclick",function(e){var a=e.target.closest("a.btn[data-id]");if(a)track(a.getAttribute("data-id"))});
q.addEventListener("input",draw);s.addEventListener("change",draw);
draw();loadTop();

var bs=document.getElementById("brands"),pn=document.getElementById("panel");
function pick(i){
bs.querySelectorAll(".chip").forEach(function(c,j){c.setAttribute("aria-selected",j===i)});
pn.innerHTML="<h3>"+esc(B[i][0])+"</h3><p>"+esc(B[i][1])+"</p><p><small>Status verifikasi: belum diverifikasi (contoh)</small></p>";
}
bs.innerHTML=B.map(function(b,i){return '<button class="chip" role="tab" data-i="'+i+'">'+esc(b[0])+'</button>'}).join("");
bs.addEventListener("click",function(e){var c=e.target.closest(".chip");if(c)pick(+c.getAttribute("data-i"))});
pick(0);
})();
