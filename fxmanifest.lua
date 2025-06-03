fx_version 'cerulean'
game 'rdr3'
rdr3_warning 'I acknowledge that this is a prerelease build of RedM, and I am aware my resources *will* become incompatible once RedM ships.'

description 'Murphy Craft - Sistema de Crafting com Interface de Livro'
version '0.1.0'
author 'Murphy Development'

shared_scripts {
    'receipes.lua'
}

client_scripts {
    'client/*.lua'
}

server_scripts {
    '@oxmysql/lib/MySQL.lua',
    'server/sv_database.lua',
    'server/sv_recipe_adapter.lua',
    'server/sv_recipes.lua',
    'server/*.lua'
}

ui_page 'nui/book/index.html'

files {
    'nui/book/index.html',
    'nui/book/css/*.css',
    'nui/book/js/*.js',
    'nui/book/assets/**/*'
}

escrow_ignore {
	'server/adapters/*.lua',
    'server/*.lua',
    'client/*.lua',
    'config/workbench/*.lua',
    'config/*.lua',
}

lua54 'yes'