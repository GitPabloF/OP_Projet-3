const token = localStorage.getItem("token");

let portefolioGallery = document.querySelector('#portfolio .gallery');

function getData() {
    //  -- RÉCUPÉRER LES TRAVAUX DU BACK-END --
    try {
        // récup les datas de l'API
        fetch('http://localhost:5678/API/works')
            .then(donnees => donnees.json())

            // afficher les projets dans le portefolio
            .then(donnees => {
                function genererElements(donnees) {
                    // retire les projets de la page au lancement de la fonction
                    portefolioGallery.innerHTML = "";
                    // boucle for qui créé les éléments HTML et incorpore les éléments de l'API
                    for (let i = 0; i < donnees.length; i++) {
                        portefolioGallery.innerHTML +=
                            `<figure id="card${donnees[i].id}"> 
                                <p  class="card-id">${donnees[i].id}</p>
                                <img src="${donnees[i].imageUrl}" alt="${donnees[i].title}"> 
                                <figcaption> ${donnees[i].title}</figcaption> 
                            </figure>`;
                    }

                    // -- METTRE PROJETS SUR MODALE --
                    for (let i = 0; i < donnees.length; i++) {
                        document.querySelector('#modale-card-conteneur').innerHTML +=
                            `<div class="card" id="${donnees[i].id}">
                            <div class="card-img" id="${donnees[i].id}">
                                <img src='${donnees[i].imageUrl}'>   
                                <button class="card-deplacer" aria-hidden="true" aria-label="déplacer-projet">
                                    <i class="fa-solid fa-arrows-up-down-left-right"></i>
								</button>                                           
                                <button aria-label="supprimer-projet" class= "card-bouton_supprimer" id="card${donnees[i].id}-bouton_supprimer">
                                    <i class="fa-solid fa-trash-can"></i>
                                </button>           
                            </div>
                            <h4 class="card-editer">éditer</h4>
                        </div>`
                    }
                    deleteProject();
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
                    // Retire tous les éléments du HTML + appeler la fonction avec les nouveaux élements filtres
                    portefolioGallery.innerHTML = "";
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
// Condition s'il y a un token dans le local storage
if (token != null) {

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

// --- SUPPRIMER DYNAMIQUEMENT PROJETS -- 

function deleteProject() {
    const deleteButtons = document.querySelectorAll('.card-bouton_supprimer');

    deleteButtons.forEach(button => {
        button.addEventListener('click', () => {
            const card = button.closest('.card');
            const cardId = card.id;
            card.remove();
            document.querySelector(`.gallery #card${cardId}`).remove();

            fetch(`http://localhost:5678/api/works/${cardId}`, {
                method: "delete",
                headers: {
                    "content-type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })
        });
    });
}

// -- AJOUTER UNE PHOTO -- 
let isImageUploded = false;
const inputFile = document.querySelector('#ajouter-fichier');

document.querySelector('#modale-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    // définition des const
    let getFile = document.querySelector('#ajouter-fichier').files[0];
    let getTitle = document.querySelector('#ajouter-titre').value;

    const categories = {
        "objets": 1,
        "appartements": 2,
        "hotels_restaurants": 3
    };
    const getCategory = document.querySelector("#select_categorie").value;
    let getCategoryID = categories[getCategory];

    // condition si form bien complété
    if (isImageUploded == true && getTitle != "" && getCategory != "") {

        // form data
        const formData = new FormData();
        formData.append('image', getFile);
        formData.append('title', getTitle);
        formData.append('category', getCategoryID);

        // appel API en POST pour ajouter les projets 
        const addProjectAPI = await fetch('http://localhost:5678/api/works', {
            method: "POST",
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        })

        if (addProjectAPI.ok) {
            const res = await addProjectAPI.json();

            // -- ajoutet les projets dans le DOM - partie galerie
            const createFigure = document.createElement("figure");
            portefolioGallery.appendChild(createFigure);
            createFigure.setAttribute('id', `card${res.id}`);

            const createImage = document.createElement("img");
            createImage.src = imageAjoutee;
            createFigure.appendChild(createImage);

            const createFigcaption = document.createElement("figcaption");
            createFigcaption.textContent = getTitle;
            createFigure.appendChild(createFigcaption);

            //-- ajouter les projets dans le DOM - partie modale

            const divModale = document.createElement('div');
            divModale.classList.add('card');
            divModale.setAttribute('id', res.id);
            document.querySelector('#modale-card-conteneur').appendChild(divModale);

            const divImgModale = document.createElement('div');
            divImgModale.setAttribute('class', 'card-img');
            divModale.appendChild(divImgModale);

            const imgModale = document.createElement('img');
            divImgModale.appendChild(imgModale);
            imgModale.src = imageAjoutee;

            const buttonModale = document.createElement('button');
            buttonModale.setAttribute('class', 'card-bouton_supprimer');
            divImgModale.appendChild(buttonModale);

            const iModale = document.createElement('i');
            iModale.setAttribute('class', 'fa-solid fa-trash-can');
            buttonModale.appendChild(iModale);

            const h4Modale = document.createElement('h4');
            h4Modale.setAttribute('class', 'card-editer');
            h4Modale.textContent = "éditer";
            divModale.appendChild(h4Modale);

            // appel la fonction pour supprimer des projets si besoin
            deleteProject();

            // vide les valeurs renseignées dans le formulaire et l'affiche sa version de base 
            document.querySelector('#ajouter-titre').value = "";
            document.querySelector("#select_categorie").value = "";

            document.querySelector('#container-ajouter-fichier').style.backgroundImage = `url()`;

            inputFile.style.zIndex = '1';
            document.querySelector("#label-ajouter-fichier").style.zIndex = '1';
            document.querySelector("#container-ajouter-fichier p").style.zIndex = '1'

            inputFile.style.color = "#E8F1F6";
            inputFile.style.backgroundColor = "#E8F1F6";
            inputFile.style.backgroundImage = 'url(../assets/icons/picture-svgrepo.png)';

            fermeModale();
        }
        else {
            console.error('une erreur est survenue')
        }
    }
    //si le form est incomplet 
    else {
        document.querySelector('#modale_ajout_projet #form_incomplet').style.display = "block";
    }
})

// afficher l'image ajoutée dans le form 
let imageAjoutee = "";
document.querySelector('#ajouter-fichier').addEventListener('change', function () {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
        imageAjoutee = reader.result;

        let containerAjoutImageSelector = document.querySelector('#container-ajouter-fichier');
        containerAjoutImageSelector.style.backgroundImage = `url(${imageAjoutee})`;
        containerAjoutImageSelector.style.backgroundColor = '#E8F1F6';

        inputFile.style.color = "transparent";
        inputFile.style.backgroundColor = "transparent";
        inputFile.style.backgroundImage = 'url()';

        document.querySelector("#label-ajouter-fichier").style.zIndex = '-1';
        document.querySelector("#container-ajouter-fichier p").style.zIndex = '-1';

        isImageUploded = true;
        changeSubmitColor();
    })
    reader.readAsDataURL(this.files[0]);
})


// -- Change la couleur du btn valider quand tous les input sont remplis 

function changeSubmitColor() {
    if (isImageUploded == true && isTitleFiled == true && isCategoryFiled == true) {
        document.querySelector('#modale-form-submit').style.backgroundColor = "#1D6154";
        document.querySelector('#modale_ajout_projet #form_incomplet').style.display = "none";
    }
    else {
        document.querySelector('#modale-form-submit').style.backgroundColor = "#A7A7A7"
    }
}

let isTitleFiled = false;
let isCategoryFiled = false;

document.querySelector('#ajouter-titre').addEventListener('input', function () {
    if (document.querySelector('#ajouter-titre').value != "") {
        isTitleFiled = true;
    }
    else {
        isTitleFiled = false;
    }
    changeSubmitColor();

})

document.querySelector('#select_categorie').addEventListener('input', function () {
    if (document.querySelector('#select_categorie').value != "") {
        isCategoryFiled = true;
    }
    else {
        isCategoryFiled = false;
    }
    changeSubmitColor();
})
