local type = "camp_campfire"

Workbench[type] = {
  main_header = "Campfire",
  main_subheader = "Craft something",
  categories = {
    [1] = {
        type = "craft", --- "craft" or "refine"
        header = "Grill",
        subheader = "Something fast to eat",
        icon ="upgrade_upg_cooking_spit", --- icons from jolibs or nil
        anim = {"mech_dynamic@world_player_dynamic_kneel_ground@trans@kneel1@male_a", "kneel1_trans_cookgrill1_b"}, --- {"dict", "anim"}
        recipe = {
        --  {label = "Menu Label", description = "Menu Description", icon="icon" or nil, craft = {{ "item1", amount}, { "item2", amount}...}, need = {{ "item1", amount}, { "item2", amount}...}, worktime = 5},
            {label = "Grilled Meat", description = "Some good meat", icon=nil, craft = {{ "viandecuite", 1}}, need = {{"viande", 1}}, worktime = 5},
            {label = "Grilled Fish", description = "Some good fish", icon=nil, craft = {{ "filetpoissoncuit", 1}}, need = {{"fish", 1}}, worktime = 5},
        }
    },
    },
}