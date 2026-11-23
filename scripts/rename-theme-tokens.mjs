#!/usr/bin/env node
// Codemod: darkred.* -> brand.* (re-themeable chrome) and
//          greenish.*/orange.* -> state.* (fixed-meaning status colors).
// See proposal in chat for rationale.
// Usage:
//   node scripts/rename-theme-tokens.mjs            # dry run, prints a per-file diff count
//   node scripts/rename-theme-tokens.mjs --apply    # actually rewrites files
import { readFileSync, writeFileSync } from 'node:fs'
import { glob } from 'node:fs/promises' // Node 22+; use a tiny manual walk if older

const APPLY = process.argv.includes('--apply')

// Each palette migration: old Tailwind namespace -> new namespace, with a
// per-raw-color-key map of { utility: newRole }. 'default' covers any
// utility prefix not explicitly listed. A color key with no real usage
// (e.g. orange.red, orange.dark) is simply omitted - nothing to rename.
const PALETTES = [
    {
        oldNamespace: 'darkred',
        newNamespace: 'brand',
        colors: {
            dark: { default: 'base', text: 'ink', placeholder: 'ink', ring: 'ink', fill: 'ink' },
            dark_gray: { default: 'surface' },
            gray: { default: 'muted' },
            light_gray: { default: 'subtle', text: 'faint', stroke: 'faint' },
            red: { default: 'accent' },
            bright: { default: 'accent-hover' },
            brown: { default: 'accent-secondary' },
            light: { default: 'surface-inverted', text: 'text' }
        }
    },
    {
        // Fixed-meaning status colors - NOT CSS-var/session-themeable, unlike
        // brand.*. "success" should always read as green, "warning" as
        // orange, regardless of which session theme preset is active.
        oldNamespace: 'greenish',
        newNamespace: 'state',
        colors: {
            dark: { default: 'success' },
            mid: { default: 'success-accent' },
            light: { default: 'success-hover' }
            // pale: unused today - kept as a reserved `state.success-surface`
            // slot in tailwind.config.js, no rename needed since nothing uses it yet.
        }
    },
    {
        oldNamespace: 'orange',
        newNamespace: 'state',
        colors: {
            gold: { default: 'new' },
            orange: { default: 'warning' }
            // red/dark: unused today, redundant with brand.accent - dropped, not migrated.
        }
    }
]

// Tailwind utility prefixes this codebase uses with these palettes, longest
// first so e.g. "border-l-" is tried before "border-".
const PREFIXES = [
    'border-l-', 'border-', 'bg-', 'text-', 'ring-', 'outline-',
    'placeholder-', 'from-', 'via-', 'to-', 'stroke-', 'fill-'
]

function roleFor(colorEntry, prefix) {
    const utility = prefix.replace(/-$/, '') // 'bg', 'text', 'border-l', ...
    if (utility === 'border-l') return colorEntry.default
    return colorEntry[utility] ?? colorEntry.default
}

// Build exact old-class -> new-class pairs, longest old string first (prevents
// e.g. "darkred-dark" from clobbering "darkred-dark_gray" when both exist).
const REPLACEMENTS = []
for (const { oldNamespace, newNamespace, colors } of PALETTES) {
    for (const prefix of PREFIXES) {
        for (const [colorKey, entry] of Object.entries(colors)) {
            const role = roleFor(entry, prefix)
            REPLACEMENTS.push([`${prefix}${oldNamespace}-${colorKey}`, `${prefix}${newNamespace}-${role}`])
        }
    }
}
REPLACEMENTS.sort((a, b) => b[0].length - a[0].length)

function escapeRegex(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const FILE_GLOBS = ['src/**/*.vue', 'src/**/*.js']

async function collectFiles() {
    const files = []
    for (const pattern of FILE_GLOBS) {
        for await (const file of glob(pattern)) files.push(file)
    }
    return files
}

async function run() {
    const files = await collectFiles()
    let totalChanges = 0
    const touched = []

    for (const file of files) {
        const original = readFileSync(file, 'utf8')
        let content = original

        for (const [oldClass, newClass] of REPLACEMENTS) {
            const re = new RegExp(`(?<![\\w-])${escapeRegex(oldClass)}(?![\\w-])`, 'g')
            content = content.replace(re, () => {
                totalChanges++
                return newClass
            })
        }

        if (content !== original) {
            touched.push(file)
            if (APPLY) writeFileSync(file, content, 'utf8')
        }
    }

    console.log(`${APPLY ? 'Applied' : 'Would change'} ${totalChanges} occurrences across ${touched.length} files.`)
    if (!APPLY) {
        console.log('Re-run with --apply to write changes.')
        touched.forEach(f => console.log('  -', f))
    }
}

run()
