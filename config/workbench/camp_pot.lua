local type = "camp_stew"

Workbench[type] = {
  main_header = "Stewpot",
  main_subheader = "Cook something",
  categories = {
    [1] = {
        type = "craft", --- "craft" or "refine"
        header = "Stew",
        subheader = "Something fast to eat",
        icon ="upgrade_upg_cooking_spit", --- icons from jolibs or nil
        anim = {"mech_dynamic@world_player_dynamic_kneel_ground@trans@kneel1@male_a", "kneel1_trans_cookgrill1_b"}, --- {"dict", "anim"}
        recipe = {
        --  {label = "Menu Label", description = "Menu Description", icon="icon" or nil, craft = {{ "item1", amount}, { "item2", amount}...}, need = {{ "item1", amount}, { "item2", amount}...}, worktime = 5},
            {label = "Veggie Soup", description = "Requires: 1x Potato, 1x Carrot, 1x Onion", icon="upgrade_upg_cooking_spit", craft = {{ "veggiesoup", 1}}, need = {{"potato", 3}, {"carrot", 3}, {"onion", 1}}, worktime = 15},
            {label = "Chili", description = "Requires: 1x Potato, 1x Onion, 1x Rice", icon="upgrade_upg_cooking_spit", craft = {{ "chili", 1}}, need = {{"potato", 3}, {"onion", 3}, {"rice", 1}}, worktime = 15},
            {label = "Pork roast", description = "Requires: 1x Pork, 1x Potato, 1x Animal Fat", icon="upgrade_upg_cooking_spit", craft = {{ "porkroast", 1}}, need = {{"pork", 3}, {"potato", 3}, {"generic_animal_fat", 1}}, worktime = 15},
        }
    },
    },
}