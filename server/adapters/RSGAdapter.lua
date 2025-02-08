if Config.framework == 'rsg-core' then
    local CORE = exports['rsg-core']:GetCoreObject()

    function GetCharJob(targetID)
        targetID = tonumber(targetID)
        local user = CORE.Functions.GetPlayer(targetID)
        if user then 
            job = CORE.Functions.GetPlayer(targetID).PlayerData.job.name
        else job = nil end
        return job
    end

    function GetCharJobGrade(targetID) 
        targetID = tonumber(targetID)
        local user = CORE.Functions.GetPlayer(targetID)
        if user then 
            job = CORE.Functions.GetPlayer(targetID).PlayerData.job.grade.level
        else job = nil end
        return job
    end

    function GetCharIdentifier(targetID)
        targetID = tonumber(targetID)
        return CORE.Functions.GetPlayer(targetID).PlayerData.citizenid
    end

    function GetCharFirstname(targetID)
        targetID = tonumber(targetID)
        return CORE.Functions.GetPlayer(targetID).PlayerData.charinfo.firstname
    end

    function GetCharLastname(targetID)
        targetID = tonumber(targetID)
        return CORE.Functions.GetPlayer(targetID).PlayerData.charinfo.lastname
    end

    function GetCharMoney(targetID)
        targetID = tonumber(targetID)
        return CORE.Functions.GetPlayer(targetID).PlayerData.money["cash"]
    end

    function AddCurrency(targetID, amount)
        targetID = tonumber(targetID)
        local Player = CORE.Functions.GetPlayer(targetID)
        Player.Functions.AddMoney("cash", amount)
    end

    function RemoveCurrency(targetID, amount)
        targetID = tonumber(targetID)
        local Player = CORE.Functions.GetPlayer(targetID)
        Player.Functions.RemoveMoney("cash", amount)
    end

    function GetCharGroup(targetID)
        targetID = tonumber(targetID)
        local permissions = CORE.Functions.GetPermission(targetID)
        for k, v in pairs(permissions) do
            return k
        end
    end
    
    function GiveItem(src, item, amount, meta)
        local Player = CORE.Functions.GetPlayer(src)
        local _meta = meta
        local result = Player.Functions.AddItem(item, amount)
        return result
    end
    
    function RemoveItem(src, item, amount, meta)
        local Player = CORE.Functions.GetPlayer(src)
        local _meta = meta
        local result = Player.Functions.RemoveItem(item, amount)
        return result
    end

    function GetItemAmount(src, item)
        local Player = CORE.Functions.GetPlayer(src)
        local _meta = meta
        local result = Player.Functions.GetItemByName(item, amount)
        if result then
            amount = result.amount
        else
            amount = 0
        end

        return amount
    end

  
end
