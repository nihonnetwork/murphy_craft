CurrentCraftingMenu = nil
CurrentIdentification = nil 
CurrentType = nil
SelectedAmount = 0
isInteracting = false
local isCrafting = false

RegisterNetEvent("murphy_craft:OpenCraftingMenu", function (type, identification)
    local menuData = Workbench[type]
    CurrentIdentification = identification
    CurrentType = type
    if menuData then
        if CurrentIdentification then 
            local submenu = menuData.categories
                --The unique ID of the menu
                local id = tostring(type).."_craft"
                --The menu data
                local data = {
                title = menuData.main_header, --The big title of the menu
                subtitle = menuData.main_subheader, --The subtitle of the menu
                numberOnScreen = 8, --The number of item display before add a scroll
                onEnter = function(currentData)
                end,
                onBack = function(currentData)
                    jo.menu.show(false, false)
                    CurrentCraftingMenu = nil
                    CurrentIdentification = nil
                    CurrentType = nil
                    SelectedAmount = 0
                end,
                onExit = function(currentData)
                    CurrentCraftingMenu = nil
                    SelectedAmount = 0
                end,
                }
                local menu = jo.menu.create(id, data)

 
                    for _, settings in pairs(submenu) do
                        if settings.type == "craft" then
                            local elements = {
                                title = settings.header,
                                description = settings.subheader,
                                child = type .. "_crafting_" .. settings.header,
                            }
                            if settings.icon then
                                elements["icon"] = settings.icon
                            end
                            menu:addItem(elements)
                            local craftingmenu = jo.menu.create(tostring(type .. "_crafting_" .. settings.header), {
                                title = settings.header, -- The big title of the menu
                                subtitle = settings.subheader, -- The subtitle of the menu
                                numberOnScreen = 8, -- The number of item display before adding a scroll
                            })
                            AddCraftingMenu(settings, craftingmenu)
                        end
                        if settings.type == "refine" then
                            local elements = {
                                title = settings.header,
                                description = settings.subheader,
                                child = type .. "_refine_" .. settings.header,
                            }
                            if settings.icon then
                                elements["icon"] = settings.icon
                            end
                            menu:addItem(elements)
                            local craftingmenu = jo.menu.create(tostring(type .. "_refine_" .. settings.header), {
                                title = settings.header, -- The big title of the menu
                                subtitle = settings.subheader, -- The subtitle of the menu
                                numberOnScreen = 8, -- The number of item display before adding a scroll
                            })
                            AddRefineMenu(settings, craftingmenu)
                        end
                    end
                
                menu:send()
                jo.menu.setCurrentMenu(tostring(type).."_craft", false, true)
                jo.menu.show(true, false)
            else  print "ERROR: Please specify an id for the workbench" end
    else print("ERROR: No craft data was found for "..tostring(type)) end
end)

RegisterNetEvent("murphy_craft:CraftGetQuantity", function (amount, tag)
    if amount > 0 then 
        local values = {}
        for value = 1, amount do
            table.insert(values, {label = value})
        end
        CurrentCraftingMenu.items[tag].sliders[1].values = values
        CurrentCraftingMenu.items[tag].sliders[1].current = 1
        CurrentCraftingMenu:refresh()

    else
        CurrentCraftingMenu.items[tag].sliders[1].values = {{label = 0}}
        CurrentCraftingMenu.items[tag].sliders[1].current = 1
        CurrentCraftingMenu:refresh()
    end

end)

RegisterNetEvent("murphy_craft:RefineGetQuantity", function (amount, tag)
    if amount > 0 then 
        local values = {}
        for value = 1, amount do
            table.insert(values, {label = value})
        end
        CurrentCraftingMenu.items[tag].sliders[1].values = values
        CurrentCraftingMenu.items[tag].sliders[1].current = 1
        CurrentCraftingMenu:refresh()

    else
        CurrentCraftingMenu.items[tag].sliders[1].values = {{label = 0}}
        CurrentCraftingMenu.items[tag].sliders[1].current = 1
        CurrentCraftingMenu:refresh()
    end

end)

RegisterNetEvent("murphy_craft:StartCraft", function (data, amount, index)
    isCrafting = true
    local recipe = data.recipe[index]
    local need = recipe.need
    local reward = recipe.craft
    isInteracting = true
    for i = 0, amount do
        if i < amount then
            if isCrafting then
                playAnim(data.anim[1], data.anim[2], recipe.worktime*1000)
                Wait(recipe.worktime*1000)
                ClearPedTasks(PlayerPedId())
                for _, item in pairs(need) do
                    jo.callback.triggerServer('murphy_craft:RemoveItem', function(result)
                        if result then
                            i = i +1
                        else
                            isInteracting = false
                            isCrafting = false
                        end
                      end, item[1], item[2], {})
                end
                if isCrafting then
                    for _, item in pairs(reward) do
                        jo.callback.triggerServer('murphy_craft:GiveItem', function(result)
                            if result then
                                i = i +1
                            else
                                isInteracting = false
                                isCrafting = false
                            end
                        end, item[1], item[2], {})
                    end
                else break end

            else
                isInteracting = false
                isCrafting = false
                break
            end
        else
            isInteracting = false
            isCrafting = false
        end
    end
end)

Citizen.CreateThread(function ()
    while true do
        Wait(0)
        if isCrafting then
            TriggerEvent('murphy_notify:presskey', "Press G to stop craft")
            if IsControlJustReleased(0, 0x760A9C6F) then
                isCrafting = false
            end
        end
    end
end)


function playAnim(dict,name, time)
    RequestAnimDict(dict)
    while not HasAnimDictLoaded(dict) do
        Citizen.Wait(0)
    end
    TaskPlayAnim(PlayerPedId(), dict, name, 1.0, 1.0, time, 1, 0, true, 0, false, 0, false)
end

function AddCraftingMenu(settings, craftingmenu)
    local menu = craftingmenu
    for index, recipe in pairs(settings.recipe) do
        local elements = {
            title = recipe.label,
            description = recipe.description,
            data = {tag = index},
            sliders = {
                { type = "switch", current = 1, values = {{label = 0}} }
            },
            onActive = function(currentData)
                CurrentCraftingMenu = menu
                TriggerServerEvent("murphy_craft:CraftCheckQuantity", recipe, index)
            end,
            onClick = function(currentData)
                if not isCrafting then               
                    jo.menu.show(false, false)
                    CurrentCraftingMenu = nil
                    CurrentIdentification = nil
                    CurrentType = nil
                    SelectedAmount = 0
                    TriggerEvent("murphy_craft:StartCraft", settings, currentData.item.sliders[index].current, index)
                else
                    isCrafting = false
                end
            end,
        }
        if settings.icon then
            elements["icon"] = settings.icon
        end
        menu:addItem(elements)
    end
    menu:send()
end
local candisplay = false 
function AddRefineMenu(settings, craftingmenu)
    local menu = craftingmenu
    for index, recipe in pairs(settings.recipe) do
        candisplay = false
        TriggerServerEvent("murphy_craft:AskDataRefine", CurrentIdentification, index)
        local elements = {
            title = recipe.label,
            description = recipe.description,
            -- data = {tag = index},
            -- sliders = {
            --     { type = "switch", current = 1, values = {{label = 0}} }
            -- },
            child = tostring("subrefine_" .. recipe.label),
            onActive = function(currentData)
            end,
            onClick = function(currentData)
            end,
        }
        if settings.icon then
            elements["icon"] = settings.icon
        end
        AddRefineSubMenu(recipe, menu, index)
        menu:addItem(elements)
    end
    menu:send()
end

local materialscount = 1
local upgradecount = {}
local fuelcount = 1
RegisterNetEvent("murphy_craft:GetRefineData", function (data)
    materialscount = data.materialscount
    upgradecount = data.upgradecount
    fuelcount = data.fuelcount
    candisplay = true 
end)

function AddRefineSubMenu(recipe, menu, recindex)
    local RecipeIndex = recindex
    local worktime = recipe.worktime
    local refinesubmenu = jo.menu.create(tostring("subrefine_" .. recipe.label), {
        title = recipe.label, -- The big title of the menu
        subtitle = recipe.description, -- The subtitle of the menu
        numberOnScreen = 8, -- The number of item display before adding a scroll
    })

    local index = 0
    if recipe.materials ~= nil then
        index = index +1
        local settings =  recipe.materials
        local elements = {
            title = settings.label,
            description = settings.description,
            data = {tag = index},
            sliders = {
                { type = "switch", current = 1, values = {{label = 0}} }
            },
            onActive = function(currentData)
                --- check quantity, reload slider
                CurrentCraftingMenu = refinesubmenu
                TriggerServerEvent("murphy_craft:CraftCheckQuantity", settings, tonumber(currentData.item.data.tag))
            end,
            onClick = function(currentData)
                --- add materials, reload slider
                local sliderindex = tonumber(currentData.item.data.tag)
                local count = currentData.item.sliders[1].current
                TriggerServerEvent("murphy_craft:AddItemstoRefine", count, "materials", CurrentIdentification, settings ,RecipeIndex, worktime, recipe.outcome.craft, recipe.fuel)
                TriggerServerEvent("murphy_craft:CraftCheckQuantity", settings, sliderindex)
            end,
        }
        while candisplay == false do Wait(0) end
        elements["footer"] = tostring(recipe.text.materialscount.." "..materialscount) or ""
        if settings.icon then
            elements["icon"] = settings.icon
        end
        refinesubmenu:addItem(elements)
    end
    if recipe.upgrade ~= nil then
        index = index +1
        local settings =  recipe.upgrade
        local elements = {
            title = settings.label,
            description = settings.description,
            -- data = {tag = index},
            -- sliders = {
            --     { type = "switch", current = 1, values = {{label = 0}} }
            -- },
            child = tostring("subrefine_" ..recipe.label.."upgrade"),
            onActive = function(currentData)
            end,
            onClick = function(currentData)
            end,
        }
        if settings.icon then
            elements["icon"] = settings.icon
        end
        refinesubmenu:addItem(elements)

        local refinesubmenuupgrade = jo.menu.create(tostring("subrefine_" ..recipe.label.."upgrade"), {
            title = settings.label, -- The big title of the menu
            subtitle = settings.description, -- The subtitle of the menu
            numberOnScreen = 8, -- The number of item display before adding a scroll
        })
        local subindex = 0
        for k , v in pairs(settings.recipe) do
            subindex = subindex + 1
            local elements = {
                title = v.label,
                data = {tag = subindex},
                
                sliders = {
                    { type = "switch", current = 1, values = {{label = 0}} }
                },
                onActive = function(currentData)
                    --- check quantity, reload slider
                    CurrentCraftingMenu = refinesubmenuupgrade
                    TriggerServerEvent("murphy_craft:CraftCheckQuantity", v, tonumber(currentData.item.data.tag))
                end,
                onClick = function(currentData)
                    --- add materials, reload slider
                    local count = currentData.item.sliders[1].current
                    TriggerServerEvent("murphy_craft:AddItemstoRefine", count, "upgrade", CurrentIdentification, v ,RecipeIndex, worktime, recipe.outcome.craft, recipe.fuel, v.craft)
                    TriggerServerEvent("murphy_craft:CraftCheckQuantity", v, tonumber(currentData.item.data.tag))
                end,
            }
            local footerdata = recipe.text.upgradecount
            while candisplay == false do Wait(0) end
            if next(upgradecount) ~= nil then
                for _, value in pairs(v.craft) do
                    footerdata = footerdata.." "..upgradecount[value.item]
                end
                elements["footer"] = footerdata
            else
                footerdata = footerdata.." 0"
                elements["footer"] = footerdata
            end
            if v.icon then
                elements["icon"] = v.icon
            end
            refinesubmenuupgrade:addItem(elements)
        end
        refinesubmenuupgrade:send()
    end
    if recipe.fuel ~= nil then
        index = index +1
        local settings =  recipe.fuel
        local elements = {
            title = settings.label,
            description = settings.description,
            data = {tag = index},
            sliders = {
                { type = "switch", current = 1, values = {{label = 0}} }
            },
            onActive = function(currentData)
                --- check quantity, reload slider
                CurrentCraftingMenu = refinesubmenu
                TriggerServerEvent("murphy_craft:CraftCheckQuantity", settings, tonumber(currentData.item.data.tag))
            end,
            onClick = function(currentData)
                --- add materials, reload slider
                local sliderindex = tonumber(tonumber(currentData.item.data.tag))
                local count = currentData.item.sliders[1].current
                TriggerServerEvent("murphy_craft:AddItemstoRefine", count, "fuel", CurrentIdentification, settings ,RecipeIndex, worktime, recipe.outcome.craft, recipe.fuel)
                TriggerServerEvent("murphy_craft:CraftCheckQuantity", settings, sliderindex)
            end,
        }
        while candisplay == nil do Wait(0) end
        elements["footer"] = tostring(recipe.text.fuelcount.." "..fuelcount) or ""
        if settings.icon then
            elements["icon"] = settings.icon
        end
        refinesubmenu:addItem(elements)
    end
    if recipe.outcome ~= nil then
        index = index +1
        local settings =  recipe.outcome
        local elements = {
            title = settings.label,
            description = settings.description,
            -- data = {tag = index},
            -- sliders = {
            --     { type = "switch", current = 1, values = {{label = 0}} }
            -- },
            child = tostring("subrefine_" ..recipe.label.."_outcome"),
            onActive = function(currentData)
            end,
            onClick = function(currentData)
            end,
        }
        if settings.icon then
            elements["icon"] = settings.icon
        end
        refinesubmenu:addItem(elements)

        local refinesubmenuoutcome = jo.menu.create(tostring("subrefine_" ..recipe.label.."_outcome"), {
            title = settings.label, -- The big title of the menu
            subtitle = settings.description, -- The subtitle of the menu
            numberOnScreen = 8, -- The number of item display before adding a scroll
        })
        local subindex = 0
        local outcometable = {}
        for k , v in pairs(settings.craft) do
            if v then
                table.insert(outcometable, v)
            end
        end
        if recipe.upgrade then
            for k , v in pairs(recipe.upgrade.recipe) do
                if v.craft then
                    for _, data in pairs(v.craft) do
                        table.insert(outcometable, data)
                    end
                end
            end
        end
        for k , v in pairs(outcometable) do
            subindex = subindex + 1
            local elements = {
                title = v.label,
                data = {tag = subindex},
                sliders = {
                    { type = "switch", current = 1, values = {{label = 0}} }
                },
                onActive = function(currentData)
                    --- check quantity, reload slider
                    CurrentCraftingMenu = refinesubmenuoutcome
                    TriggerServerEvent("murphy_craft:CheckRefinedQuantity", v.item, v.amount, tonumber(currentData.item.data.tag), CurrentIdentification, RecipeIndex)
                end,
                onClick = function(currentData)
                    --- add materials, reload slider
                    local count = currentData.item.sliders[1].current
                    
                    TriggerServerEvent("murphy_craft:RetrieveRefinedItems", v.item, count, CurrentIdentification, RecipeIndex)
                    TriggerServerEvent("murphy_craft:CheckRefinedQuantity", v.item, v.amount, tonumber(currentData.item.data.tag), CurrentIdentification, RecipeIndex)
                end,
            }
            if v.icon then
                elements["icon"] = v.icon
            end
            refinesubmenuoutcome:addItem(elements)
        end
        refinesubmenuoutcome:send()
    end
    refinesubmenu:send()
end


RegisterCommand("craft", function (source, args, raw)
    TriggerEvent("murphy_craft:OpenCraftingMenu", tostring(args[1]), tostring(args[2]))
end)
