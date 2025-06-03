local isBookOpen = false
local isBookLoaded = false
local isCrafting = false
local isInteracting = false
local CurrentIdentification = nil
local CurrentType = nil

-- Função para abrir o menu de crafting
RegisterNetEvent("npp_craft:OpenCraftingMenu")
AddEventHandler("npp_craft:OpenCraftingMenu", function(type, identification)
    if not type or not identification then return end
    
    CurrentType = type
    CurrentIdentification = identification
    
    -- Carregar dados do workbench e enviar para a NUI
    local menuData = Workbench[type]
    if menuData then
        SendNUIMessage({
            action = "openBook",
            data = {
                type = type,
                identification = identification,
                categories = menuData.categories,
                title = menuData.main_header,
                subtitle = menuData.main_subheader
            }
        })
        SetNuiFocus(true, true)
        isBookOpen = true
    else 
        print("^1[ERROR]^0: No craft data found for type: " .. tostring(type))
    end
end)

-- Callback quando o jogador fecha o livro pela NUI
RegisterNUICallback("closeBook", function(data, cb)
    isBookOpen = false
    SetNuiFocus(false, false)
    CurrentType = nil
    CurrentIdentification = nil
    cb("ok")
end)

-- Callback para verificar quantidade de itens
RegisterNUICallback("checkQuantity", function(data, cb)
    local recipe = data.recipe
    if recipe then
        TriggerServerEvent("npp_craft:CraftCheckQuantity", recipe, data.tag)
    end
    cb("ok")
end)

-- Callback para iniciar crafting
RegisterNUICallback("startCraft", function(data, cb)
    if not isCrafting then
        local settings = data.settings
        local index = data.index
        local amount = data.amount
        
        TriggerServerEvent("npp_craft:TryCraft", settings, index, amount)
    end
    cb("ok")
end)

-- Callback para verificar itens refinados
RegisterNUICallback("checkRefinedQuantity", function(data, cb)
    TriggerServerEvent("npp_craft:CheckRefinedQuantity", data.item, data.multiply, data.sliderIndex, CurrentIdentification, data.recipeIndex)
    cb("ok")
end)

-- Callback para adicionar itens para refinar
RegisterNUICallback("addItemsToRefine", function(data, cb)
    TriggerServerEvent("npp_craft:AddItemstoRefine", 
        data.amount, 
        data.refineType, 
        CurrentIdentification, 
        data.itemData, 
        data.recipeIndex, 
        data.worktime, 
        data.outcomeData, 
        data.fuelData,
        data.upgradeData
    )
    cb("ok")
end)

-- Callback para recuperar itens refinados
RegisterNUICallback("retrieveRefinedItems", function(data, cb)
    TriggerServerEvent("npp_craft:RetrieveRefinedItems", 
        data.item, 
        data.count, 
        CurrentIdentification, 
        data.recipeIndex
    )
    cb("ok")
end)

-- Evento para receber dados do refino
RegisterNetEvent("npp_craft:GetRefineData")
AddEventHandler("npp_craft:GetRefineData", function(data)
    if isBookOpen then
        SendNUIMessage({
            action = "updateRefineData",
            data = data
        })
    end
end)

-- Evento para atualizar quantidade de craft
RegisterNetEvent("npp_craft:CraftGetQuantity")
AddEventHandler("npp_craft:CraftGetQuantity", function(amount, tag)
    if isBookOpen then
        SendNUIMessage({
            action = "updateCraftQuantity",
            data = {
                amount = amount,
                tag = tag
            }
        })
    end
end)

-- Evento para animação de craft
RegisterNetEvent("npp_craft:PlayCraftAnim")
AddEventHandler("npp_craft:PlayCraftAnim", function(dict, name, duration, settings, recipeIndex, amount)
    isCrafting = true
    isInteracting = true

    RequestAnimDict(dict)
    while not HasAnimDictLoaded(dict) do
        Wait(0)
    end

    TaskPlayAnim(PlayerPedId(), dict, name, 1.0, 1.0, duration * 1000, 1, 0, true, 0, false, 0, false)
    Wait(duration * 1000)
    ClearPedTasks(PlayerPedId())

    isCrafting = false
    isInteracting = false
    
    TriggerServerEvent("npp_craft:FinishCraft", settings, recipeIndex, amount)
end)

-- Evento para notificações
RegisterNetEvent("npp_craft:Notify")
AddEventHandler("npp_craft:Notify", function(text, icon, color, duration)
    SendNUIMessage({
        action = "showNotification",
        data = {
            text = text,
            icon = icon,
            color = color,
            duration = duration
        }
    })
end)

-- Thread para cancelar crafting
Citizen.CreateThread(function()
    while true do
        Wait(0)
        if isCrafting then
            if IsControlJustReleased(0, 0x760A9C6F) then -- G key
                isCrafting = false
                SendNUIMessage({
                    action = "craftingCancelled"
                })
            end
        end
    end
end)

-- Comando para abrir o menu de craft
RegisterCommand("craft", function(source, args)
    TriggerEvent("npp_craft:OpenCraftingMenu", tostring(args[1]), tostring(args[2]))
end)
