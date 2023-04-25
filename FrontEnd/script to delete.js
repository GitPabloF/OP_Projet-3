function getData() {
    //  -- RÉCUPÉRER LES TRAVAUX DU BACK-END --
    try {
        // récup les data de l'API
        fetch('http://localhost:5678/API/works')
            .then(donnees => donnees.json())

            // afficher les projets 
            .then(donnees => {
                function genererElements(donnees) {
                    // retire les projets de la page au lancement de la fonction
                    document.querySelector('#portfolio .gallery').innerHTML = "";
                    // boucle for qui créé les éléments HTML et incorpore les éléments de l'API
                    for (let i = 0; i < donnees.length; i++) {
                        document.querySelector('#portfolio .gallery').innerHTML +=
                            `<figure id="card${donnees[i].id}"> 
                                <p  class="card-id">${donnees[i].id}</p>
                                <img src="${donnees[i].imageUrl}" alt="${donnees[i].title}"> <figcaption> ${donnees[i].title}</figcaption> 
                            </figure>`;
                    }

                    // -- METTRE PROJETS SUR MODALE --
                    // mettre l'image du premier élément du JSON pour la première card (avec l'icon déplacer)
                    document.querySelector('#card1-img img').src = `${donnees[0].imageUrl}`;

                    // mettre les autres images des autres projets dans la modale 
                    for (let i = 1; i < donnees.length; i++) {
                        document.querySelector('#modale-card-conteneur').innerHTML +=
                            `<div class="card" id="${donnees[i].id}">
                            <div class="card-img" id="${donnees[i].id}">
                                <img src='${donnees[i].imageUrl}'>                                              
                                <button aria-label="supprimer-projet" class= "card-bouton_supprimer" id="card${donnees[i].id}-bouton_supprimer"><i class="fa-solid fa-trash-can"></i></i>
                                </button>           
                            </div>
                            <h4 class="card-editer">éditer</h4>
                        </div>`
                    }

                    // --- SUPPRIMER DYNAMIQUEMENT PROJETS -- 

                    const deleteButtons = document.querySelectorAll('.card-bouton_supprimer');

                    deleteButtons.forEach(button => {
                        button.addEventListener('click', () => {
                            const card = button.closest('.card');
                            const cardId = card.id;
                            card.remove();
                            console.log(`La carte avec l'id ${cardId} a été supprimée.`);

                            document.querySelector(`.gallery #card${cardId}`).remove();

                            let token = localStorage.getItem("token");
                            console.log(token);

                            fetch(`http://localhost:5678/api/works/${cardId}`, {
                                method: "delete",
                                headers: {
                                    "content-type": "application/json",
                                    "Authorization": `Bearer ${token}`
                                }
                            })
                                .then(res => console.log(res));
                        });
                    });
                }
                genererElements(donnees);

                //  -- RÉALISATION DES FILTRES --
                // Séléctionner les btn du HTML 
                const btnTous = document.querySelector('#portfolio #tous');
                const btnObjet = document.querySelector('#portfolio #objets');
                const btnAppartements = document.querySelector('#portfolio #appartements');
                const btnHotelsRestaurants = document.querySelector('#portfolio #hotels_restaurants');

                // Création de d'une fonction avec une fonction filter 
                function filtrage(nomFiltre) {
                    const elementsFiltrees = donnees.filter((donnee) => {
                        return donnee.category.name == `${nomFiltre}`;
                    });
                    // Retirer tous les éléments du HTML + appeler la fonction avec les nouveaux élements filtres
                    document.querySelector('#portfolio .gallery').innerHTML = "";
                    genererElements(elementsFiltrees);
                }

                // Ajouter l'écouteur avec la fonction de filtrage avce l'élément souhaité

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

// -- AFFICHAGE MODE ÉDITION --
// Condition si il y a un token dans le local storage
if (localStorage.getItem("token") != null) {

    // affiche la bannière du mode édition 
    const editionSelecteur = document.querySelector("#edition");
    editionSelecteur.style.display = "flex";

    // affiche les boutons modifier 
    const modiferBtnSelecteur = document.getElementsByClassName("btn_modifier");
    for (let i = 0; i < modiferBtnSelecteur.length; i++) {
        modiferBtnSelecteur[i].style.display = "inline-block";
    }

    // ajuste la marge du header
    const headerSelecteur = document.querySelector("header");
    headerSelecteur.style.margin = "87px 0";

    // change le texte de Log-in en Log-out
    const navLoginSelecteur = document.querySelector("#nav-login");
    navLoginSelecteur.textContent = "logout"

    // masque les filtres 
    const filtresSelecteur = document.querySelector("#filtres");
    filtresSelecteur.style.display = "none";

    // ajuste les marges pour le titre du portefolio
    const portfolioh2Selecteur = document.querySelector("#portfolio h2");
    portfolioh2Selecteur.style.margin = "3em";

    // -- BOUTON LOGOUT --
    // selectionner le bouton 
    const logoutSelecteur = document.querySelector("#nav-login");

    // ajouter un écouteur 
    logoutSelecteur.addEventListener("click", (event) => {
        event.preventDefault();
        // au click -> clearlocalstorage + refraichir la page 
        window.localStorage.removeItem("token");
        document.location.reload();
    });

}

// -- CRÉATION D'UNE MODALE --
// -- fonction pour ouvrir la modale --
const ouvreModale = function (e) {
    // enlève le compotement par défaut du HTML  
    e.preventDefault();

    // sélectionne le conteneur et l'affiche (en flex)
    const modaleElement = document.querySelector('#modale-conteneur');
    modaleElement.style.display = 'flex';

    const modaleSelector = document.querySelector('#modale');
    modaleSelector.style.height = "670px";

    // ajuste les attributs pour l'accessibilité 
    modaleElement.removeAttribute('aria-hidden');
    modaleElement.setAttribute('aria-modale', 'true');

    // ajout de l'événement pour fermer la modale en cliquant sur la page 
    modaleElement.addEventListener('click', fermeModale);

    // ajout de l'événement pour fermer la modale en cliquant sur le btn pour fermer  
    modaleElement.querySelector('#index-modale_close').addEventListener('click', fermeModale);

    // ajout de l'événement pour que la modale ne se ferme pas quand on clique sur la modale en elle-même
    modaleElement.querySelector('#modale').addEventListener('click', stopPropagation);

    // masquer la page 'ajout photo' de la modale 
    const modalePage2Selector = document.querySelector('#modale_ajout_projet');
    modalePage2Selector.style.display = 'none';

    const modalePage1Selector = document.querySelector('#modale_index');
    modalePage1Selector.style.display = 'flex';
}

//  -- fonction pour fermer la modale --
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
    modaleElement.querySelector('#modale-closer').removeEventListener('click', fermeModale);

    // retire l'événement pour que la modale ne se ferme pas quand on clique sur la modale en elle-même
    modaleElement.querySelector('#modale').removeEventListener('click', stopPropagation);
}

// -- afficher modale page 2 --

const ouvreModalePage2 = function (e) {
    // enlève le compotement par défaut du HTML  
    e.preventDefault();

    // Masque la page 1 de la modale
    const modaleElement = document.querySelector('#modale_index');
    modaleElement.style.display = 'none';

    // affiche la page 2 de la modale
    const modalePage2Selector = document.querySelector('#modale_ajout_projet');
    modalePage2Selector.style.display = 'flex';

    // définit la hauteur dédiée à la modale page 2 
    const modaleSelector = document.querySelector('#modale');
    modaleSelector.style.height = "610px";

    // ajoute l'évenement pour fermer la modale 
    const fermerModale = document.querySelector('#modale-page2-close').addEventListener('click', fermeModale);

    // ajoute l'événement pour retourner sur la page 1 de la modale 
    const modaleRetourSelector = document.querySelector('#modale-retour').addEventListener('click', ouvreModale);
}

// Création d'une fonction qui stop la propagation de l'événement
const stopPropagation = function (e) {
    e.stopPropagation();
}

// Sélection du btn pour ouvrir la modale + ajout d'un event click qui appelle la fonction ouvreModale
document.querySelector('#portfolio-modifier-a').addEventListener('click', ouvreModale);

// Sélectionne la page 2 de la modale + appelle la fonction pour affiche la page 2 de la modale 
document.querySelector('#modale-ajout_photo').addEventListener('click', ouvreModalePage2);


// -- AJOUTER UNE PHOTO -- 
const inputTypeFileSelector = document.querySelector('#ajouter-fichier');
var imageAjoutee = "";
// const imageAjoutee2 = "";

let isImageUploded = false;
let isFormSubmited = false;

console.log(`step1 ${imageAjoutee}`);

// This details the mapping between category name and id.
let categories = {
    "objets": 1,
    "appartements": 2,
    "hotels_restaurants": 3
};



// Fonction pour ajouter un projet qui est appelée quand une image est uploader 
async function ajouterProjet(event) {
    event.preventDefault();

    const ajouterTitre = document.querySelector("#ajouter-titre").value;
    const selectCategorie = document.querySelector("#select_categorie").value;

    if (isImageUploded == true && ajouterTitre != "" && selectCategorie != "") {
        console.log("titre et catégorie ok ");
        document.querySelector('#modale_ajout_projet #form_incomplet').style.display = "none";

        console.log(selectCategorie);
        const imageFile = inputTypeFileSelector.files[0];
        

        // A RAJOUTER DANS LE CODE !! 
        // Vérifier si l'object categories a bien la propriété que l'on récupère du HTML
        if(!categories.hasOwnProperty(selectCategorie)) {
            console.error("Property does not exist in categories");
            return;
        }
        // A RAJOUTER DANS LE CODE !! 
        const categoryId = categories[selectCategorie];

        (categoryId !== undefined && categoryId > 0)
        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('title', ajouterTitre);
        formData.append('category', categoryId); 

        console.log(formData);

        let token = localStorage.getItem("token");
        console.log(token);

        console.log(`step2 ${imageAjoutee}`);
        
        const ajouterProjetAPI = await fetch('http://localhost:5678/api/works', {
            method: "POST",
            headers: {
                // "Content-type": "application/json",
                'Authorization': `Bearer ${token}`
            },
            body: formData
        })
        event.preventDefault();
        if (ajouterProjetAPI.ok) {
            event.preventDefault();
            // Créer fetch en POST / Pourquoi on ne mets pas await
            const res = await reponse.json();
            console.log("projet ajouté");
            console.log(res);
            console.log(reponse);
        }

    }
    else if (isFormSubmited == true){
        console.log('test')
        // Appeler la fonction pour afficher qu'il manque quelque chose
        document.querySelector('#modale_ajout_projet #form_incomplet').style.display = "block";
    }
};


document.querySelector('#modale-form').addEventListener('submit', (event) => {
    event.preventDefault();
    console.log('Submit');
    isFormSubmited = true;
    ajouterProjet(event);
});

// Afficher l'image dans l'input type file
inputTypeFileSelector.addEventListener('change', function () {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
        imageAjoutee = reader.result;

        let containerAjoutImageSelector = document.querySelector('#container-ajouter-fichier');
        containerAjoutImageSelector.style.backgroundImage = `url(${imageAjoutee})`;
        containerAjoutImageSelector.style.backgroundColor = '#E8F1F6';
        inputTypeFileSelector.style.color = "transparent";
        inputTypeFileSelector.style.backgroundColor = "transparent";
        inputTypeFileSelector.style.backgroundImage = 'url()';
        document.querySelector('#container-ajouter-fichier label').style.display = "none";
        document.querySelector('#container-ajouter-fichier p').style.display = "none";

        isImageUploded = true;
        ajouterProjet();
    })
    reader.readAsDataURL(this.files[0]);
})
