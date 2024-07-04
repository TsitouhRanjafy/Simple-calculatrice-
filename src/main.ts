// Importation du module expredss et l'interface application
import express , {Request,Response,Application, json} from "express";
// Importation du module path pour la gestion de chemin
import  path from "path";
import dotenv from "dotenv"
import mongoose from "mongoose";
import Historique from "./Models/hitorique";

// Congigurer .env
dotenv.config()
// creation d'une instance d'application 
const app : Application = express();
// Définition du port 
const port = process.env.PORT || 4000;

// Creation interface hitorique
interface IHistorique {
    id : number
    expression : string
    evaluation : string
}

// _________________________________ MIDDLEWARE _________________________________ //

// Définition des fichiers statiques
const cheminStatic = path.join(__dirname,'../public');
const cheminStaticStyle = path.join(__dirname,'../public/dist');
const cheminStaticScript = path.join(__dirname,'../public/script');
// Middleware pour la gestion des fichiers statiques
app.use(express.static(cheminStatic));
app.use(express.static(cheminStaticStyle));
app.use(express.static(cheminStaticScript));
// Middleware qui permet de parser les JSON
app.use(express.json())
// _________________________________ ********** _________________________________ //

// ___________________________________ ROUTING __________________________________ //

// Gestion de route '/' GET pour l'affichage 
app.get('/affichage',(req: Request,res: Response) =>{
    console.log("started affichage");
   const affichage = async () =>{
    try {
        const historique = await Historique.find(); // sélectionnée tout les données
        res.status(200).json(historique)
    } catch (error) {
        res.status(500).json(error)
        console.log(error);
        
    }
    }
    affichage();
})

// Gestion de route '/enrigistrer' POST enrigistrer dans le base de donne pour le historique
app.post('/enrigistrer',(req : Request,res : Response) =>{
    let request = req.query;
    // fonction qui enregistrer le historique dans mongodb avec le parametre interface IHistorique
    const enregistrement = async (U : IHistorique) =>{
        try {
            const historique = new Historique(U);
            await historique.save()
        } catch (error) {
            console.log(error);
        }
    }
    // parser le request query en un object qui peut sauvegarder à la base de donnée
    let U = {
        id : 0,
        expression  : `${request.expression}`,
        evaluation  : `${request.evaluation}` 
    }
    // Gestion ID
    const calculID = async () =>{
        let arrayLastId = await Historique.find({},{id : 1}).sort({id : -1}).limit(1)
        if (arrayLastId.length != 0){
            U.id = arrayLastId[0].id + 1;
        }else{
            U.id = 1;
        }
        enregistrement(U)
    }
    calculID();

})

// _________________________________ ********** _________________________________ //

// ___________________________________ DEMARAGE SERVEUR __________________________________ //

app.listen(port ,() =>{
    console.log(`🗄️ Serveur Fire on \"http://localhost:${port}\"`);

    // connexion à la base de donnée
    try {
        // Verifier si MONGODB_URL est défini
        if (!process.env.MONGODB_URL){
            throw new Error("variable d'environnement mongodb non définie");
        }
        // Si non , connectez 
        mongoose.connect(process.env.MONGODB_URL)
        console.log("connexion à la base de donnée réussi");
        
    } catch (error) {
        console.log(error);

    }
})

// _________________________________ ********** _________________________________ //



