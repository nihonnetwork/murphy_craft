# Murphy Craft - Interface de Livro

Uma interface imersiva em estilo de livro para o sistema de crafting do Murphy Craft, inspirada em Red Dead Redemption.

## 📋 Características

- Interface de livro interativa com efeito de virar páginas
- Categorias organizadas com abas laterais
- Sistema de busca de receitas
- Sistema de favoritos
- Notas pessoais nas receitas
- Design responsivo
- Animações suaves
- Tema visual do Velho Oeste

## 🛠️ Instalação

1. Copie a pasta `nui` para o diretório do seu recurso
2. Adicione os arquivos de fonte necessários em `nui/book/assets/fonts`
3. Adicione as texturas necessárias em `nui/book/assets/textures`
4. Adicione as ilustrações dos itens em `nui/book/assets/illustrations`

## 📦 Dependências

- jQuery 3.6.0+
- Turn.js

## 🎨 Personalização

### Cores
As cores das categorias podem ser personalizadas no arquivo `categories.js`:

```javascript
getCategoryColor(index) {
    const colors = [
        '#8B4513', // Marrom escuro
        '#654321', // Marrom médio
        '#A0522D', // Siena
        '#D2691E', // Chocolate
        '#8B7355', // Marrom claro
        '#CD853F'  // Peru
    ];
    
    return colors[index % colors.length];
}
```

### Descrições das Categorias
As descrições podem ser editadas no arquivo `categories.js`:

```javascript
getCategoryDescription(category) {
    const descriptions = {
        'Tendas': 'Abrigos e estruturas temporárias para sua jornada',
        'Mesas': 'Superfícies de trabalho e mobília funcional',
        // ...
    };
    
    return descriptions[category] || 'Receitas especiais desta categoria';
}
```

## 🔧 Uso

Para abrir o livro de crafting:

```lua
RegisterNetEvent("murphy_craft:OpenCraftingMenu", function(type, identification)
    SendNUIMessage({
        action = "openBook",
        data = {
            type = type,
            identification = identification
        }
    })
    SetNuiFocus(true, true)
end)
```

Para fechar o livro:

```lua
RegisterNUICallback('closeBook', function(data, cb)
    SetNuiFocus(false, false)
    cb('ok')
end)
```

## 📝 Estrutura de Arquivos

```
nui/
├── book/
│   ├── index.html
│   ├── css/
│   │   ├── book.css
│   │   ├── pages.css
│   │   └── animations.css
│   ├── js/
│   │   ├── book.js
│   │   ├── crafting.js
│   │   └── categories.js
│   └── assets/
│       ├── textures/
│       ├── fonts/
│       └── illustrations/
```

## 🎮 Controles

- `ESC` - Fecha o livro
- `←/→` - Navega entre as páginas
- Clique nas abas laterais para ir direto para uma categoria
- Use a barra de busca para encontrar receitas específicas

## 🤝 Contribuindo

1. Faça um Fork do projeto
2. Crie uma Branch para sua Feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a Branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.
