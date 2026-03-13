// cria dots em todos os containers
document.querySelectorAll(".dots").forEach(container => {

    // cria 5 pontos
    for (let i = 0; i < 5; i++) {

        const dot = document.createElement("span")

        dot.addEventListener("click", () => {

            const dots = container.querySelectorAll("span")

            dots.forEach((d, index) => {

                if(index <= i){
                    d.style.background = "#f0c400"
                } else {
                    d.style.background = "transparent"
                }

            })

        })

        container.appendChild(dot)

    }

})
