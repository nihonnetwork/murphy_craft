local type = "camp_stewpot"

Workbench[type] = {
  main_header = "Stewpot",
  main_subheader = "Craft something",
  categories = {
    [1] = {
        type = "refine", --- "craft" or "refine"
        header = "Stew",
        subheader = "Fabriquer de l'alcool",
        icon ="upgrade_camp_stew_pot", --- icons from jolibs or nil
        anim = {"amb_work@world_human_hammer@table@male_a@trans", "base_trans_base"},
        recipe = {
            meatstew = {label = "Meat Stew", description = "Delicious", icon="consumable_meal_camp_stew_daily_1", 
                text = {fuelcount = "Remaining wood: ", materialscount = "In Production: ",upgradecount = "In Production: "},
                materials = {icon = "provision_meat_mature_venison", label = "Raw materials", description= "You need 5 Good Meat", need = {{"viande", 5}}}, --- basic materials 
                -- upgrade = {label = "Arômes", description = "Améliorer votre moonshine",
                --     recipe = {
                --         {icon = nil, label = "Moonshine du trappeur", description= "Il faut 1 peau de serpent pour transformer une Moonshine en moonshine premium", need = {{"peauserpent", 1}}, craft = {{item = "moonshinetrappeur", amount= 1, label = "Moonshine aux Agrumes", icon = nil}}},
                --         {icon = nil, label = "Moonshine du ceuilleur", description= "Il faut 1 myrtille pour transformer une Moonshine en moonshine premium", need = {{"myrtille", 1}}, craft = {{item = "moonshinecueilleur", amount= 1, label = "Moonshine aux framboises", icon = nil}}},
                --     }
                -- }, ---- items to upgrade the final product
                fuel = {icon = "satchel_nav_fire",label = "Fuel", description= "You need 1 Charcoal", need = {{"charbon", 1}}}, --- fuel, without it the production don't run, consume it at worktime delay
                outcome = {icon = "consumable_meal_camp_stew_daily_1",label = "Product", description= "Get your meal !", craft = {{item = "ragoutviande", amount= 5, label = "Meat Stew", icon = "consumable_meal_camp_stew_daily_1"}}}, --- final item without upgrade
                worktime = 60 --- seconds to produce 1 outcome
            },
            fishstew = {label = "Fish Stew", description = "Delicious", icon="consumable_meal_camp_stew_daily_5", 
            text = {fuelcount = "Remaining wood: ", materialscount = "In Production: ",upgradecount = "In Production: "},
            materials = {icon = "provision_meat_succulent_fish", label = "Raw materials", description= "You need 5 Good Fish", need = {{"fish", 5}}}, --- basic materials 
            -- upgrade = {label = "Arômes", description = "Améliorer votre moonshine",
            --     recipe = {
            --         {icon = nil, label = "Moonshine du trappeur", description= "Il faut 1 peau de serpent pour transformer une Moonshine en moonshine premium", need = {{"peauserpent", 1}}, craft = {{item = "moonshinetrappeur", amount= 1, label = "Moonshine aux Agrumes", icon = nil}}},
            --         {icon = nil, label = "Moonshine du ceuilleur", description= "Il faut 1 myrtille pour transformer une Moonshine en moonshine premium", need = {{"myrtille", 1}}, craft = {{item = "moonshinecueilleur", amount= 1, label = "Moonshine aux framboises", icon = nil}}},
            --     }
            -- }, ---- items to upgrade the final product
            fuel = {icon = "satchel_nav_fire",label = "Fuel", description= "You need 1 Charcoal", need = {{"charbon", 1}}}, --- fuel, without it the production don't run, consume it at worktime delay
            outcome = {icon = "consumable_meal_camp_stew_daily_5",label = "Product", description= "Get your meal !", craft = {{item = "ragoutpoisson", amount= 5, label = "Fish Stew", icon = "consumable_meal_camp_stew_daily_5"}}}, --- final item without upgrade
            worktime = 60 --- seconds to produce 1 outcome
        },
        }
    },
    },
}