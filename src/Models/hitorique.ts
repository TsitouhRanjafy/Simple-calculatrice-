import { Document,Schema,model } from "mongoose";

// Creation interface hitorique
interface IHistorique extends Document{
    id : number
    expression : string
    evaluation : string
}
// Creation de Schema historique
const historiqueSchema = new Schema<IHistorique>({
    id : {type : Number},
    expression : {type : String},
    evaluation : {type : String},
})
// Construction du model historique 
const Historique = model<IHistorique>('historique',historiqueSchema)

// Exportation du model 
export default Historique