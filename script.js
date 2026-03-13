document.querySelectorAll(".dots").forEach(dotContainer => {

for(let i=0;i<5;i++){

let dot=document.createElement("span")

dot.addEventListener("click",()=>{

let dots=dotContainer.querySelectorAll("span")

dots.forEach((d,index)=>{

d.style.background=index<=i ? "#f0c400":"transparent"

})

})

dotContainer.appendChild(dot)

}

})
