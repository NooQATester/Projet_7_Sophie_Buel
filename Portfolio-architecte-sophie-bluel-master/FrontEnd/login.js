async function init() {
    const form = document.querySelector('form');
    //Ajout de l'évènement submit au formulaire qui executera la fonction login
    form.addEventListener("submit", login);
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

//Pour dire d'attendre que le contenu du DOM soit bien chargé avant d'éxécuter le fichier JS
document.addEventListener('DOMContentLoaded', init);
