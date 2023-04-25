const token = localStorage.getItem("token");

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
    // enlève le compotement par défaut du HTML  
    // e.preventDefault();

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
let isImageUploded = false;
const inputFile = document.querySelector('#ajouter-fichier');

if(isImageUploded == true && getTitle != "" && getCategory !=""){
}
document.querySelector('#modale-form').addEventListener('submit', async(event)=>{
    event.preventDefault();

    // définition des const
    const getFile = document.querySelector('#ajouter-fichier').files[0];

    const getTitle = document.querySelector('#ajouter-titre').value;

    const categories = {
        "objets": 1,
        "appartements": 2,
        "hotels_restaurants": 3
    };
    const getCategory = document.querySelector("#select_categorie").value;
    const getCategoryID = categories[getCategory];

    // condition si form bien complété
    if(isImageUploded == true && getTitle != "" && getCategory !=""){
        const formData = new FormData();
        formData.append('image', getFile);
        formData.append('title', getTitle);
        formData.append('category', getCategoryID);

        const addProjectAPI = await fetch('http://localhost:5678/api/works', {
            method: "POST",
            headers: {'Authorization': `Bearer ${token}`},
            body: formData
        })
        if(addProjectAPI.ok){
            // ajouter dynamiquement les projets 
            // test 1
            getData();
            //test 2
            function addNewProject(){
                document.querySelector('#portfolio .gallery').innerHTML +=
                `<figure> 
                    <img src="${getFile}" alt="${getTitle}"> <figcaption> ${getTitle}</figcaption> 
                </figure>`;
            }
            // fin ajouter dynamiquement les projets 
            fermeModale();
        
        }
        else{
            console.error('anune erreur est survenue')
        }
    }
    else{
        document.querySelector('#modale_ajout_projet #form_incomplet').style.display = "block";
    }
})

document.querySelector('#ajouter-fichier').addEventListener('change', function () {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
        let imageAjoutee = reader.result;

        let containerAjoutImageSelector = document.querySelector('#container-ajouter-fichier');
        containerAjoutImageSelector.style.backgroundImage = `url(${imageAjoutee})`;
        containerAjoutImageSelector.style.backgroundColor = '#E8F1F6';
        
        inputFile.style.color = "transparent";
        inputFile.style.backgroundColor = "transparent";
        inputFile.style.backgroundImage = 'url()';
        document.querySelector('#container-ajouter-fichier label').style.display = "none";
        document.querySelector('#container-ajouter-fichier p').style.display = "none";

        isImageUploded = true;
        changeSubmitColor();
    })
    reader.readAsDataURL(this.files[0]);
})


// -- Change la couleur du btn valider quand tous les input sont remplis 

function changeSubmitColor(){
    if(isImageUploded == true && isTitleFiled == true && isCategoryFiled == true){
        document.querySelector('#modale-form-submit').style.backgroundColor = "#1D6154";
    }
    else{
        document.querySelector('#modale-form-submit').style.backgroundColor = "#A7A7A7"
    }
}

let isTitleFiled = false;
let isCategoryFiled = false;

document.querySelector('#ajouter-titre').addEventListener('input', function(){
    if(document.querySelector('#ajouter-titre').value != ""){
        isTitleFiled = true;
    }
    else{
        isTitleFiled = false;
    }
    changeSubmitColor();
    
})

document.querySelector('#select_categorie').addEventListener('input', function(){
    if(document.querySelector('#select_categorie').value != ""){
        isCategoryFiled = true;
    }
    else{
        isCategoryFiled = false;
    }
    changeSubmitColor();
})


// ajoute au DOM les nouveaux éléments 

