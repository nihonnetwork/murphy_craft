local type = "camp_campfire"

Workbench[type] = {
  main_header = "Campfire",
  main_subheader = "Cook something",
  categories = {
    [1] = {
        type = "craft", --- "craft" or "refine"
        header = "Grill",
        subheader = "Something fast to eat",
        icon ="upgrade_upg_cooking_spit", --- icons from jolibs or nil
        anim = {"mech_dynamic@world_player_dynamic_kneel_ground@trans@kneel1@male_a", "kneel1_trans_cookgrill1_b"}, --- {"dict", "anim"}
        recipe = {
        --  {label = "Menu Label", description = "Menu Description", icon="icon" or nil, craft = {{ "item1", amount}, { "item2", amount}...}, need = {{ "item1", amount}, { "item2", amount}...}, worktime = 5},
            {label = "Cooked Mutton", description = "Requires: 1x Mutton", icon="upgrade_upg_cooking_spit", craft = {{ "cooked_mutton", 1}}, need = {{"mutton", 1}}, worktime = 15},
            {label = "Grilled Fish", description = "Requires: 1x Fish Fillet", icon="upgrade_upg_cooking_spit", craft = {{ "cooked_fish", 1}}, need = {{"fishfillet", 1}}, worktime = 15},
                    --  {label = "Menu Label", description = "Menu Description", icon="icon" or nil, craft = {{ "item1", amount}, { "item2", amount}...}, need = {{ "item1", amount}, { "item2", amount}...}, worktime = 5},
            {label = "Cooked Beef", description = "Requires: 1x Beef", icon="upgrade_upg_cooking_spit", craft = {{ "cooked_beef", 1}}, need = {{"beef", 1}}, worktime = 15},
            {label = "Deer Jerky", description = "Requires: 1x Venison, 1x Salt", icon="upgrade_upg_cooking_spit", craft = {{ "deer_jerky", 1}}, need = {{"venison", 1}, {"salt", 1}}, worktime = 15},
            {label = "Cooked Game Meat", description = "Requires: 1x Game Meat", icon="upgrade_upg_cooking_spit", craft = {{ "cooked_game_meat", 1}}, need = {{"provision_meat_game", 1}}, worktime = 15},
            {label = "Lemon Cake", description = "Requires: 1x Lemon and 1x dough", icon="upgrade_upg_cooking_spit", craft = {{ "consumable_lemoncake", 1}}, need = {{"dough", 1}, {"lemon", 1}}, worktime = 15},
            {label = "Breakfast", description = "Requires: 1x Egg and 1x pork", icon="upgrade_upg_cooking_spit", craft = {{ "consumable_breakfast", 1}}, need = {{"egg", 1}, {"pork", 1}}, worktime = 15},
            {label = "Blueberry Pie", description = "Requires: 1x Dough and 1x Blueberry", icon="upgrade_upg_cooking_spit", craft = {{ "consumable_breakfast", 1}}, need = {{"dough", 1}, {"blueberry", 1}}, worktime = 15},
            {label = "Chocolate Cake", description = "Requires: 1x Chocolate and 1x Dough", icon="upgrade_upg_cooking_spit", craft = {{ "consumable_chocolatecake", 1}}, need = {{"dough", 1}, {"consumable_chocolate", 1}}, worktime = 15},
            {label = "Crumb Cake", description = "Requires: 1x Cinnamon and 1x Dough", icon="upgrade_upg_cooking_spit", craft = {{ "consumable_crumbcake", 1}}, need = {{"dough", 1}, {"cinnamon", 1}}, worktime = 15},
            {label = "Cup Cake", description = "Requires: 1x Blueberry and 1x Dough", icon="upgrade_upg_cooking_spit", craft = {{ "consumable_cupcake", 1}}, need = {{"dough", 1}, {"blueberry", 1}}, worktime = 15},
            {label = "Peach Cobbler", description = "Requires: 1x Peach and 1x Dough", icon="upgrade_upg_cooking_spit", craft = {{ "consumable_peachcobbler", 1}}, need = {{"dough", 1}, {"consumable_peach", 1}}, worktime = 15},

        }
    },
    },
}