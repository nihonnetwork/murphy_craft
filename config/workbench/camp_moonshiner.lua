local type = "camp_moonshiner"

Workbench[type] = {
  main_header = "Still",
  main_subheader = "Distilling alcohol",
  categories = {
    [1] = {
        type = "refine", --- "craft" or "refine"
        header = "Moonshine",
        subheader = "Fabriquer de l'alcool",
        icon ="weapon_moonshinejug_mp", --- icons from jolibs or nil
        anim = {"amb_work@world_human_hammer@table@male_a@trans", "base_trans_base"},
        recipe = {
            moonshine = {label = "Moonshine", description = "La tise", icon= "upgrade_moonshiner_still_02", 
                text = {fuelcount = "Charbon restant: ", materialscount = "En production: ",upgradecount = "En production: "},
                materials = {icon = "provision_moonshine_poison", label = "Matières Premières", description= "Il faut 1 mout whisky et 1 graisse", need = {{"moutwhisky", 1}, { "graisse", 1}}}, --- basic materials 
                upgrade = {icon = "folder_moonshine_recipes", label = "Arômes", description = "Améliorer votre moonshine",
                    recipe = {
                        {icon = "document_moonshine_recipes", label = "Moonshine du trappeur", description= "Il faut 1 peau de serpent pour transformer une Moonshine en moonshine premium", need = {{"peauserpent", 1}}, craft = {{item = "moonshinetrappeur", amount= 1, label = "Moonshine aux Agrumes", icon = "consumable_moonshine"}}},
                        {icon = "document_moonshine_recipes", label = "Moonshine du ceuilleur", description= "Il faut 1 myrtille pour transformer une Moonshine en moonshine premium", need = {{"myrtille", 1}}, craft = {{item = "moonshinecueilleur", amount= 1, label = "Moonshine aux framboises", icon = "consumable_moonshine"}}},
                    }
                }, ---- items to upgrade the final product
                -- fuel = {icon = "satchel_nav_fire", label = "Combustible", description= "Il faut 1 charbon pour faire fonctionner l'alambic", need = {{"charbon", 1}}}, --- fuel, without it the production don't run, consume it at worktime delay
                outcome = {icon = "consumable_moonshine", label = "Produit", description= "Récupérer le produit", craft = {{item = "moonshine", amount= 1, label = "Moonshine", icon = "consumable_moonshine"}}}, --- final item without upgrade
                worktime = 10 --- seconds to produce 1 outcome
            },
        }
    },
    },
}