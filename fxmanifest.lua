fx_version "adamant"
games {"rdr3"}
rdr3_warning 'I acknowledge that this is a prerelease build of RedM, and I am aware my resources *will* become incompatible once RedM ships.'

shared_scripts {
    '@jo_libs/init.lua'
  }

jo_libs {
    'menu',
  }
  
ui_page "nui://jo_libs/nui/menu/index.html"

client_scripts {
    'config/*.lua',
    'config/workbench/*.lua',
    'client/*.lua',
}

server_scripts {
    '@oxmysql/lib/MySQL.lua',
    'config/*.lua',
    'config/workbench/*.lua',
	'server/adapters/*.lua',
    'server/*.lua',
}

escrow_ignore {
	'server/adapters/*.lua',
    'server/*.lua',
    'client/*.lua',
    'config/workbench/*.lua',
    'config/*.lua',
}

lua54 'yes'