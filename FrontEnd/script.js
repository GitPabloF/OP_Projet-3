const token = localStorage.getItem("token");

let portefolioGallery = document.querySelector('#portfolio .gallery');

function getData() {
    //  -- RÉCUPÉRER LES TRAVAUX DU BACK-END --
    try {
        // récupérer les datas de l'API
        fetch('http://localhost:5678/API/works')
            .then(donnees => donnees.json())

            // afficher les projets dans le portefolio
            .then(donnees => {
                function genererElements(donnees) {
                    portefolioGallery.innerHTML = "";

                    // boucle for qui créé les éléments HTML avec les datas récupérés par l'API
                    for (let i = 0; i < donnees.length; i++) {
                        portefolioGallery.innerHTML +=
                            `<figure id="card${donnees[i].id}"> 
                                <img src="${donnees[i].imageUrl}" alt="${donnees[i].title}"> 
                                <figcaption> ${donnees[i].title}</figcaption> 
                            </figure>`;
                        
                    }   

                    // -- AJOUTER PROJETS SUR MODALE --
                    for (let i = 0; i < donnees.length; i++) {
                        document.querySelector('#modale-card-conteneur').innerHTML +=
                            `<div class="card" id="${donnees[i].id}">
                            <div class="card-img">
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

                //  Changement de couleur quand le filtre est séléctionné 
                function selectionnerCategorie(bouton) {
                    document.querySelectorAll('.category-button').forEach(function (btn) {
                        btn.classList.remove('selected');
                    });
                    bouton.classList.add('selected');
                }

                //  -- RÉALISATION DES FILTRES --
                // Création de d'une fonction avec la méthode filter 
                function filtrage(nomFiltre) {
                    const elementsFiltrees = donnees.filter((donnee) => {
                        return donnee.category.name == `${nomFiltre}`;
                    });
                    portefolioGallery.innerHTML = "";
                    genererElements(elementsFiltrees);
                };

                // Fonction qui filtre les projets  
                document.querySelectorAll('.category-button').forEach( button =>{
                    button.addEventListener('click', ()=> {
                        selectionnerCategorie(button);
                        if(button.id == 'tous'){
                            genererElements(donnees);
                        }
                        else{
                            filtrage(button.textContent);
                        }
                    })
                })               
            })

    } catch (error) {
        console.error('Une erreur est survenue', error);
    }
};

getData();

// -- AFFICHAGE MODE ÉDITION --
if (token != null) {
    const editionSelecteur = document.querySelector("#edition");
    editionSelecteur.style.display = "flex";
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

    // -- BOUTON LOGOUT --
    const logoutSelecteur = document.querySelector("#nav-login");
    logoutSelecteur.addEventListener("click", (event) => {
        event.preventDefault();
        window.localStorage.removeItem("token");
        document.location.reload();
    });
}

// -- CRÉATION D'UNE MODALE --
// fonction pour ouvrir la modale 
const ouvreModale = function (e) {
    e.preventDefault();
    const modaleElement = document.querySelector('#modale-conteneur');
    modaleElement.style.display = 'flex';
    const modaleSelector = document.querySelector('#modale');
    modaleSelector.style.height = "670px";
    modaleElement.removeAttribute('aria-hidden');
    modaleElement.setAttribute('aria-modale', 'true');
    modaleElement.addEventListener('click', fermeModale);
    modaleElement.querySelector('#index-modale_close').addEventListener('click', fermeModale);
    modaleElement.querySelector('#modale').addEventListener('click', stopPropagation);
    const modalePage2Selector = document.querySelector('#modale_ajout_projet');
    modalePage2Selector.style.display = 'none';
    const modalePage1Selector = document.querySelector('#modale_index');
    modalePage1Selector.style.display = 'flex';
}

//  -- fonction pour fermer la modale --
const fermeModale = function (e) {
    const modaleElement = document.querySelector('#modale-conteneur');
    modaleElement.style.display = 'none';
    modaleElement.setAttribute('aria-hidden', 'true');
    modaleElement.removeAttribute('aria-modale');
    modaleElement.removeEventListener('click', fermeModale);
    modaleElement.querySelector('#modale-closer').removeEventListener('click', fermeModale);
    modaleElement.querySelector('#modale').removeEventListener('click', stopPropagation);
}

//  afficher modale pour un ajouter projet
const ouvreModaleAjouterProjet = function (e) {
    e.preventDefault();
    const modaleElement = document.querySelector('#modale_index');
    modaleElement.style.display = 'none';
    const modalePage2Selector = document.querySelector('#modale_ajout_projet');
    modalePage2Selector.style.display = 'flex';
    const modaleSelector = document.querySelector('#modale');
    modaleSelector.style.height = "610px";
    const fermerModale = document.querySelector('#modale-page2-close').addEventListener('click', fermeModale);
    const modaleRetourSelector = document.querySelector('#modale-retour').addEventListener('click', ouvreModale);
}

const stopPropagation = function (e) {
    e.stopPropagation();
}

document.querySelector('#portfolio-modifier-a').addEventListener('click', ouvreModale);
document.querySelector('#modale-ajout_photo').addEventListener('click', ouvreModaleAjouterProjet);

// -- SUPPRIMER DYNAMIQUEMENT PROJET -- 
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

// afficher l'image ajoutée dans le form 
let imageAjoutee = "";
inputFile.addEventListener('change', function () {
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

// -- Change la couleur du bouton valider quand tous les input sont remplis 
let isTitleFiled = false;
let isCategoryFiled = false;

function changeSubmitColor() {
    if (isImageUploded == true && isTitleFiled == true && isCategoryFiled == true) {
        document.querySelector('#modale-form-submit').style.backgroundColor = "#1D6154";
        document.querySelector('#modale_ajout_projet #form_incomplet').style.display = "none";
    }
    else {
        document.querySelector('#modale-form-submit').style.backgroundColor = "#A7A7A7"
    }
}

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

document.querySelector('#modale-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    let titleValue = document.querySelector('#ajouter-titre').value;
    const getCategory = document.querySelector("#select_categorie").value;

    // condition si form bien complété
    if (isImageUploded == true && titleValue != "" && getCategory != "") {
        const modaleForm = document.querySelector('#modale-form');
        const formData = new FormData(modaleForm);

        // requête fetch en POST pour ajouter les projets 
        const addProjectAPI = await fetch('http://localhost:5678/api/works', {
            method: "POST",
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        })

        if (addProjectAPI.ok) {
            const res = await addProjectAPI.json();

            // -- ajouter les projets dans le DOM - partie galerie
            const createFigure = document.createElement("figure");
            portefolioGallery.appendChild(createFigure);
            createFigure.setAttribute('id', `card${res.id}`);
            const createImage = document.createElement("img");
            createImage.src = imageAjoutee;
            createFigure.appendChild(createImage);
            const createFigcaption = document.createElement("figcaption");
            createFigcaption.textContent = formData.get('title');
            createFigure.appendChild(createFigcaption);

            // ajouter les projets dans le DOM - partie modale
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
            inputFile.style.backgroundImage = 'url(assets/icons/picture-svgrepo.png)';
            fermeModale();
        }
        else {
            console.error('une erreur est survenue')
        }
    }
    else {
        document.querySelector('#modale_ajout_projet #form_incomplet').style.display = "block";
    }
})