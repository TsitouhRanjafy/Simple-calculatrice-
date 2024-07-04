
// definition de function pour afficher l'historique
let showHistorique = (idHistorique,idCalcul) =>{
    const sectionHistorique = document.getElementById(idHistorique);
    const sectionCalcul = document.getElementById(idCalcul);
    // supprimer ou ajouter la class 'show'
    sectionHistorique.classList.toggle('show');
    sectionCalcul.classList.toggle('max');
}

const expression = document.getElementById('expression');
expression.focus();
const evaluation = document.getElementById('evaluation');
var resultat;
const listHistorique = document.getElementById('listHistorique');
// Remplisage button onclick et insertion + evaluation
let remplisage = (e,id) =>{
    const Element = document.getElementById(id);
    const ripplie = document.createElement('span');
    ripplie.style.left = e.clientX + 'px';
    ripplie.style.top = e.clientY + 'px';
    Element.style.zIndex = 100;
    setTimeout(() =>{
        Element.style.zIndex = 110;
    },400);
    Element.appendChild(ripplie)

    // Insertion de textContent dans input expression
    switch (Element.id) {
        case 'AC':
            // réinitialiser le input le historique dans base de donnée
            expression.value = '';
            evaluation.value = ''; 
            break;
        case 'egal':
            // post expression et evaluation , après ,on les affiche dans l'hisorique 
            resultat = eval(expression.value); // resultat du calcul
            evaluation.value = ''; // reinitialiser l'evaluation
            let hisoriqueHtml = 
            `
            <div>
            <p class="formule" id="formule-${resultat}" onclick="insertOnExpression(this.id);">${expression.value}</p>
            <p class="resultat" id="resultat-${resultat}" onclick="insertOnExpression(this.id);" >${resultat}</p>
            </div>
            `
            // envoie du expression et resultat vers le base de donnée 
            fetch(`/enrigistrer?expression=${expression.value}&evaluation=${resultat}`,{
                method : "POST",
                headers : {
                    "Content-type" : "application/json"
                },
                body : JSON.stringify({ "expression" : "ito expression","evaluation" : "ito evaluation "})
            })
            .catch((error) => console.log(error))
            listHistorique.innerHTML += hisoriqueHtml; // 
            if ((resultat != undefined) && (resultat != NaN) ) expression.value = resultat;
            expression.focus();
            break;
        case "supprimer":

            valeurActuel = expression.value;
            if (valeurActuel != ''){
                valeurApresSuppression = valeurActuel.slice(0,-1); // supprimer le dernier caractère du valeurActuel
                expression.value = valeurApresSuppression;
                expression.focus(); // pour que le caret est toujour en dernier
            }
            break;
        
        default:
            // Inserer le dans input
            insertText('expression',Element.textContent);
            break;
    }
}

// Fonction qui insert de text dans un input
let insertText = (ElementId, text) =>{
    const inputElement = document.getElementById(ElementId);
    if (inputElement){
        inputElement.focus();
        document.execCommand('insertText',false,text)
    }
}

// evaluation automatique
expression.addEventListener('input',() =>{
    try {
        evaluation.value = eval(expression.value);
    } catch (error) {  
        console.log(error);
    }

})

// historique onclick 
let insertOnExpression = (id) =>{
    let valeurClicked = document.getElementById(id).textContent;
    expression.value += valeurClicked; // insertion sur le input expression
}

// pour l'affiche des historique
fetch('/affichage')
.then((rep) => rep.json())
.then((donne) => {
    console.log(donne)
    afficheHistorique(donne);
})
.catch((error) => {
    console.log(error)
})

// fonction pour le affichage de l'historique
let afficheHistorique = (list) =>{
    let hisoriquesHtml = ``;
    list.forEach((e) => {
        const hisoriqueHtml = 
        `
            <div>
            <h3 class="formule" id="formule-${e.id}" onclick="insertOnExpression(this.id);">${e.expression}</h3>
            <p class="resultat" id="resultat-${e.id}" onclick="insertOnExpression(this.id);" >${e.evaluation}</p>
            </div>
        `
        hisoriquesHtml += hisoriqueHtml;
    });
    listHistorique.innerHTML = hisoriquesHtml
}
