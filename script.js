function createDots(container){

for(let i=0;i<5;i++){

const dot=document.createElement("div")
dot.className="dot"

dot.onclick=()=>{
dot.classList.toggle("active")
}

container.appendChild(dot)

}

}

document.querySelectorAll(".dots").forEach(el=>{
createDots(el)
})
