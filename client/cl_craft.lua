local isBookOpen = false
local isBookLoaded = false

-- Carregar a NUI quando o recurso iniciar
Citizen.CreateThread(function()
    -- Aguardar um pouco para garantir que tudo esteja carregado
    Citizen.Wait(1000)
    
    -- Carregar a NUI de forma oculta
    SendNUIMessage({
        action = "loadBook",
        data = {
            hidden = true
        }
    })
    
    isBookLoaded = true
end)

-- Comando para abrir/fechar o livro
RegisterCommand("craftbook", function(source, args)
    if not isBookLoaded then return end
    
    isBookOpen = not isBookOpen
    
    if isBookOpen then
        -- Abrir o livro
        SendNUIMessage({
            action = "openBook",
            data = {
                type = "main", -- ou o tipo específico que você quiser
                identification = "player_" .. GetPlayerServerId(PlayerId())
            }
        })
        SetNuiFocus(true, true)
    else
        -- Fechar o livro
        SendNUIMessage({
            action = "closeBook"
        })
        SetNuiFocus(false, false)
    end
end)

-- Verificar tecla pressionada (alternativa ao RegisterKeyMapping)
Citizen.CreateThread(function()
    while true do
        Citizen.Wait(0)
        if IsControlJustPressed(0, 0x4F) then -- Tecla K (0x4F)
            ExecuteCommand("craftbook")
        end
    end
end)

-- Callback para quando o livro é fechado pela NUI (ESC)
RegisterNUICallback("closeBook", function(data, cb)
    isBookOpen = false
    SetNuiFocus(false, false)
    cb("ok")
end)

-- Callback para quando o livro termina de carregar
RegisterNUICallback("bookLoaded", function(data, cb)
    isBookLoaded = true
    cb("ok")
end)

-- Exportar função para uso em outros recursos
exports("OpenCraftBook", function()
    if not isBookOpen then
        ExecuteCommand("craftbook")
    end
end)

exports("CloseCraftBook", function()
    if isBookOpen then
        ExecuteCommand("craftbook")
    end
end) 