import {
    CheckBadgeIcon,
    ArchiveBoxIcon,
    BeakerIcon,
    ShieldCheckIcon,
    BoltIcon,
    ChartBarIcon,
    SparklesIcon,
    FlagIcon,
    CurrencyDollarIcon,
    SunIcon,
    MoonIcon,
    CurrencyEuroIcon,
    BanknotesIcon,
    FireIcon,
    HeartIcon,
    MapIcon,
    MapPinIcon,
    LightBulbIcon,
    MegaphoneIcon,
    MusicalNoteIcon,
    StarIcon,
    TrophyIcon
} from '@heroicons/vue/24/solid'

import {
    Skull,
    Coins,
    Sword,
    Swords,
    BowArrow,
    Axe,
    HandCoins,
    Cog,
    Pickaxe,
    Sparkles as SparklesLucide,
    Sparkle,
    MirrorRound,
    Shield,
    CircleDollarSign,
    Banknote,
    Store,
    Box,
    Archive,
    Medal,
    Infinity,
    Pill,
    PillBottle,
    Drama,
    FlameKindling,
    Heart,
    Flame,
    Activity,
    BookOpenText

} from 'lucide-vue-next'

export const iconsCategories = [
    'weapons',
    'tools',
    'armor',
    'health',
    'magic',
    'storage',
    'currency',
    'status',
    'nature',
    'misc'
]

export const iconsCategoryLabels = {
    status: 'Статус',
    currency: 'Валюта',
    weapons: 'Зброя',
    health: "Здоров'я",
    tools: 'Інструменти',
    armor: 'Броня',
    magic: 'Магія',
    nature: 'Природа',
    storage: 'Сховище',
    misc: 'Інше'
}

export const iconsList = [
    // status / progression
    {
        id: 'checkBadge', icon: CheckBadgeIcon, category: 'status'
    },
    {
        id: 'chartBar', icon: ChartBarIcon, category: 'status'
    },
    {
        id: 'flag', icon: FlagIcon, category: 'status'
    },
    {
        id: 'heart', icon: HeartIcon, category: 'health'
    },
    {
        id: 'activity', icon: Activity, category: 'health'
    },
    {
        id: 'heartLucide', icon: Heart, category: 'health'
    },
    {
        id: 'pill', icon: Pill, category: 'health'
    },
    {
        id: 'pillBottle', icon: PillBottle, category: 'health'
    },
    {
        id: 'infinity', icon: Infinity, category: 'status'
    },

    // currency / economy
    {
        id: 'currencyDollar', icon: CurrencyDollarIcon, category: 'currency'
    },
    {
        id: 'currencyEuro', icon: CurrencyEuroIcon, category: 'currency'
    },
    {
        id: 'banknotes', icon: BanknotesIcon, category: 'currency'
    },
    {
        id: 'coins', icon: Coins, category: 'currency'
    },
    {
        id: 'handCoins', icon: HandCoins, category: 'currency'
    },
    {
        id: 'circleDollarSign', icon: CircleDollarSign, category: 'currency'
    },
    {
        id: 'banknote', icon: Banknote, category: 'currency'
    },

    // weapons
    {
        id: 'sword', icon: Sword, category: 'weapons'
    },
    {
        id: 'swords', icon: Swords, category: 'weapons'
    },
    {
        id: 'BowArrow', icon: BowArrow, category: 'weapons'
    },
    {
        id: 'axe', icon: Axe, category: 'weapons'
    },

    // tools
    {
        id: 'pickaxe', icon: Pickaxe, category: 'tools'
    },
    {
        id: 'cog', icon: Cog, category: 'tools'
    },

    // armor / protection
    {
        id: 'shieldCheck', icon: ShieldCheckIcon, category: 'armor'
    },
    {
        id: 'shield', icon: Shield, category: 'armor'
    },

    // magic / effects
    {
        id: 'beaker', icon: BeakerIcon, category: 'magic'
    },
    {
        id: 'bolt', icon: BoltIcon, category: 'magic'
    },
    {
        id: 'sparkles', icon: SparklesIcon, category: 'magic'
    },
    {
        id: 'sparklesLucide', icon: SparklesLucide, category: 'magic'
    },
    {
        id: 'sparkle', icon: Sparkle, category: 'magic'
    },
    {
        id: 'lightBulb', icon: LightBulbIcon, category: 'magic'
    },
    {
        id: 'mirrorRound', icon: MirrorRound, category: 'magic'
    },
    {
        id: 'bookopentext', icon: BookOpenText, category: 'magic'
    },

    // nature / world
    {
        id: 'sun', icon: SunIcon, category: 'nature'
    },
    {
        id: 'moon', icon: MoonIcon, category: 'nature'
    },
    {
        id: 'fire', icon: FireIcon, category: 'nature'
    },
    {
        id: 'flame', icon: Flame, category: 'nature'
    },
    {
        id: 'flameKindling', icon: FlameKindling, category: 'nature'
    },
    {
        id: 'map', icon: MapIcon, category: 'misc'
    },
    {
        id: 'mapPin', icon: MapPinIcon, category: 'misc'
    },

    // storage / inventory
    {
        id: 'archiveBox', icon: ArchiveBoxIcon, category: 'storage'
    },
    {
        id: 'box', icon: Box, category: 'storage'
    },
    {
        id: 'archive', icon: Archive, category: 'storage'
    },
    {
        id: 'store', icon: Store, category: 'storage'
    },

    // misc
    {
        id: 'musicalNote', icon: MusicalNoteIcon, category: 'misc'
    },
    {
        id: 'megaphone', icon: MegaphoneIcon, category: 'misc'
    },
    {
        id: 'skull', icon: Skull, category: 'misc'
    },
    {
        id: 'drama', icon: Drama, category: 'misc'
    },
    {
        id: 'star', icon: StarIcon, category: 'misc'
    },
    {
        id: 'trophy', icon: TrophyIcon, category: 'misc'
    },
    {
        id: 'medal', icon: Medal, category: 'misc'
    },
]

export function returnIcon(name) {
    return iconsList.find(icon => icon.id === name)
}