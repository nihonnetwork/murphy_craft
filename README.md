# Murphy Craft

## Introduction
Murphy Craft is a crafting system that allows players to craft and refine items using various materials and recipes. This guide will help you set up and customize your crafting menus.

## Configuration

### Framework
First, select your framework in the `config.lua` file:
```lua
Config.framework = "REDEMRP2k23" -- Options: qbr-core, REDEMRP2k23, redemrp2022, rsg-core, vorp
```

### Workbench Template
Define your crafting and refining recipes in the `workbench` folder. The `template.lua` file provides an example of how to set up a workbench for a gunsmith:

```lua
local type = "gunsmith"

Workbench[type] = {
  main_header = "Gunsmith", -- The main title of the workbench
  main_subheader = "Craft something", -- The subtitle of the workbench
  categories = {
    [1] = {
        type = "craft", -- "craft" or "refine" to specify the type of action
        header = "Weapon", -- The category title
        subheader = "Some guns", -- The category subtitle
        icon = "badges", -- Icon from jolibs or nil
        anim = {"amb_work@world_human_hammer@table@male_a@trans", "base_trans_base"}, -- Animation dictionary and name
        recipe = {
            {label = "Revolver", description = "Un revolver", icon = nil, craft = {{"revolver", 1}}, need = {{"fer", 1}, {"bois", 1}}, worktime = 5},
            -- label: The name of the item to craft
            -- description: A brief description of the item
            -- icon: Icon for the item or nil
            -- craft: Items to be crafted with their amounts
            -- need: Required materials with their amounts
            -- worktime: Time in seconds to craft the item
            {label = "Pistolet", description = "Un pistolet", icon = nil, craft = {{"pistolet", 1}}, need = {{"fer", 1}, {"bois", 1}}, worktime = 5},
        }
    },
    [2] = {
        type = "craft", -- "craft" or "refine"
        header = "Ammo",
        subheader = "Boum boum",
        icon = nil, -- icons from jolibs or nil
        anim = {"amb_work@world_human_hammer@table@male_a@trans", "base_trans_base"},
        recipe = {
            {label = "Ammo Revolver", description = "BOUM", icon = nil, craft = {{"ammo_revolver", 10}}, need = {{"bread", 1}}, worktime = 5},
            {label = "Ammo Pistolet", description = "BOUM BOUM", icon = nil, craft = {{"ammo_pistolet", 10}}, need = {{"fer", 1}, {"cuivre", 1}}, worktime = 5},
        }
    },
    [3] = {
        type = "refine", -- "craft" or "refine"
        header = "Moonshine",
        subheader = "Fabriquer de l'alcool",
        icon = nil, -- icons from jolibs or nil
        anim = {"amb_work@world_human_hammer@table@male_a@trans", "base_trans_base"},
        recipe = {
            moonshine = {
                label = "Moonshine", description = "La tise", icon = nil,
                text = {fuelcount = "Charbon restant: ", materialscount = "En production: ", upgradecount = "En production: "},
                -- fuelcount: Text to display remaining fuel
                -- materialscount: Text to display materials in production
                -- upgradecount: Text to display upgrades in production
                materials = {label = "Matières Premières", description = "Il faut 1 mout whisky et 1 graisse", need = {{"moutwhisky", 1}, {"graisse", 1}}},
                -- label: The name of the materials section
                -- description: A brief description of the materials
                -- need: Required materials with their amounts
                upgrade = {
                    label = "Arômes", description = "Améliorer votre moonshine",
                    recipe = {
                        {icon = nil, label = "Moonshine du trappeur", description = "Il faut 1 peau de serpent pour transformer une Moonshine en moonshine premium", need = {{"peauserpent", 1}}, craft = {{item = "moonshinetrappeur", amount = 1, label = "Moonshine aux Agrumes", icon = nil}}},
                        {icon = nil, label = "Moonshine du ceuilleur", description = "Il faut 1 myrtille pour transformer une Moonshine en moonshine premium", need = {{"myrtille", 1}}, craft = {{item = "moonshinecueilleur", amount = 1, label = "Moonshine aux framboises", icon = nil}}},
                    }
                },
                -- label: The name of the upgrade section
                -- description: A brief description of the upgrade
                -- recipe: Items required for the upgrade with their amounts
                fuel = {label = "Combustible", description = "Il faut 1 charbon pour faire fonctionner l'alambic", need = {{"charbon", 1}}},
                -- label: The name of the fuel section
                -- description: A brief description of the fuel
                -- need: Required fuel with its amount
                outcome = {label = "Produit", description = "Récupérer le produit", craft = {{item = "moonshine", amount = 1, label = "Moonshine", icon = nil}}},
                -- label: The name of the outcome section
                -- description: A brief description of the outcome
                -- craft: Final product with its amount
                worktime = 5 -- seconds to produce 1 outcome
            },
        }
    },
  },
}
```

## Adding New Workbenches
To add a new workbench, create a new file in the `workbench` folder with a unique `type` and define its categories and recipes similarly to the example above.

## Commands
- `/savecraft`: Save all refining stations manually (requires superadmin permissions).

## Database
Ensure you have the `murphy_craft` table in your database. The SQL schema is provided in the `murphy_craft.sql` file.

## Opening the Crafting Menu
To open the crafting menu, use the following event:

```lua
TriggerEvent("murphy_craft:OpenCraftingMenu", tostring(args[1]), tostring(args[2]))
```

### Parameters
- `args[1]`: The type of the workbench (e.g., "gunsmith").
- `args[2]`: The ID of the workbench. This ID must be unique for each crafting point and is used to store resources when using the refinery feature.

### Example Usage
Here is an example of how to use this event in a script:

```lua
RegisterCommand("opencraft", function(source, args, rawCommand)
    -- Ensure the player has provided the necessary arguments
    if #args < 2 then
        print("Usage: /opencraft <workbench_type> <workbench_id>")
        return
    end

    -- Trigger the event to open the crafting menu
    TriggerEvent("murphy_craft:OpenCraftingMenu", tostring(args[1]), tostring(args[2]))
end, false)
```

In this example, the `/opencraft` command is registered, which takes two arguments: the workbench type and the workbench ID. When the command is executed, it triggers the `murphy_craft:OpenCraftingMenu` event with the provided arguments to open the crafting menu.
