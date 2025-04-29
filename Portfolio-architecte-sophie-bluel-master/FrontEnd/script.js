async function init() {    
    await displayGallery()
    await displayCategories()
    
    const loginLink = document.getElementById("login-link");
    if (localStorage.getItem("token")) {
        loginLink.textContent = "logout";
        loginLink.href = "#";
        loginLink.addEventListener("click", (event) => {
            event.preventDefault();
            localStorage.removeItem("token");
            window.location.href = "index.html";
    });

}}

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

// Récupère tous les liens du menu
const navLinks = document.querySelectorAll("nav a");

navLinks.forEach(link => {
  if (link.href === window.location.href) {
    link.classList.add("active");
  }
});

//Permet d'ajouter le bloc "modifier" à la connexion uniquement
document.addEventListener("DOMContentLoaded", () => {
	const token = localStorage.getItem("token");
	const openModal = document.querySelector(".openModal");

	if (token && openModal) {
		openModal.style.display = "flex";
	}

//Permet de supprimer les boutons de filtre en mode déconnexion uniquement
    const filtersContainer = document.querySelector(".filters-container");
	if (token && filtersContainer) {
		filtersContainer.style.display = "none";
	}
});


//---------------------------------Création du bandeau noir si connecté---------------------------------

document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
  
    if (token) {
      // Affiche la bannière édition sans toucher au reste
      const body = document.getElementById('body');
  
      const divBanner = document.createElement('div');
      divBanner.id = 'divBanner';
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
  });
    

  


//Pour dire d'attendre que le contenu du DOM soit bien chargé avant d'éxécuter le fichier JS
document.addEventListener('DOMContentLoaded', init);
