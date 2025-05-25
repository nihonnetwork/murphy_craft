local type = "camp_butcher"

Workbench[type] = {
  main_header = "Butcher",
  main_subheader = "Craft something",
  categories = {
    [1] = {
        type = "craft", --- "craft" or "refine"
        header = "Game Meat",
        subheader = "The Land",
        icon ="provision_meat_mature_venison", --- icons from jolibs or nil
        anim = {"amb_work@world_human_hammer@table@male_a@trans", "base_trans_base"}, --- {"dict", "anim"}
        recipe = {
        --  {label = "Menu Label", description = "Menu Description", icon="icon" or nil, craft = {{ "item1", amount}, { "item2", amount}...}, need = {{ "item1", amount}, { "item2", amount}...}, worktime = 5},
            {label = "Oregano Seasoned Game", description = "Requires: 1x Game Meat, 1x Oregano", icon=nil, craft = {{ "oreganogame", 1}}, need = {{"provision_meat_game", 3}, {"consumable_herb_oregano", 1}}, worktime = 25},
            {label = "Thyme Seasoned Game", description = "Requires: 1x Game Meat, 3x Creeping Thyme", icon=nil, craft = {{ "thymegame", 1}},  need = {{"provision_meat_game", 3}, {"consumable_herb_creeping_thyme", 3}}, worktime = 25},
            {label = "Meat and potatoes", description = "Requires: 1x Mutton, 2x Potato", icon=nil, craft = {{ "meatpotato", 1}}, need = {{"provision_meat_game", 3}, {"potato", 2}}, worktime = 25}, 
        }
    },
    [2] = {
        type = "craft", --- "craft" or "refine"
        header = "Fish",
        subheader = "The Sea",
        icon ="provision_meat_succulent_fish", --- icons from jolibs or nil
        anim = {"amb_work@world_human_hammer@table@male_a@trans", "base_trans_base"}, --- {"dict", "anim"}
        recipe = {
        --  {label = "Menu Label", description = "Menu Description", icon="icon" or nil, craft = {{ "item1", amount}, { "item2", amount}...}, need = {{ "item1", amount}, { "item2", amount}...}, worktime = 5},
        {label = "Lemon Fish Fillet", description = "Requires: 1x Fish Fillet, 2x Lemon", icon=nil, craft = {{ "lemonfish", 1}}, need = {{"fishfillet", 3}, {"lemon", 2}}, worktime = 25}, 
        {label = "Oregano Seasoned Fish", description = "Requires: 1x Fish Fillet, 2x Oregano", icon=nil, craft = {{ "oreganofish", 1}}, need = {{"fishfillet", 3}, {"consumable_herb_oregano", 1}}, worktime = 25}, 
        {label = "Thyme Seasoned Fish", description = "Requires: 1x Fish Fillet, 2x Creeping Thyme", icon=nil, craft = {{ "thymefish", 1}}, need = {{"fishfillet", 3}, {"consumable_herb_creeping_thyme", 1}}, worktime = 25}, 
        }
    },
},
}