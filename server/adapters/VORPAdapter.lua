if Config.framework == 'vorp' then
    VorpInv = exports.vorp_inventory:vorp_inventoryApi()
    
    local VorpCore = {}
    
    TriggerEvent("getCore",function(core)
        VorpCore = core
    end)
    
    
    function GetCharJob(targetID) 
        local user = VorpCore.getUser(targetID)
        if user then 
            job = VorpCore.getUser(targetID).getUsedCharacter.job
        else job = nil end
        return job
    end

    function GetCharJobGrade(targetID) 
        local user = VorpCore.getUser(targetID)
        if user then 
            job = VorpCore.getUser(targetID).getUsedCharacter.jobGrade
        else job = nil end
        return job
    end
    
    function GetCharIdentifier(targetID)
        return VorpCore.getUser(targetID).getUsedCharacter.charIdentifier
    end
    
    function GetCharFirstname(targetID)
        return VorpCore.getUser(targetID).getUsedCharacter.firstname
    end
    
    function GetCharLastname(targetID)
        return VorpCore.getUser(targetID).getUsedCharacter.lastname
    end
    
    function GetCharMoney(targetID)
        return VorpCore.getUser(targetID).getUsedCharacter.money
    end

    function AddCurrency(targetID, amount)
        VorpCore.getUser(targetID).getUsedCharacter.addCurrency(0, amount)
    end
    
    function RemoveCurrency(targetID, amount)
        VorpCore.getUser(targetID).getUsedCharacter.removeCurrency(0, amount)
    end
    
    function GetCharGroup(targetID)
        return VorpCore.getUser(targetID).getUsedCharacter.group
    end

    function GiveItem(src, item, amount, meta)
        local _meta = meta
        local result = VorpInv.addItem(src, item, amount, _meta)
        return result
    end

    function RemoveItem(src, item, amount, meta)
        local _meta = meta
        local result = VorpInv.subItem(src, item, amount, _meta)
        return result
    end

    function GetItemAmount(src, item)
        local ItemData = VorpInv.getItemCount(src, item)
        return ItemData
    end

end
