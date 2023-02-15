const fileSystem = [
    {
        value: '/app',
        label: 'app',
        children: [
            {
                value: '/app/Http',
                label: 'Http',
                children: [
                    {
                        value: '/app/Http/Controllers',
                        label: 'Controllers',
                        children: [{
                            value: '/app/Http/Controllers/WelcomeController.js',
                            label: 'WelcomeController.js',
                        }],
                    },
                    {
                        value: '/app/Http/routes.js',
                        label: 'routes.js',
                    },
                ],
            },
            {
                value: '/app/Providers',
                label: 'Providers',
                children: [{
                    value: '/app/Providers/EventServiceProvider.js',
                    label: 'EventServiceProvider.js',
                }],
            },
        ],
    },
    {
        value: '/config',
        label: 'config',
        children: [
            {
                value: '/config/app.js',
                label: 'app.js',
            },
            {
                value: '/config/database.js',
                label: 'database.js',
            },
        ],
    },
    {
        value: '/public',
        label: 'public',
        children: [
            {
                value: '/public/assets/',
                label: 'assets',
                children: [{
                    value: '/public/assets/style.css',
                    label: 'style.css',
                }],
            },
            {
                value: '/public/index.html',
                label: 'index.html',
            },
        ],
    },
    {
        value: '/.env',
        label: '.env',
    },
    {
        value: '/.gitignore',
        label: '.gitignore',
    },
    {
        value: '/README.md',
        label: 'README.md',
    },
];
const empires = [
    {
        value: 'favorite-empires',
        label: 'Favorite Empires',
        children: [
            {
                value: 'classical-era',
                label: 'Classical Era',
                children: [
                    {
                        value: 'persian',
                        label: 'First Persian Empire',
                    },
                    {
                        value: 'qin',
                        label: 'Qin Dynasty',
                    },
                    {
                        value: 'spqr',
                        label: 'Roman Empire',
                    },
                ],
            },
            {
                value: 'medieval-era',
                label: 'Medieval Era',
                children: [
                    {
                        value: 'abbasid',
                        label: 'Abbasid Caliphate',
                    },
                    {
                        value: 'byzantine',
                        label: 'Byzantine Empire',
                    },
                    {
                        value: 'holy-roman',
                        label: 'Holy Roman Empire',
                    },
                    {
                        value: 'ming',
                        label: 'Ming Dynasty',
                    },
                    {
                        value: 'mongol',
                        label: 'Mongol Empire',
                    },
                ],
            },
            {
                value: 'modern-era',
                label: 'Modern Era',
                children: [
                    {
                        value: 'aztec',
                        label: 'Aztec Empire',
                    },
                    {
                        value: 'british',
                        label: 'British Empire',
                    },
                    {
                        value: 'inca',
                        label: 'Inca Empire',
                    },
                    {
                        value: 'qing',
                        label: 'Qing Dynasty',
                    },
                    {
                        value: 'russian',
                        label: 'Russian Empire',
                    },
                    {
                        value: 'spanish',
                        label: 'Spanish Empire',
                    },
                ],
            },
        ],
    },
];

export {
    fileSystem,
    empires,
};
