async function init() {
    const form = document.querySelector('form');
    //Ajout de l'évènement submit au formulaire qui executera la fonction login
    form.addEventListener("submit", login);

    manageLinkNavBar();
}

//Fonction de connexion
async function login(event) {
    event.preventDefault();
    
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value

    const idUser = {email, password};

    const reponse = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        body: JSON.stringify(idUser),
        headers: {"Content-Type": "application/json"},
    });

    if (reponse.status === 200) {
        const profile = await reponse.json();
        localStorage.setItem("token", profile.token);
        window.location.href = "index.html";
    } else if (reponse.status === 401) {
        alert("Email ou mot de passe incorrect !");
    } else if (reponse.status === 404) {
        alert("Utilisateur non trouvé !");
    } else {
        alert("Erreur inconnue :", reponse.status);
    }

}

function manageLinkNavBar() {

    // Récupère tous les liens du menu
    const navLinks = document.querySelectorAll("nav a");
    // Récupère l'URL de la page affiché
    const currentURL = window.location.href;
    navLinks.forEach(link => {
        if (link.href === currentURL) {
          link.classList.add("active");
        }
    });
}


//Pour dire d'attendre que le contenu du DOM soit bien chargé avant d'éxécuter le fichier JS
document.addEventListener('DOMContentLoaded', init);
