local allworkbench = {}


jo.callback.register('murphy_craft:GiveItem', function(source,item,amount, meta)
	print(source,item,amount, meta)
	local result = GiveItem(source, item, amount, meta)
	return result
end)

jo.callback.register('murphy_craft:RemoveItem', function(source,item,amount, meta)
	print(source,item,amount, meta)
	local result = RemoveItem(source, item, amount, meta)
	return result
end)


RegisterServerEvent("murphy_craft:CraftCheckQuantity", function(data, tag)
    local _source = source
	local ItemAmount = {}
	local cancraft = true
	local loweramount = 0
	for k, v in pairs (data.need) do
		if cancraft == true then
			if GetItemAmount(_source, v[1]) < 1 then
				cancraft = false
			else
				amnt = GetItemAmount(_source, v[1]) / v[2]
				table.insert(ItemAmount, amnt)
			end
		end
	end
	if cancraft == true then
		loweramount = ItemAmount[1]
		for index , quantity in pairs(ItemAmount) do
			if quantity < loweramount then
				loweramount = quantity
			end
		end
		TriggerClientEvent("murphy_craft:CraftGetQuantity", _source, math.floor(loweramount), tag)
	else
		TriggerClientEvent("murphy_craft:CraftGetQuantity", _source, 0, tag)
	end

end)

RegisterServerEvent("murphy_craft:CheckRefinedQuantity", function(item, multiply, sliderindex,  id, recipe)
	local workbenchid = id.."_"..recipe
	local count
	local _source = source
	local call = allworkbench[workbenchid]
	if call then
		local outcome = call.outcome
		if outcome then
			if outcome[item] then
				if outcome[item].count then
					count = outcome[item].count
				else count = 0 end
			else count = 0 end
		end
	else
		count = 0
	end
	count = count * multiply
	TriggerClientEvent("murphy_craft:CraftGetQuantity", _source, count, sliderindex)


end)

RegisterServerEvent("murphy_craft:AddItemstoRefine", function(amount, refinetype, id, data, recipe, timer, outcomedata, fueldata, upgradedata)
	local _source = source
	local workbenchid = id.."_"..recipe
	local worktime = tonumber(timer) or 0
	local call = allworkbench[workbenchid]
		if call then
			Materials = call.materials
			Upgrade = call.upgrade
			Fuel = call.fuel
			Outcome = call.outcome
		else
			Materials = 0
			Upgrade = {}
			if fueldata == nil then
				Fuel = "false"
			else
				Fuel = 0
			end
			Outcome = {}
			for k,v in pairs(outcomedata) do
				local item = v.item
				Outcome[item] = {base = true, count = 0}
			end
			local elements = { id = workbenchid, materials = 0, upgrade = {}, fuel = Fuel, outcome = Outcome, worktime = worktime}
			allworkbench[workbenchid] = elements
		end
		local cancraft = true
		for k, v in pairs (data.need) do
			if cancraft == true then
				if GetItemAmount(_source, v[1]) < v[2]*amount then
					cancraft = false
				end
			end
		end
		if cancraft == true then
			for k, v in pairs (data.need) do
				RemoveItem(_source, v[1], v[2]*amount, {})
			end
			if refinetype == "materials" then Materials = Materials+amount end
			if refinetype == "upgrade" then
				-- Trouver l'index suivant après le plus grand index
				local index = getNextIndex(Upgrade)
			
				-- Créer une nouvelle sous-table pour cet index
				Upgrade[index] = {}
			
				-- Ajouter chaque élément dans la nouvelle sous-table
				for k, v in pairs(upgradedata) do
					local item = v.item
					Upgrade[index][item] = amount
				end
			end
			if refinetype == "fuel" then Fuel = tostring(tonumber(Fuel)+amount) end
			local elements = {id = workbenchid, materials = Materials, upgrade = Upgrade, fuel = Fuel, outcome = Outcome, worktime = worktime}
			allworkbench[workbenchid] = elements
		end
end)
function getNextIndex(tbl)
    local maxIndex = 0

    -- Vérifie tous les indices utilisés dans la table
    for k, v in pairs(tbl) do
        if type(k) == "number" and k > maxIndex then
            maxIndex = k
        end
    end

    -- Retourne l'index suivant après le plus grand indice
    return maxIndex + 1
end

RegisterServerEvent("murphy_craft:RetrieveRefinedItems", function(item, count, id, recipe)
	local workbenchid = id.."_"..recipe
	local outcome = allworkbench[workbenchid].outcome

	if outcome then
		if outcome[item] then
			if outcome[item].count >= count then
				local result = GiveItem(source, item, count, {})
				if result then
					allworkbench[workbenchid].outcome[item].count = outcome[item].count - count
				else
					print "ERROR: Can't give items, maybe you're inventory is full"
				end
			end
		end
	else
	
	end
end)

RegisterServerEvent("murphy_craft:AskDataRefine", function(id, recipe)
	local workbenchid = id.."_"..recipe
	local _source = source
	local data = {}
	if allworkbench[workbenchid] then
		local table = allworkbench[workbenchid]
		data["materialscount"] = table.materials
		if table.fuel ~= "false" then
			data["fuelcount"] = tonumber(table.fuel)
		end
		data["upgradecount"] = {}
		for _, value in pairs(allworkbench[workbenchid].upgrade) do
			for k, v in pairs(value) do
				if v then
					if data["upgradecount"][k] then
						data["upgradecount"][k] = data["upgradecount"][k] + v
					else data["upgradecount"][k] = v end
				end
			end
		end


	else
		data["materialscount"] = 0
		data["fuelcount"] = 0
		data["upgradecount"] = {}
	end
	TriggerClientEvent("murphy_craft:GetRefineData", _source, data)
end)


Citizen.CreateThread(function ()
	Wait(1000)
	MySQL.query('SELECT * FROM `murphy_craft`',{}, function(result)
		if #result ~= 0 then
			for i = 1, #result do
				local outcome = json.decode(result[i].outcome)
				local upgrade = json.decode(result[i].upgrade)
				if result[i].materials < 1 and tonumber(result[i].fuel) < 1 and next(outcome) == nil and next(upgrade) == nil then
					MySQL.update('DELETE FROM murphy_craft WHERE `id`=@id', {id = result[i].id})
				else
					allworkbench[result[i].id]= {
						materials = result[i].materials,
						upgrade = json.decode(result[i].upgrade),
						fuel = result[i].fuel,
						outcome = json.decode(result[i].outcome),
						worktime = result[i].worktime,
						id = result[i].id
					}

				end
			end
		end
	end)

	while true do
		Wait(1000)
		for key, value in pairs(allworkbench) do
			if not value.worktimecount then value.worktimecount = 0 end
			value.worktimecount = value.worktimecount + 1
			if value.worktimecount >= value.worktime then
				value.worktimecount = 0
				local cancontinue = false
				local fuel = tonumber(value.fuel)
				if value.fuel ~= "false" then	---- est ce qu'il y a besoin de fuel

					if fuel >= 1 then
						cancontinue = true
					else cancontinue = false end
				end
				if cancontinue then
					if next(value.upgrade) ~= nil then
						local minIndex = math.huge  -- Initialiser à un très grand nombre
						for k, _ in pairs(value.upgrade) do
							if k < minIndex then
								minIndex = k
							end
						end
						local subtable = value.upgrade[minIndex]
							for k, v in pairs(subtable) do
								if v then
									if value.outcome[k] then
										value.outcome[k] = {count = value.outcome[k] + 1}
									else value.outcome[k] = {count = 1} end
									v = v - 1
									if v < 1 then
										subtable[k] = nil
									end
									value.fuel = tostring(fuel - 1)
									cancontinue = false
								end
							end
					end
				end
				if cancontinue then
					if value.materials > 1 then
						for k, v in pairs(value.outcome) do
							if v.base == true then
								v.count = v.count + 1
							end
						end
						value.fuel = tostring(fuel - 1)
						value.materials = value.materials - 1
					end
				end
			end
		end
	end
end)

Citizen.CreateThread(function ()
	while true do
	Wait(120*1000)
	SaveRefiningStations()
	end
end)



AddEventHandler("txAdmin:events:serverShuttingDown", function(eventData)
    CreateThread(function()
        print("^4[DB]^0 5 seconds before restart... saving all Refining Stations!")
		SaveRefiningStations()
    end)
end)

AddEventHandler('txAdmin:events:scheduledRestart', function(eventData)
    if eventData.secondsRemaining == 60 then
        CreateThread(function()
            print("^4[DB]^0 60 seconds before restart... saving all Refining Stations!")
            SaveRefiningStations()
        end)
    end
end)


RegisterCommand("savecraft", function (source, args, raw)
    if GetCharGroup(source) == "superadmin" then
        CreateThread(function()
            print("^4[DB]^0 Saving all Refining Stations by admin command!")
            SaveRefiningStations()
        end)
    end
end)


AddEventHandler(
    "onResourceStop",
    function(resourceName)
        if resourceName == GetCurrentResourceName() then
            SaveRefiningStations()
        end
    end
)


function SaveRefiningStations()
    craftSaved = 0
    for k,v in pairs(allworkbench) do
		if v.materials == 0 and tonumber(v.fuel) == 0 and next(v.outcome) == nil and next(v.upgrade) == nil then
            MySQL.update('DELETE FROM murphy_craft WHERE `id`=@id', {id = k}, function(rowsChanged)
            end)
        else
            local updateData = {
                materials = v.materials,
                upgrade = json.encode(v.upgrade),
                fuel = v.fuel,
                outcome = json.encode(v.outcome),
                worktime = v.worktime,
                id = k
            }
            

			MySQL.query(
				"SELECT * FROM murphy_craft WHERE `id`=@id;",
				{
					id = k,
				},
				function(result)
					if result[1] == nil then
						MySQL.update(
							'INSERT INTO murphy_craft (`id`, `materials`, `upgrade`, `fuel`, `outcome`, `worktime`) VALUES (@id, @materials, @upgrade, @fuel, @outcome, @worktime);', 
							updateData,
							function(rowsChanged)
							end
						)
						craftSaved = craftSaved + 1
					else
						MySQL.update(
							'UPDATE murphy_craft SET `materials`=@materials, `upgrade`=@upgrade, `fuel`=@fuel, `outcome`=@outcome, `worktime`=@worktime WHERE `id`=@id;', 
							updateData,
							function(rowsChanged)
							end
						)
						craftSaved = craftSaved + 1
					end
				end
			)
		end
    end
    Citizen.Wait(1000)
    print("^4[DB]^0 Saved ^3"..craftSaved.."^0 Refining Stations.")
end