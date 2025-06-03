-- Sistema de Gerenciamento do Banco de Dados
Citizen.CreateThread(function()
    Wait(1000) -- Aguardar conexão com banco de dados
    
    -- Criar tabela de receitas se não existir
    MySQL.query([[
        CREATE TABLE IF NOT EXISTS `npp_recipes` (
            `id` varchar(50) NOT NULL,
            `category` varchar(50) NOT NULL,
            `name` varchar(100) NOT NULL,
            `description` text,
            `materials` longtext NOT NULL,
            `result` longtext NOT NULL,
            `worktime` int(11) NOT NULL DEFAULT 0,
            `level` int(11) NOT NULL DEFAULT 1,
            `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (`id`),
            KEY `category_index` (`category`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    ]], {}, function(result)
        print("^2[npp_craft]^0 Tabela de receitas verificada/criada com sucesso!")
    end)
    
    -- Criar tabela de progresso do jogador se não existir
    MySQL.query([[
        CREATE TABLE IF NOT EXISTS `npp_player_crafting` (
            `player_id` varchar(50) NOT NULL,
            `recipe_id` varchar(50) NOT NULL,
            `crafted_count` int(11) NOT NULL DEFAULT 0,
            `last_crafted` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (`player_id`, `recipe_id`),
            FOREIGN KEY (`recipe_id`) REFERENCES `npp_recipes`(`id`) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    ]], {}, function(result)
        print("^2[npp_craft]^0 Tabela de progresso verificada/criada com sucesso!")
    end)
end) 