function createDots(container,count=5){

for(let i=0;i<count;i++){

const dot=document.createElement("div")
dot.className="dot"

dot.onclick=()=>{

dot.classList.toggle("active")
saveData()

}

container.appendChild(dot)

}

}

document.querySelectorAll(".dots").forEach(el=>{
createDots(el)
})

function saveData(){

const data={}

document.querySelectorAll("input,textarea").forEach(el=>{
data[el.id]=el.value
})

document.querySelectorAll(".dots").forEach(el=>{

const id=el.dataset.trait
const active=el.querySelectorAll(".active").length

data[id]=active

})

localStorage.setItem("scionCharacter",JSON.stringify(data))

}

function loadData(){

const data=JSON.parse(localStorage.getItem("scionCharacter"))

if(!data)return

document.querySelectorAll("input,textarea").forEach(el=>{
if(data[el.id])el.value=data[el.id]
})

document.querySelectorAll(".dots").forEach(el=>{

const id=el.dataset.trait
const value=data[id]

if(value){

const dots=el.children

for(let i=0;i<value;i++){
dots[i].classList.add("active")
}

}

})

}

document.querySelectorAll("input,textarea").forEach(el=>{
el.onchange=saveData
})

loadData()
