//------------------------------------------------------Gestion de la modale------------------------------------------------------
// Sélectionne l'élément <aside> qui est la modale
const modal = document.querySelector(".modal");

// Bouton qui ouvre la modale
const openModalBtn = document.querySelector(".openModal");

// Icône de fermeture
const closeModalIcon = document.querySelector(".closeIcon");


// Clique sur "modifier"
openModalBtn.addEventListener("click", openModal);

// Clique sur la croix pour fermer
closeModalIcon.addEventListener("click", closeModal);

// Clique en dehors de la fenêtre (sur le fond gris) pour fermer
modal.addEventListener("click", function (e) {
  if (e.target === modal) {
    closeModal();
  }
});


//-------------------------------------------------Ajout de la gallerie à la modale-------------------------------------------------

function displayModalGallery() {
    const modalGallery = document.querySelector(".modal-gallery");
    modalGallery.innerHTML = "";

    allProjects.forEach(project => {
        const figure = document.createElement("figure");

        const img = document.createElement("img");
        img.src = project.imageUrl;
        img.alt = project.title;

        const deleteIcon = document.createElement("i");
        deleteIcon.classList.add("fa-solid", "fa-trash-can", "delete-icon");

        deleteIcon.addEventListener("click", function() {
            removeProject(project.id, figure);
        });

        figure.appendChild(img);
        figure.appendChild(deleteIcon);
        modalGallery.appendChild(figure);
    });
}

function openModal() {
    modal.style.display = "flex";
    modal.setAttribute("aria-hidden", "false");
    displayModalGallery();
}

// Fonction pour fermer la modale
function closeModal() {
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
}

function removeProject(idProject, figureElement) {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5678/api/works/" + idProject, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + token
        }
    })
    .then(response => {
        if (response.ok) {
            // Supprimer l'élément du DOM
            figureElement.remove();

            // Suppression dans la galerie principale
            displayGallery();

            // Supprimer aussi du tableau allProjects
            allProjects = allProjects.filter(project => project.id !== idProject);
        } else {
            alert("Erreur lors de la suppression du projet.");
        }
    })

}
