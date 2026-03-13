document.querySelectorAll(".dots").forEach(container => {

for(let i=0;i<5;i++){

let dot=document.createElement("span")

dot.addEventListener("click",()=>{

let dots=container.querySelectorAll("span")

dots.forEach((d,index)=>{

if(index<=i){
d.style.background="#f0c400"
}else{
d.style.background="transparent"
}

})

})

container.appendChild(dot)

}

})
