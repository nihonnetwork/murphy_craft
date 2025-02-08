local type = "template"

Workbench[type] = {
  main_header = "Template",
  main_subheader = "Craft something",
  categories = {
    [1] = {
        type = "craft", --- "craft" or "refine"
        header = "Weapon",
        subheader = "Some guns",
        icon ="badges", --- icons from jolibs or nil
        anim = {"amb_work@world_human_hammer@table@male_a@trans", "base_trans_base"}, --- {"dict", "anim"}
        recipe = {
        --  {label = "Menu Label", description = "Menu Description", icon="icon" or nil, craft = {{ "item1", amount}, { "item2", amount}...}, need = {{ "item1", amount}, { "item2", amount}...}, worktime = 5},
            {label = "Revolver", description = "Un revolver", icon=nil, craft = {{ "revolver", 1}}, need = {{"fer", 1}, {"bois", 1}}, worktime = 5},
            {label = "Pistolet", description = "Un pistolet", icon=nil, craft = {{ "pistolet", 1}}, need = {{"fer", 1}, {"bois", 1}}, worktime = 5},
        }
    },
    [2] = {
        type = "craft", --- "craft" or "refine"
        header = "Ammo",
        subheader = "Boum boum",
        icon =nil, --- icons from jolibs or nil
        anim = {"amb_work@world_human_hammer@table@male_a@trans", "base_trans_base"},
        recipe = {
            {label = "Ammo Revolver", description = "BOUM", icon=nil, craft = {{ "ammo_revolver", 10}}, need = {{"bread", 1}}, worktime = 5},
            {label = "Ammo Pistolet", description = "BOUM BOUM", icon=nil, craft = {{ "ammo_pistolet", 10}}, need = {{"fer", 1}, {"cuivre", 1}}, worktime = 5},
        }
    },
    [3] = {
        type = "refine", --- "craft" or "refine"
        header = "Moonshine",
        subheader = "Fabriquer de l'alcool",
        icon =nil, --- icons from jolibs or nil
        anim = {"amb_work@world_human_hammer@table@male_a@trans", "base_trans_base"},
        recipe = {
            moonshine = {label = "Moonshine", description = "La tise", icon=nil, 
                text = {fuelcount = "Charbon restant: ", materialscount = "En production: ",upgradecount = "En production: "},
                materials = {label = "Matières Premières", description= "Il faut 1 mout whisky et 1 graisse", need = {{"moutwhisky", 1}, { "graisse", 1}}}, --- basic materials 
                upgrade = {label = "Arômes", description = "Améliorer votre moonshine",
                    recipe = {
                        {icon = nil, label = "Moonshine du trappeur", description= "Il faut 1 peau de serpent pour transformer une Moonshine en moonshine premium", need = {{"peauserpent", 1}}, craft = {{item = "moonshinetrappeur", amount= 1, label = "Moonshine aux Agrumes", icon = nil}}},
                        {icon = nil, label = "Moonshine du ceuilleur", description= "Il faut 1 myrtille pour transformer une Moonshine en moonshine premium", need = {{"myrtille", 1}}, craft = {{item = "moonshinecueilleur", amount= 1, label = "Moonshine aux framboises", icon = nil}}},
                    }
                }, ---- items to upgrade the final product
                fuel = {label = "Combustible", description= "Il faut 1 charbon pour faire fonctionner l'alambic", need = {{"charbon", 1}}}, --- fuel, without it the production don't run, consume it at worktime delay
                outcome = {label = "Produit", description= "Récupérer le produit", craft = {{item = "moonshine", amount= 1, label = "Moonshine", icon = nil}}}, --- final item without upgrade
                worktime = 5 --- seconds to produce 1 outcome
            },
        }
    },
    },
}