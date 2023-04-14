function getData() {
    // 1.1 récupérer les travaux du back-end 
    try {
        // 1.1.1 récup les data de l'API
        fetch('http://localhost:5678/API/works')
            .then(donnees => donnees.json())

            // 1.1.2 afficher les projets 
            .then(donnees => {
                function genererElements(donnees) {
                    // 1.1.3 retire les projes de la page au lancement de la fonction
                    document.querySelector('#portfolio .gallery').innerHTML = "";
                    // 1.1.4 boucle for qui créé les éléments HTML et incorpore les éléments de l'API
                    for (let i = 0; i < donnees.length; i++) {
                        document.querySelector('#portfolio .gallery').innerHTML +=
                            `<figure> <img src="${donnees[i].imageUrl}" alt="${donnees[i].title}"> <figcaption> ${donnees[i].title}</figcaption> </figure>`;
                    }

                    // -- METTRE PROJETS SUR MODALE
                    // mettre l'image du premier élément du JSON pour la première card (icon déplacer)
                    document.querySelector('#card1 img').src = `${donnees[0].imageUrl}`;

                    // mettre les autres images des autres projets dans la modale 
                    for (let i = 1; i < donnees.length; i++) {
                        document.querySelector('#modale-card-conteneur').innerHTML +=
                            `<div class="card">
                            <div class="card-img" id="card${donnees[i].id}">
                                <img src='${donnees[i].imageUrl}'>												
                                <button aria-label="supprimer-projet"><i class="fa-solid fa-trash-can"></i></i>
                                </button>			
                            </div>
                            <h4 class="card-editer">éditer</h4>
                        </div>`
                    }
                }
                genererElements(donnees);

                // 1.2 Réalisation des filtres   
                // 1.2.1 Séléctionner les btn du HTML 
                const btnTous = document.querySelector('#portfolio #tous');
                const btnObjet = document.querySelector('#portfolio #objets');
                const btnAppartements = document.querySelector('#portfolio #appartements');
                const btnHotelsRestaurants = document.querySelector('#portfolio #hotels_restaurants');

                // 1.2.2 Création de d'une fonction avec une fonction filter 
                function filtrage(nomFiltre) {
                    const elementsFiltrees = donnees.filter((donnee) => {
                        return donnee.category.name == `${nomFiltre}`;
                    });
                    // 2.2.3 Retirer tous les éléments du HTML + appeler la fonction avec les nouveaux élements filtres
                    document.querySelector('#portfolio .gallery').innerHTML = "";
                    genererElements(elementsFiltrees);
                }

                //1.2.4 ajouter l'écouteur avec la fonction de filtrage avce l'élément souhaité

                btnTous.addEventListener("click", () => genererElements(donnees));
                btnObjet.addEventListener("click", () => filtrage("Objets"));
                btnAppartements.addEventListener("click", () => filtrage("Appartements"));
                btnHotelsRestaurants.addEventListener("click", () => filtrage("Hotels & restaurants"));

            })
    } catch (error) {
        console.error('Une erreur est survenue', error);
    }
};

getData();

// mode édition 

// début post avec token

// ???

// fin post avec token 

if (localStorage.getItem("token") != null) {
    console.log("token user ok")
    // afficher /masquer les éléments 
    const editionSelecteur = document.querySelector("#edition");
    editionSelecteur.style.display = "flex";

    // const modiferBtnSelecteur = document.getElementsByClassName("btn_modifier");
    // // // const modiferBtnSelecteur = document.querySelector("#portfolio-modifier-a");
    // modiferBtnSelecteur.style.display = "inline";

    const modiferBtnSelecteur = document.getElementsByClassName("btn_modifier");
    for (let i = 0; i < modiferBtnSelecteur.length; i++) {
        modiferBtnSelecteur[i].style.display = "inline-block";
    }

    const headerSelecteur = document.querySelector("header");
    headerSelecteur.style.margin = "87px 0";

    const navLoginSelecteur = document.querySelector("#nav-login");
    navLoginSelecteur.textContent = "logout"

    const filtresSelecteur = document.querySelector("#filtres");
    filtresSelecteur.style.display = "none";

    const portfolioh2Selecteur = document.querySelector("#portfolio h2");
    portfolioh2Selecteur.style.margin = "3em";

    // --- bouton logout ------

    // selectionner le bouton 
    const logoutSelecteur = document.querySelector("#nav-login");

    // ajouter un écouteur 
    logoutSelecteur.addEventListener("click", (event) => {
        event.preventDefault();
        console.log("test logout ok");
        // au click -> clearlocalstorage + refraichir la page 
        window.localStorage.removeItem("token");
        document.location.reload();
        // rafraichir la page 
    });

}

// -- création d'une modale --

// fonction pour ouvrir la modale 
const ouvreModale = function (e) {
    // enlève le compotement par défaut du HTML  
    e.preventDefault();

    // sélectionne le conteneur et l'affiche (en flex)
    const modaleElement = document.querySelector('#modale-conteneur');
    modaleElement.style.display = 'flex';

    // ajuste les attributs pour l'accessibilité 
    modaleElement.removeAttribute('aria-hidden');
    modaleElement.setAttribute('aria-modale', 'true');

    // ajout de l'événement pour fermer la modale en cliquant sur la page 
    modaleElement.addEventListener('click', fermeModale);

    // ajout de l'événement pour fermer la modale en cliquant sur le btn pour fermer  
    modaleElement.querySelector('#modale-close').addEventListener('click', fermeModale);

    // ajout de l'événement pour que la modale ne se ferme pas quand on clique sur la modale en elle-même
    modaleElement.querySelector('#modale').addEventListener('click', stopPropagation);
}

// fonction pour fermer la modale 
const fermeModale = function (e) {
    // enlève le compotement par défaut du HTML  
    e.preventDefault();

    // sélectionne le conteneur et le masque
    const modaleElement = document.querySelector('#modale-conteneur');
    modaleElement.style.display = 'none';

    // ajuste les attributs pour l'accessibilité 
    modaleElement.setAttribute('aria-hidden', 'true');
    modaleElement.removeAttribute('aria-modale');

    // retire l'événement pour fermer la modale en cliquant sur la page 
    modaleElement.removeEventListener('click', fermeModale);

    // retire l'événement pour fermer la modale en cliquant sur le btn pour fermer  
    modaleElement.querySelector('#modale-closer').removeEventListener('click', fermeModal);

    // retire l'événement pour que la modale ne se ferme pas quand on clique sur la modale en elle-même
    modaleElement.querySelector('#modale').removeEventListener('click', stopPropagation);
}

// Création d'une fonction qui stop la propagation de l'événement
const stopPropagation = function (e) {
    e.stopPropagation();
}

// Sélection du btn pour ouvrir la modale + ajout d'un event click qui appelle la fonction ouvreModale
document.querySelector('#portfolio-modifier-a').addEventListener('click', ouvreModale);

// -- afficher les éléments dans la modale




