-- Adaptador de Receitas
local RecipeAdapter = {}

-- Função para converter ingredientes para o novo formato
local function convertIngredients(ingredients)
    local materials = {}
    for itemName, data in pairs(ingredients) do
        table.insert(materials, {
            item = itemName,
            amount = data.amount,
            return_item = data.returnItem,
            return_amount = data.returnAmount
        })
    end
    return json.encode(materials)
end

-- Função para converter resultado
local function convertResult(item, amount)
    return json.encode({
        {
            item = item,
            amount = amount
        }
    })
end

-- Função para importar receitas do Config
function RecipeAdapter.ImportFromConfig()
    if not Config or not Config.Receipes then
        print("^1[ERRO]^0 Config.Receipes não encontrado!")
        return
    end

    local count = 0
    for recipeId, recipeData in pairs(Config.Receipes) do
        -- Converter dados para o novo formato
        local materials = convertIngredients(recipeData.Ingredients)
        local result = convertResult(recipeData.Item, recipeData.Amount)
        
        -- Inserir na nova tabela
        MySQL.query([[
            INSERT INTO npp_recipes 
            (id, category, name, description, materials, result, worktime, level) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
            category = VALUES(category),
            name = VALUES(name),
            description = VALUES(description),
            materials = VALUES(materials),
            result = VALUES(result),
            worktime = VALUES(worktime),
            level = VALUES(level)
        ]], {
            recipeId,
            recipeData.Category,
            recipeData.Item,
            recipeData.Desc,
            materials,
            result,
            recipeData.Time,
            recipeData.Level
        }, function(affectedRows)
            if affectedRows then
                count = count + 1
                print(string.format("^2[npp_craft]^0 Receita importada: %s", recipeId))
            end
        end)
    end

    print(string.format("^2[npp_craft]^0 Importação concluída! %d receitas processadas.", count))
end

-- Comando para importar receitas
RegisterCommand("importreceitas", function(source, args)
    if source == 0 then -- Apenas console
        RecipeAdapter.ImportFromConfig()
    end
end, true)

-- Exportar funções
exports("ImportRecipes", RecipeAdapter.ImportFromConfig) 