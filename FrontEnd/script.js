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
                            `<figure id="card${donnees[i].id}"> <img src="${donnees[i].imageUrl}" alt="${donnees[i].title}"> <figcaption> ${donnees[i].title}</figcaption> </figure>`;
                    }

                    // -- METTRE PROJETS SUR MODALE
                    // mettre l'image du premier élément du JSON pour la première card (icon déplacer)
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

                    // Supprimer dynamiquement projets 

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
                                headers: { "content-type": "application/json",
                                "Authorization": `Bearer ${token}`}
                            })
                            .then(res => console.log(res));
                        });
                    });
                    // fin : supprimer dynamiquement projets 

                    // Ajouter dynamiquement projets 

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
    modaleElement.querySelector('#modale-closer').removeEventListener('click', fermeModale);

    // retire l'événement pour que la modale ne se ferme pas quand on clique sur la modale en elle-même
    modaleElement.querySelector('#modale').removeEventListener('click', stopPropagation);
}

// -- afficher modale page 2

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


//  -- ajout d'une photo 

// console.log(document.querySelector('#container-ajouter-fichier'));
// if(document.querySelector('#ajouter-fichier').files != ""){
//     document.querySelector("#container-ajouter-fichier").style.backgroundImage = "url(assets/images/abajour-tahina.png)"

//     document.querySelector('#ajouter-fichier').style.display = "none";
// }

const inputTypeFileSelector = document.querySelector('#ajouter-fichier');
var imageAjoutee = "";


  // -- Ajouter un projet  

function ajouterProjet(){
    document.querySelector('#modale-form').addEventListener('submit', (event)=>{
        event.preventDefault();
        console.log("super submit");

        const ajouterTitre = event.target.querySelector("#ajouter-titre").value;
        const selectCategorie =  event.target.querySelector("#select_categorie").value;

        if(ajouterTitre != "" && selectCategorie != ""){
            console.log("titre et catégorie ok ")
        }
        else{
            console.log("il manque quelque chose")
        }
    })

};

// Afficher l'image dans l'input type file
inputTypeFileSelector.addEventListener('change', function(){
    const reader = new FileReader();
    reader.addEventListener("load", ()=> {
        imageAjoutee = reader.result;
        let containerAjoutImageSelector =
        document.querySelector('#container-ajouter-fichier');

        containerAjoutImageSelector.style.backgroundImage = `url(${imageAjoutee})`;

        containerAjoutImageSelector.style.backgroundColor = '#E8F1F6';

        inputTypeFileSelector.style.color = "transparent";

        inputTypeFileSelector.style.backgroundColor = "transparent";
        
        inputTypeFileSelector.style.backgroundImage = 'url()';

        document.querySelector('#container-ajouter-fichier label').style.display = "none";

        document.querySelector('#container-ajouter-fichier p').style.display = "none";
        
        ajouterProjet();

    })
    reader.readAsDataURL(this.files[0]);
})

