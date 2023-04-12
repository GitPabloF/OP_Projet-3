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


// fin post avec token 

if (localStorage.getItem("token") != null) {
    console.log("token user ok")
    // afficher /masquer les éléments 
    const editionSelecteur = document.querySelector("#edition");
    editionSelecteur.style.display = "flex";

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

// modale 






