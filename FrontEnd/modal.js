//---------------------Gestion de la modale---------------------
function addProjectModal() {
    const formAddPicture = document.querySelector(".add-picture");

    formAddPicture.addEventListener("submit", async function (event) {
        event.preventDefault();

        const imageInput = document.getElementById("image-upload");
        const titleInput = document.getElementById("title");
        const categorySelect = document.getElementById("category");

        const image = imageInput.files[0];
        const title = titleInput.value;
        const category = categorySelect.value;

        // Validation des champs avec message d'erreur si incomplet
        if (!image || !title || !category) {
            alert("Veuillez remplir tous les champs du formulaire.");
            return;
        }

        const formData = new FormData();
        formData.append("image", image);
        formData.append("title", title);
        formData.append("category", category);

        const token = localStorage.getItem("token");

        try {
            const response = await fetch("http://localhost:5678/api/works", {
                method: "POST",
                headers: {
                    Authorization: "Bearer " + token
                },
                body: formData,
            });

            if (response.ok) {
                const newProject = await response.json();

                // Ajout au tableau global
                allProjects.push(newProject);

                // Mise à jour immédiate des galeries
                displayGallery();
                displayModalGallery();

                // Réinitialiser le formulaire
                formAddPicture.reset();
                const placeholder = document.querySelector(".upload-placeholder");
                const icon = placeholder.querySelector(".fa-image");
                const label = placeholder.querySelector(".upload-button");
                const info = placeholder.querySelector(".upload-info");
                const existingPreview = placeholder.querySelector(".preview-image");

                if (icon) icon.classList.remove("hidden");
                if (label) label.classList.remove("hidden");
                if (info) info.classList.remove("hidden");
                if (existingPreview) existingPreview.remove();

                document.querySelector(".validate-button").classList.remove("active");

                // Revenir à la vue galerie
                modalAddPicture.style.display = "none";
                modalGalleryView.style.display = "block";

                alert("Projet ajouté avec succès !");
            } else {
                alert("Erreur lors de l'ajout du projet. Vérifiez votre image (jpg/png, < 4Mo).");
            }
        } catch (error) {
            console.error("Erreur réseau :", error);
            alert("Une erreur réseau est survenue.");
        }
    });
}

const modal = document.querySelector(".modal");
const openModalBtn = document.querySelector(".openModal");
const closeModalIcons = document.querySelectorAll(".closeIcon");

// Clique sur "modifier"
openModalBtn.addEventListener("click", openModal);

// Clique sur l'icon croix
closeModalIcons.forEach(icon => {
    icon.addEventListener("click", closeModal);
});

// Clique en dehors de la fenêtre (sur le fond gris)
modal.addEventListener("click", function (e) {
    if (e.target === modal) {
        closeModal();
    }
});


//---------------Ajout de la gallerie à la modale---------------

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

        deleteIcon.addEventListener("click", function (event) {
            removeProject(project.id);
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

function closeModal() {
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
}

function removeProject(idProject) {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5678/api/works/" + idProject, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + token
        }
    })
        .then(response => {
            if (response.ok) {
                displayGallery();
                displayModalGallery()
            } else {
                alert("Erreur lors de la suppression du projet.");
                console.warn("Statut HTTP : ", response.status);
            }
        })
}

//--------------Vue modale pour ajouter un projet--------------

const modalGalleryView = document.querySelector(".modal-gallery-view");
const modalAddPicture = document.querySelector(".modal-add-picture");
const addPictureBtn = document.querySelector(".button-add-picture");
const backToGalleryBtn = document.querySelector(".back-to-gallery");

// Aller à la vue "Ajout photo"
addPictureBtn.addEventListener("click", () => {
    modalGalleryView.style.display = "none";
    modalAddPicture.style.display = "block";
    CategorySelect();
});

// Revenir à la galerie photo
backToGalleryBtn.addEventListener("click", () => {
    modalAddPicture.style.display = "none";
    modalGalleryView.style.display = "block";
});

//Sélectionner une catégorie
function CategorySelect() {
    const select = document.getElementById("category");
    select.innerHTML = "";

    allCategories.forEach(category => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        select.appendChild(option);
    });
}

//---------------Prévisualiser l'image chargée---------------

const imageInput = document.getElementById("image-upload");
const placeholder = document.querySelector(".upload-placeholder");

const icon = placeholder.querySelector(".fa-image");
const label = placeholder.querySelector(".upload-button");
const info = placeholder.querySelector(".upload-info");

imageInput.addEventListener("change", function () {
    const file = imageInput.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {
        // Masque les éléments initiaux sans les supprimer
        icon.classList.add("hidden");
        label.classList.add("hidden");
        info.classList.add("hidden");

        // Supprime l'ancien aperçu s’il existe
        const existingPreview = placeholder.querySelector(".preview-image");
        if (existingPreview) existingPreview.remove();

        // Crée et ajoute le nouvel aperçu
        const img = document.createElement("img");
        img.src = e.target.result;
        img.alt = "Aperçu de l'image";
        img.classList.add("preview-image");

        placeholder.appendChild(img);
    };

    reader.readAsDataURL(file);
});

//-----Fait passer le bouton "valider" en vert si tous les champs sont complétés-----
const titleInput = document.getElementById("title");
const categorySelect = document.getElementById("category");
const validateButton = document.querySelector(".validate-button");

// Fonction pour vérifier les champs
function checkFormValidity() {
    const isImageSelected = imageInput.files.length > 0;
    const isTitleFilled = titleInput.value.trim() !== "";
    const isCategorySelected = categorySelect.value !== "";

    if (isImageSelected && isTitleFilled && isCategorySelected) {
        validateButton.classList.add("active");
    } else {
        validateButton.classList.remove("active");
    }
}

imageInput.addEventListener("change", checkFormValidity);
titleInput.addEventListener("input", checkFormValidity);
categorySelect.addEventListener("change", checkFormValidity);


//Ajout d'un projet
document.addEventListener("DOMContentLoaded", addProjectModal);