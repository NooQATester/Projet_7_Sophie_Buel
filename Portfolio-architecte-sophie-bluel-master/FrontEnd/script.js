// Variable globale accessible partout dans toutes les fonctions
let allProjects = []; 
let allCategories = [];

async function init() {    
    await displayGallery()
    await displayCategories()
    displayAdminDashboard()
}

//Récupération et affichage des projets dans la gallerie
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
    allCategories = await reponse.json()

    const categories = document.querySelector(".filters-container");
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

function displayAdminDashboard() {
    const token = localStorage.getItem("token");
	const openModal = document.querySelector(".openModal");
    const filtersContainer = document.querySelector(".filters-container");
    const loginLink = document.getElementById("login-link");


    // Affiche le bouton "modifier"
    // Cache les boutons filtres
    // Passe "Login" en "Logout" dans le menu
    // Affiche le bandeau noir
    if (token) {

        if (openModal) {
            openModal.style.display = "flex";
        }

        if (filtersContainer) {
            filtersContainer.style.display = "none";
        }

        loginLink.textContent = "logout";
        loginLink.href = "#";
        loginLink.addEventListener("click", (event) => {
            event.preventDefault();
            localStorage.removeItem("token");
            window.location.href = "index.html";
        });

        const body = document.getElementById('body');
    
        const divBanner = document.createElement('div');
        divBanner.className = 'banner';
    
        const iconBanner = document.createElement('i');
        iconBanner.className = 'fa-regular fa-pen-to-square';
    
        const editionBanner = document.createElement('p');
        editionBanner.textContent = 'Mode édition';
    
        divBanner.appendChild(iconBanner);
        divBanner.appendChild(editionBanner);
    
        body.insertBefore(divBanner, body.firstChild);
  
        body.style.marginTop = '40px';
    }
}


// Récupère tous les liens du menu
const navLinks = document.querySelectorAll("nav a");
// Met en surbrillance le lien actif
navLinks.forEach(link => {
  if (link.href === window.location.href) {
    link.classList.add("active");
  }
});

//Pour dire d'attendre que le contenu du DOM soit bien chargé avant d'éxécuter la fonction init
document.addEventListener('DOMContentLoaded', init);
