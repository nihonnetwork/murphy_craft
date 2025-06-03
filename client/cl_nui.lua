-- Sistema de Comunicação NUI-Lua
local NUIManager = {}

-- Estado do NUI
local State = {
    isBookOpen = false,
    isCrafting = false,
    currentPage = 1,
    currentCategory = nil,
    currentRecipe = nil
}

-- Eventos NUI -> Lua
RegisterNUICallback("requestRecipes", function(data, cb)
    local category = data.category
    TriggerServerEvent("npp_craft:RequestRecipes", category)
    cb("ok")
end)

RegisterNUICallback("requestCategories", function(data, cb)
    TriggerServerEvent("npp_craft:RequestCategories")
    cb("ok")
end)

RegisterNUICallback("updateBookState", function(data, cb)
    State.currentPage = data.page
    State.currentCategory = data.category
    cb("ok")
end)

-- Eventos Lua -> NUI
RegisterNetEvent("npp_craft:ReceiveRecipes")
AddEventHandler("npp_craft:ReceiveRecipes", function(recipes)
    if State.isBookOpen then
        SendNUIMessage({
            action = "updateRecipes",
            data = recipes
        })
    end
end)

RegisterNetEvent("npp_craft:ReceiveCategories")
AddEventHandler("npp_craft:ReceiveCategories", function(categories)
    if State.isBookOpen then
        SendNUIMessage({
            action = "updateCategories",
            data = categories
        })
    end
end)

-- Funções de Utilidade
function NUIManager.OpenBook(type, identification)
    State.isBookOpen = true
    SetNuiFocus(true, true)
    SendNUIMessage({
        action = "openBook",
        data = {
            type = type,
            identification = identification
        }
    })
end

function NUIManager.CloseBook()
    State.isBookOpen = false
    State.currentPage = 1
    State.currentCategory = nil
    State.currentRecipe = nil
    SetNuiFocus(false, false)
    SendNUIMessage({
        action = "closeBook"
    })
end

-- Exportar funções
exports("OpenBook", NUIManager.OpenBook)
exports("CloseBook", NUIManager.CloseBook) 