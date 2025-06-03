-- Sistema de Gerenciamento de Receitas
local RecipeManager = {}
local Categories = {}
local Recipes = {}

-- Carregar categorias e receitas do banco de dados
Citizen.CreateThread(function()
    Wait(2000) -- Aguardar conexão com banco de dados
    
    -- Carregar categorias
    MySQL.query([[
        SELECT DISTINCT category FROM npp_recipes
        ORDER BY category ASC
    ]], {}, function(categories)
        if categories then
            for _, cat in pairs(categories) do
                table.insert(Categories, cat.category)
            end
            print("^2[npp_craft]^0 Categorias carregadas: " .. #Categories)
        end
    end)
    
    -- Carregar receitas
    MySQL.query([[
        SELECT * FROM npp_recipes
    ]], {}, function(recipes)
        if recipes then
            for _, recipe in pairs(recipes) do
                if not Recipes[recipe.category] then
                    Recipes[recipe.category] = {}
                end
                table.insert(Recipes[recipe.category], {
                    id = recipe.id,
                    name = recipe.name,
                    description = recipe.description,
                    materials = json.decode(recipe.materials),
                    result = json.decode(recipe.result),
                    worktime = recipe.worktime,
                    level = recipe.level or 1
                })
            end
            print("^2[npp_craft]^0 Receitas carregadas com sucesso!")
        end
    end)
end)

-- Eventos
RegisterNetEvent("npp_craft:RequestCategories")
AddEventHandler("npp_craft:RequestCategories", function()
    local _source = source
    TriggerClientEvent("npp_craft:ReceiveCategories", _source, Categories)
end)

RegisterNetEvent("npp_craft:RequestRecipes")
AddEventHandler("npp_craft:RequestRecipes", function(category)
    local _source = source
    if Recipes[category] then
        TriggerClientEvent("npp_craft:ReceiveRecipes", _source, Recipes[category])
    else
        TriggerClientEvent("npp_craft:ReceiveRecipes", _source, {})
    end
end)

-- Funções de Utilidade
function RecipeManager.GetRecipe(category, recipeId)
    if Recipes[category] then
        for _, recipe in pairs(Recipes[category]) do
            if recipe.id == recipeId then
                return recipe
            end
        end
    end
    return nil
end

-- Exportar funções
exports("GetRecipe", RecipeManager.GetRecipe) 