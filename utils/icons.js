import { CheckBadgeIcon, ArchiveBoxIcon, BeakerIcon, ShieldCheckIcon, BoltIcon, ChartBarIcon, SparklesIcon, FlagIcon, CurrencyDollarIcon, SunIcon, MoonIcon, CurrencyEuroIcon, BanknotesIcon, FireIcon, HeartIcon, MapIcon, MapPinIcon, LightBulbIcon, MegaphoneIcon, MusicalNoteIcon, StarIcon, TrophyIcon } from '@heroicons/vue/24/solid'

export const iconsList = [
    {
        id: 'checkBadge', icon: CheckBadgeIcon,
    },
    {
        id: 'archiveBox', icon: ArchiveBoxIcon
    },
    {
        id: 'beaker', icon: BeakerIcon
    },
    {
        id: 'shieldCheck', icon: ShieldCheckIcon
    },
    {
        id: 'bolt', icon: BoltIcon
    },
    {
        id: 'chartBar', icon: ChartBarIcon
    },
    {
        id: 'sparkles', icon: SparklesIcon
    },
    {
        id: 'flag', icon: FlagIcon
    },
    {
        id: 'currencyDollar', icon: CurrencyDollarIcon
    },
    {
        id: 'currencyEuro', icon: CurrencyEuroIcon
    },
    {
        id: 'banknotes', icon: BanknotesIcon
    },
    {
        id: 'sun', icon: SunIcon
    },
    {
        id: 'moon', icon: MoonIcon
    },
    {
        id: 'fire', icon: FireIcon
    },
    {
        id: 'heart', icon: HeartIcon
    },
    {
        id: 'map', icon: MapIcon
    },
    {
        id: 'mapPin', icon: MapPinIcon
    },
    {
        id: 'lightBulb', icon: LightBulbIcon
    },
    {
        id: 'musicalNote', icon: MusicalNoteIcon
    },
    {
        id: 'megaphone', icon: MegaphoneIcon
    },
    {
        id: 'star', icon: StarIcon
    },
    {
        id: 'trophy', icon: TrophyIcon
    }
]

export function returnIcon(name) {
    return iconsList.find(icon => icon.id === name)
}