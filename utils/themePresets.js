export const THEME_PRESETS = [
    {
        id: 'crimson-keep',
        name: 'Crimson Keep',
        colors: {
            page: '#ffffff',
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
            text: '#ffffff',
            surfaceInverted: '#FFFFFF',
            accentSecondary: '#6B4226'
        }
    },
    {
        id: 'ember-forge',
        name: 'Ember Forge',
        colors: {
            page: '#0A0A0A',
            base: '#141414',
            ink: '#141414',
            surface: '#1F1B16',
            muted: '#8C8176',
            subtle: '#C9BFAE',
            faint: '#C9BFAE',
            accent: '#E8871E',
            accentHover: '#FFA94D',
            text: '#F4ECD8',
            surfaceInverted: '#F4ECD8',
            accentSecondary: '#4A2E12'
        }
    }
]

export function findPresetById(id) {
    return THEME_PRESETS.find(preset => preset.id === id)
}
