export const THEME_PRESETS = [
    {
        id: 'sunlit-parchment',
        name: 'Sunlit Parchment',
        colors: {
            page: '#F5F1E8',
            base: '#EDE4D3',
            ink: '#3B2F2F',
            surface: '#FFFFFF',
            muted: '#A89F91',
            subtle: '#D8CDBB',
            faint: '#D8CDBB',
            accent: '#B5651D',
            accentHover: '#D97D33',
            text: '#000000',
            surfaceInverted: '#FFFFFF',
            accentSecondary: '#6B4226'
        }
    },
    {
        id: 'golden-meadow',
        name: 'Golden Meadow',
        colors: {
            page: '#FFFBEA',
            base: '#FDF1C7',
            ink: '#3A2E0F',
            surface: '#FFFFFF',
            muted: '#A89B6E',
            subtle: '#E8DCA0',
            faint: '#E8DCA0',
            accent: '#D4A017',
            accentHover: '#F0B90B',
            text: '#3A2E0F',
            surfaceInverted: '#FFFFFF',
            accentSecondary: '#8B6914'
        }
    },
    {
        id: 'crimson-keep',
        name: 'Crimson Keep',
        colors: {
            page: '#0D0D0D',
            base: '#1A1A1A',
            ink: '#1A1A1A',
            surface: '#262220',
            muted: '#8A8178',
            subtle: '#C9C2B8',
            faint: '#C9C2B8',
            accent: '#A61C1C',
            accentHover: '#E63946',
            text: '#F2E9E4',
            surfaceInverted: '#F2E9E4',
            accentSecondary: '#40201A'
        }
    },
    {
        id: 'obsidian-night',
        name: 'Obsidian Night',
        colors: {
            page: '#090B10',
            base: '#10141C',
            ink: '#10141C',
            surface: '#1A212C',
            muted: '#58697A',
            subtle: '#93A6B8',
            faint: '#93A6B8',
            accent: '#2F81D6',
            accentHover: '#5AA9F2',
            text: '#E4ECF2',
            surfaceInverted: '#E4ECF2',
            accentSecondary: '#1C2A3A'
        }
    },
    {

        id: 'volcanic-ash',
        name: 'Volcanic Ash',
        colors: {
            page: '#111113',
            base: '#1C1C1F',
            ink: '#1C1C1F',
            surface: '#2B2B2F',
            muted: '#84848C',
            subtle: '#BFBFC7',
            faint: '#BFBFC7',
            accent: '#F2650C',
            accentHover: '#FF8533',
            text: '#EDEDF0',
            surfaceInverted: '#EDEDF0',
            accentSecondary: '#3A2416'
        }
    },
]

export function findPresetById(id) {
    return THEME_PRESETS.find(preset => preset.id === id)
}
