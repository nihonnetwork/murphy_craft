if Config.framework == "REDEMRP2k23" then
    Inventory = {}

    TriggerEvent("redemrp_inventory:getData", function (data)
        Inventory = data
    end)

    local RedEM = exports["redem_roleplay"]:RedEM()
    
    
    function GetCharJob(targetID)
        local user = RedEM.GetPlayer(targetID)
        if user then 
            job = RedEM.GetPlayer(targetID).job
        else job = nil end
        return job
    end

    function GetCharJobGrade(targetID) 
        local user = RedEM.GetPlayer(targetID)
        if user then 
            jobgrade = RedEM.GetPlayer(targetID).jobgrade
        else jobgrade = nil end
        return jobgrade
    end
    
    function GetCharIdentifier(targetID)
        return RedEM.GetPlayer(targetID).citizenid
    end
    
    function GetCharFirstname(targetID)
        return RedEM.GetPlayer(targetID).firstname
    end
    
    function GetCharLastname(targetID)
        return RedEM.GetPlayer(targetID).lastname
    end
    
    function GetCharMoney(targetID)
        return RedEM.GetPlayer(targetID).money
    end
    
    function RemoveCurrency(targetID, amount)
        RedEM.GetPlayer(targetID).RemoveMoney(tonumber(amount))
    end

    function AddCurrency(targetID, amount)
        RedEM.GetPlayer(targetID).AddMoney(tonumber(amount))
    end
    
    function GetCharGroup(targetID)
        return RedEM.GetPlayer(targetID).group
    end
    
    function GiveItem(src, item, amount, meta)
        local _meta = meta
        local ItemData = Inventory.getItem(src, item, _meta)
        local result = ItemData.AddItem(amount)
        return result
    end
    
    function RemoveItem(src, item, amount, meta)
        local _meta = meta
        local ItemData = Inventory.getItem(src, item, _meta)
        local result = ItemData.RemoveItem(amount)
        return result
    end

    function GetItemAmount(src, item)
        local ItemData = Inventory.getItem(src, item)
        return ItemData.ItemAmount
    end

    function OpenStash(src, stash, weight)
        TriggerClientEvent("redemrp_inventory:OpenStash", src, stash, weight)
    end

    function SetCharJob(targetID, job)
        local user = RedEM.GetPlayer(targetID)
        user.SetJob(job)    
    end

    function SetCharJobGrade(targetID, jobgrade)
        local user = RedEM.GetPlayer(targetID)
        user.SetJobGrade(jobgrade)    
    end

   

end