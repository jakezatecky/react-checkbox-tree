const empires = [
    {
        value: 'favorite-empires',
        label: 'Favorite Empires',
        expanded: true,
        children: [
            {
                value: 'classical-era',
                label: 'Classical Era',
                expanded: true,
                children: [
                    {
                        value: 'persian',
                        label: 'First Persian Empire',
                    },
                    {
                        value: 'qin',
                        label: 'Qin Dynasty',
                        checked: true,
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
                expanded: true,
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
                expanded: true,
                children: [
                    {
                        value: 'aztec',
                        label: 'Aztec Empire',
                        checked: true,
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
                        checked: true,
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

export default empires;
