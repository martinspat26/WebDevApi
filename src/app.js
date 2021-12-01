const feedDisplay = document.querySelector('#feed')



fetch('http://localhost:8000/news')  //vai buscar resultados
    .then(response => {return response.json()})
    .then(data => {
        data.forEach(articles => {
            const title = `<h3>` + articles.title + `</h3>`
            feedDisplay.insertAdjacentHTML("beforeend", title)
        })
    })
    .catch(err => console.log(err))

//https://www.youtube.com/watch?v=1wXYg8Eslnc&ab_channel=CodewithAniaKub%C3%B3w