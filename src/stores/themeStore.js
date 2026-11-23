import { defineStore } from 'pinia'
import { watch } from 'vue'

import { useSessionStore } from '@/stores/sessionStore'

const CSS_VAR_BY_COLOR_KEY = {
    page: '--brand-page', //bg
    base: '--brand-base', //
    ink: '--brand-ink', //
    surface: '--brand-surface', //
    muted: '--brand-muted', //
    subtle: '--brand-subtle', //
    faint: '--brand-faint', //
    accent: '--brand-accent', //
    accentHover: '--brand-accent-hover', //
    text: '--brand-text', //
    surfaceInverted: '--brand-surface-inverted', //
    accentSecondary: '--brand-accent-secondary' //
}

const DEFAULT_THEME = {
    colors: {
        page: '255 255 255',
        base: '26 26 26',
        ink: '26 26 26',
        surface: '38 34 32',
        muted: '138 129 120',
        subtle: '201 194 184',
        faint: '201 194 184',
        accent: '166 28 28',
        accentHover: '230 57 70',
        text: '242 233 228',
        surfaceInverted: '242 233 228',
        accentSecondary: '64 32 26'
    },
    headingFont: "'Rubik'",
    appName: 'DnD',
    faviconUrl: '/favicon.ico'
}

function hexToRgbTriplet(hex) {
    const match = hex?.trim().match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i)
    if (!match) return null
    const [, r, g, b] = match
    return `${parseInt(r, 16)} ${parseInt(g, 16)} ${parseInt(b, 16)}`
}

function setFavicon(href) {
    let link = document.querySelector("link[rel~='icon']")
    if (!link) {
        link = document.createElement('link')
        link.rel = 'icon'
        document.head.appendChild(link)
    }
    link.href = href
}

export const useThemeStore = defineStore('theme', () => {
    const sessionStore = useSessionStore()

    function applyTheme(theme = {}) {
        const root = document.documentElement.style
        const colors = { ...DEFAULT_THEME.colors, ...theme.colors }

        for (const [key, cssVar] of Object.entries(CSS_VAR_BY_COLOR_KEY)) {
            // admins may store either a hex picker value or an already-split triplet
            const value = colors[key]
            const triplet = value?.includes('#') ? hexToRgbTriplet(value) : value
            root.setProperty(cssVar, triplet || DEFAULT_THEME.colors[key])
        }

        root.setProperty('--brand-font-heading', theme.headingFont || DEFAULT_THEME.headingFont)
        document.title = theme.appName || DEFAULT_THEME.appName
        setFavicon(theme.faviconUrl || DEFAULT_THEME.faviconUrl)
    }

    function resetTheme() {
        applyTheme(DEFAULT_THEME)
    }

    // Re-skin whenever the active session changes - both the admin editor
    // and the player view load a session through sessionStore, so this is
    // the single hook point for both. Falls back to defaults once
    // session.value is cleared (e.g. navigating back to the sessions list).
    watch(
        () => sessionStore.session?.theme,
        (theme) => applyTheme(theme || DEFAULT_THEME),
        { immediate: true, deep: true }
    )

    return {
        DEFAULT_THEME,
        applyTheme,
        resetTheme
    }
})
