local type = "camp_butcher"

Workbench[type] = {
  main_header = "Butcher",
  main_subheader = "Craft something",
  categories = {
    [1] = {
        type = "craft", --- "craft" or "refine"
        header = "Meat",
        subheader = "The Land",
        icon ="provision_meat_mature_venison", --- icons from jolibs or nil
        anim = {"amb_work@world_human_hammer@table@male_a@trans", "base_trans_base"}, --- {"dict", "anim"}
        recipe = {
        --  {label = "Menu Label", description = "Menu Description", icon="icon" or nil, craft = {{ "item1", amount}, { "item2", amount}...}, need = {{ "item1", amount}, { "item2", amount}...}, worktime = 5},
            {label = "Viande Bovine", description = "", icon=nil, craft = {{ "viande", 1}}, need = {{"viandebovine", 1}}, worktime = 5},
            {label = "Viande de Porc", description = "", icon=nil, craft = {{ "viande", 1}}, need = {{"viandeporc", 1}}, worktime = 5},
            {label = "Venaison", description = "", icon=nil, craft = {{ "viande", 1}}, need = {{"viandegibier", 1}}, worktime = 5}, 
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
        {label = "Crapet arlequin", description = "", icon=nil, craft = {{ "filetpoisson", 1}}, need = {{"a_c_fishbluegil_01_ms", 1}}, worktime = 5},
        {label = "Petit Crapet arlequin", description = "", icon=nil, craft = {{ "filetpoisson", 1}}, need = {{"a_c_fishbluegil_01_sm", 1}}, worktime = 5},
        {label = "Poisson-chat", description = "", icon=nil, craft = {{ "filetpoisson", 1}}, need = {{"a_c_fishbullheadcat_01_ms", 1}}, worktime = 5},
        {label = "Petit Poisson-chat", description = "", icon=nil, craft = {{ "filetpoisson", 1}}, need = {{"a_c_fishbullheadcat_01_sm", 1}}, worktime = 5},
        }
    },
},
}