async function init() {
    await displayGallery()
    await displayCategories()
}

let allProjects = []; // Variable globale accessible partout dans toutes les fonctions

async function displayGallery(projects) {
    if (!projects){
        const reponse = await fetch("http://localhost:5678/api/works")
        allProjects = await reponse.json()
        projects = allProjects
    }
    
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";

    projects.forEach(project => {
        const figureElement = document.createElement("figure");
        const imgElement = document.createElement("img");
        imgElement.src = project.imageUrl
        imgElement.alt = project.title
        const figcaptionElement = document.createElement("figcaption");
        figcaptionElement.innerText = project.title

        figureElement.appendChild(imgElement);
        figureElement.appendChild(figcaptionElement);
        gallery.appendChild(figureElement);
    });
}

async function displayCategories() {
    const reponse = await fetch("http://localhost:5678/api/categories")
    const allCategories = await reponse.json()

    const categories = document.querySelector(".filters-container");
    //Il faudra ajouter ici une variable avec tous les projets dedans

    //Création du bouton "Tous"
    const buttonAll = document.createElement("button");
    buttonAll.innerText = "Tous"
    buttonAll.classList.add("filter-button");

    buttonAll.addEventListener("click", function () {
        displayGallery();
    });


    categories.appendChild(buttonAll);
    
    //Boucle pour récupérer et afficher les autres boutons
    allCategories.forEach(categorie => {
        const buttonElement = document.createElement("button");
        buttonElement.innerText = categorie.name
        buttonElement.classList.add("filter-button");

        buttonElement.addEventListener("click", function () {
            const projectsFilters = allProjects.filter(function (project) {
                return project.category.name === categorie.name;
            });
            displayGallery(projectsFilters);
        });

        categories.appendChild(buttonElement);
    });
    
}

//Pour dire d'attendre que le contenu du DOM soit bien chargé avant d'éxécuter le fichier JS
document.addEventListener('DOMContentLoaded', init);
