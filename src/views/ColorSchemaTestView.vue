<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import { CheckBadgeIcon } from '@heroicons/vue/24/solid';

import { useSessionStore } from '@/stores/sessionStore';
import Navigation from '@/components/navigations/Navigation.vue';

import Header1 from '@/components/reusable/Titles/Header1.vue';
import Header2 from '@/components/reusable/Titles/Header2.vue';

import AddButton from '@/components/reusable/Buttons/AddButton.vue';
import ApproveButton from '@/components/reusable/Buttons/ApproveButton.vue';
import DeleteButton from '@/components/reusable/Buttons/DeleteButton.vue';
import PlusButton from '@/components/reusable/Buttons/PlusButton.vue';
import CloseButtonBackground from '@/components/reusable/Buttons/CloseButtonBackground.vue';
import CloseButtonGrayNoBG from '@/components/reusable/Buttons/CloseButtonGrayNoBG.vue';
import ModalOpenButton from '@/components/reusable/Buttons/ModalOpenButton.vue';
import SelectorButton from '@/components/reusable/Buttons/SelectorButton.vue';
import PillSelectorButton from '@/components/reusable/Buttons/PillSelectorButton.vue';
import ButtonGrayAnimated from '@/components/reusable/Buttons/ButtonGrayAnimated.vue';
import HideButton from '@/components/reusable/Buttons/HideButton.vue';
import ButtonHideFunction from '@/components/reusable/Buttons/ButtonHideFunction.vue';
import AprroveButtonWithText from '@/components/reusable/Buttons/AprroveButtonWithText.vue';
import RejectButtonWithText from '@/components/reusable/Buttons/RejectButtonWithText.vue';
import RadioSelector from '@/components/reusable/Buttons/Radios/RadioSelector.vue';

import InputName from '@/components/reusable/Inputs/InputName.vue';
import InputPassword from '@/components/reusable/Inputs/InputPassword.vue';
import InputTextReactive from '@/components/reusable/Inputs/InputTextReactive.vue';
import TextAreaReactive from '@/components/reusable/Inputs/TextAreaReactive.vue';
import TextAreaEditor from '@/components/reusable/TextAreaEditor.vue';
import SearchInputBlack from '@/components/reusable/SearchInputs/SearchInputBlack.vue';
import ImportantField from '@/components/reusable/ImportantField.vue';

import DropDownChoosen from '@/components/reusable/DropDowns/DropDownChoosen.vue';
import DropDownList from '@/components/reusable/DropDowns/DropDownList.vue';
import DropDownPerks from '@/components/reusable/DropDowns/DropDownPerks.vue';
import IconsDropdown from '@/components/reusable/DropDowns/IconsDropdown.vue';

import ArraySingleStringForm from '@/components/reusable/Forms/ArraySingleStringForm.vue';
import ArrayStringFormWIcons from '@/components/reusable/Forms/ArrayStringFormWIcons.vue';
import ArrayStringFromWColorPicker from '@/components/reusable/Forms/ArrayStringFromWColorPicker.vue';
import ThemeEditor from '@/components/reusable/Forms/ThemeEditor.vue';
import CustomFieldsEditor from '@/components/reusable/CustomFieldsEditor.vue';
import CustomFieldTile from '@/components/reusable/CustomFieldTile.vue';
import FormAddSubtract from '@/components/reusable/FormAddSubtract.vue';
import FormString from '@/components/reusable/FormString.vue';
import SingleFieldValueSelector from '@/components/reusable/SingleFieldValueSelector.vue';
import HorizontalNumberPicker from '@/components/reusable/HorizontalNumberPicker.vue';
import VerticalNumberPicker from '@/components/reusable/VerticalNumberPicker.vue';
import ProgressiveBar from '@/components/reusable/ProgressiveBar.vue';

import CharacterCard from '@/components/reusable/CharacterCard.vue';
import SessionCard from '@/components/reusable/SessionCard.vue';
import ImageEditor from '@/components/reusable/ImageEditor.vue';
import ImageEditorCompact from '@/components/reusable/ImageEditorCompact.vue';

import CardsLoader from '@/components/reusable/Loaders/CardsLoader.vue';
import DiceLoader from '@/components/reusable/Loaders/DiceLoader.vue';
import RevolverLoader from '@/components/reusable/Loaders/RevolverLoader.vue';

import UnsavedLabel from '@/components/reusable/UnsavedLabel.vue';

import { THEME_PRESETS } from '@utils/themePresets';

// Opened from an admin session's nav (MasterPageNavigation passes ?sessionId=)
// loads that session's real theme here directly, since AdminGenericView
// unmounting on navigation would otherwise clear it back to the app
// shell default before this page ever rendered.
const sessionId = useRoute().query.sessionId
const sessionStore = useSessionStore()

onMounted(() => {
    if (sessionId) sessionStore.loadSession(sessionId)
})

onBeforeUnmount(() => {
    if (sessionId) sessionStore.CloseWebsocketSession(sessionId)
})

const noop = () => {}

const graySelectorActive = ref(true)
const pillSelectorActive = ref(true)
const hideButtonHidden = ref(true)
const radioSelected = ref('a')
const radios = [{ id: 'a', label: 'Варіант А' }, { id: 'b', label: 'Варіант Б' }]

const nameValue = ref('')
const passValue = ref('')
const reactiveText = ref('')
const reactiveArea = ref('')
const editorAreaValue = ref('Текст для редагування')
const searchValue = ref('')

const dropdownChoices = [{ id: '1', name: 'Перший' }, { id: '2', name: 'Другий' }]
const dropdownChoosenValue = ref('1')
const dropdownListValue = ref('1')
const dropdownPerks = [{ id: '1', name: 'Перк А' }, { id: '2', name: 'Перк Б' }]
const dropdownPerkValue = ref(dropdownPerks[0])

const singleStringArray = ref([{ id: '1', name: 'Елемент' }])
const stringWithIconsArray = ref([{ id: '1', name: 'Елемент', icon: 'checkBadge' }])
const colorPickerArray = ref([{ id: '1', name: 'Тип', color: '#A61C1C' }])

const themeLocal = ref({
    presetId: THEME_PRESETS[0].id,
    colors: { ...THEME_PRESETS[0].colors },
    faviconUrl: ''
})

const customFields = ref([{ id: '1', name: 'Поле', value: '10', description: 'Опис поля' }])

const addSubtractValue = ref(5)
const formStringValue = ref('Значення')
const numberPickerValue = ref(10)
const verticalPickerValue = ref(0)

const favicon = ref('')
const favicon2 = ref('')

const mockCharacter = {
    id: 'test',
    name: 'Тестовий Персонаж',
    image: '',
    level: 3,
    experience: 40,
    experienceToLevelUp: 100,
    health: [{ id: 'h1', name: "Здоров'я", value: 18, max: 25 }],
    characteristics: { Сила: 12, Спритність: 14 }
}
</script>

<template>
    <Navigation />

    <div class="flex flex-col gap-6 p-6 max-w-4xl mx-auto font-gothic">

        <Header1 label="Тест кольорової схеми" />
        <p class="text-sm text-brand-faint -mt-4">Шляхи відносні до src/components/reusable/</p>

        <div class="grid grid-cols-[minmax(200px,280px)_1fr] items-center gap-x-6 gap-y-6">

            <div class="col-span-2"><Header2 label="Заголовки" /></div>
            <span class="font-mono text-xs text-brand-faint break-all">Titles/Header1.vue</span>
            <div><Header1 label="Header1" /></div>
            <span class="font-mono text-xs text-brand-faint break-all">Titles/Header2.vue</span>
            <div><Header2 label="Header2" /></div>

            <div class="col-span-2"><Header2 label="Кнопки" /></div>
            <span class="font-mono text-xs text-brand-faint break-all">Buttons/AddButton.vue</span>
            <div class="flex items-center gap-3"><AddButton class="w-11 h-11" /></div>
            <span class="font-mono text-xs text-brand-faint break-all">Buttons/ApproveButton.vue</span>
            <div class="flex items-center gap-3"><ApproveButton class="w-11 h-11" /></div>
            <span class="font-mono text-xs text-brand-faint break-all">Buttons/DeleteButton.vue</span>
            <div class="flex items-center gap-3"><DeleteButton /></div>
            <span class="font-mono text-xs text-brand-faint break-all">Buttons/PlusButton.vue</span>
            <div class="flex items-center gap-3"><PlusButton class="w-11 h-11" /></div>
            <span class="font-mono text-xs text-brand-faint break-all">Buttons/CloseButtonBackground.vue</span>
            <div class="relative h-12 w-40 border-2 border-brand-subtle rounded-lg"><CloseButtonBackground /></div>
            <span class="font-mono text-xs text-brand-faint break-all">Buttons/CloseButtonGrayNoBG.vue</span>
            <div class="relative h-12 w-40 border-2 border-brand-subtle rounded-lg"><CloseButtonGrayNoBG /></div>
            <span class="font-mono text-xs text-brand-faint break-all">Buttons/ModalOpenButton.vue</span>
            <div><ModalOpenButton text="Відкрити модалку" /></div>
            <span class="font-mono text-xs text-brand-faint break-all">Buttons/SelectorButton.vue</span>
            <div class="flex gap-2">
                <SelectorButton id="gsb-1" label="Активна" :active="graySelectorActive" @click="graySelectorActive = !graySelectorActive" />
                <SelectorButton id="gsb-2" label="Неактивна" :active="false" />
            </div>
            <span class="font-mono text-xs text-brand-faint break-all">Buttons/PillSelectorButton.vue</span>
            <div class="flex gap-2">
                <PillSelectorButton id="psb-1" label="Активна" :active="pillSelectorActive" @click="pillSelectorActive = !pillSelectorActive" />
                <PillSelectorButton id="psb-2" label="Неактивна" :active="false" />
            </div>
            <span class="font-mono text-xs text-brand-faint break-all">Buttons/ButtonGrayAnimated.vue</span>
            <div><ButtonGrayAnimated title="Анімована кнопка" /></div>
            <span class="font-mono text-xs text-brand-faint break-all">Buttons/HideButton.vue</span>
            <div><HideButton :hidden="hideButtonHidden" :main-icon="CheckBadgeIcon" @click="hideButtonHidden = !hideButtonHidden" /></div>
            <span class="font-mono text-xs text-brand-faint break-all">Buttons/ButtonHideFunction.vue</span>
            <div><ButtonHideFunction text="Перемкнути" main-icon="checkBadge" :hidden="hideButtonHidden" /></div>
            <span class="font-mono text-xs text-brand-faint break-all">Buttons/AprroveButtonWithText.vue</span>
            <div><AprroveButtonWithText text="Зберегти" /></div>
            <span class="font-mono text-xs text-brand-faint break-all">Buttons/RejectButtonWithText.vue</span>
            <div><RejectButtonWithText text="Відмінити" /></div>
            <span class="font-mono text-xs text-brand-faint break-all">Buttons/Radios/RadioSelector.vue</span>
            <div><RadioSelector :radios="radios" v-model="radioSelected" /></div>

            <div class="col-span-2"><Header2 label="Поля вводу" /></div>
            <span class="font-mono text-xs text-brand-faint break-all">Inputs/InputName.vue</span>
            <div><InputName v-model:nameString="nameValue" /></div>
            <span class="font-mono text-xs text-brand-faint break-all">Inputs/InputPassword.vue</span>
            <div><InputPassword v-model:passString="passValue" /></div>
            <span class="font-mono text-xs text-brand-faint break-all">Inputs/InputTextReactive.vue</span>
            <div><InputTextReactive field-name="test-field" label="Текстове поле" v-model:inputValue="reactiveText" /></div>
            <span class="font-mono text-xs text-brand-faint break-all">Inputs/TextAreaReactive.vue</span>
            <div><TextAreaReactive label="Текстова область" v-model:value="reactiveArea" /></div>
            <span class="font-mono text-xs text-brand-faint break-all">TextAreaEditor.vue</span>
            <div><TextAreaEditor field-name="editor-field" name="Поле редактора" :value="editorAreaValue" :callback="noop" /></div>
            <span class="font-mono text-xs text-brand-faint break-all">SearchInputs/SearchInputBlack.vue</span>
            <div><SearchInputBlack v-model:searchQuery="searchValue" /></div>
            <span class="font-mono text-xs text-brand-faint break-all">ImportantField.vue</span>
            <div>Обов'язкове поле <ImportantField /></div>

            <div class="col-span-2"><Header2 label="Випадаючі списки" /></div>
            <span class="font-mono text-xs text-brand-faint break-all">DropDowns/DropDownChoosen.vue</span>
            <div><DropDownChoosen label="Вибір" entity_name="choosen-test" :entity_array="dropdownChoices" v-model:selected="dropdownChoosenValue" /></div>
            <span class="font-mono text-xs text-brand-faint break-all">DropDowns/DropDownList.vue</span>
            <div><DropDownList label="Список" entity_name="list-test" :entity_array="dropdownChoices" v-model:selected="dropdownListValue" /></div>
            <span class="font-mono text-xs text-brand-faint break-all">DropDowns/DropDownPerks.vue</span>
            <div><DropDownPerks label="Перки" entity_name="perks-test" :entity_array="dropdownPerks" v-model:selected="dropdownPerkValue" /></div>
            <span class="font-mono text-xs text-brand-faint break-all">DropDowns/IconsDropdown.vue</span>
            <div><IconsDropdown field_id="icon-test" :callback="noop" /></div>

            <div class="col-span-2"><Header2 label="Форми-списки" /></div>
            <span class="font-mono text-xs text-brand-faint break-all">Forms/ArraySingleStringForm.vue</span>
            <div><ArraySingleStringForm label="Простий список" v-model:array="singleStringArray" /></div>
            <span class="font-mono text-xs text-brand-faint break-all">Forms/ArrayStringFormWIcons.vue</span>
            <div><ArrayStringFormWIcons label="Список з іконками" :set-icon="true" v-model:array="stringWithIconsArray" /></div>
            <span class="font-mono text-xs text-brand-faint break-all">Forms/ArrayStringFromWColorPicker.vue</span>
            <div><ArrayStringFromWColorPicker label="Список з кольорами" v-model:array="colorPickerArray" /></div>
            <span class="font-mono text-xs text-brand-faint break-all">Forms/ThemeEditor.vue</span>
            <div><ThemeEditor v-model:theme="themeLocal" /></div>
            <span class="font-mono text-xs text-brand-faint break-all">CustomFieldsEditor.vue</span>
            <div><CustomFieldsEditor name="customFields" :callback="noop" /></div>
            <span class="font-mono text-xs text-brand-faint break-all">CustomFieldTile.vue</span>
            <div><CustomFieldTile v-model:fields="customFields" /></div>
            <span class="font-mono text-xs text-brand-faint break-all">FormAddSubtract.vue</span>
            <div><FormAddSubtract entity_name="Значення" :value="addSubtractValue" :callback="noop" /></div>
            <span class="font-mono text-xs text-brand-faint break-all">FormString.vue</span>
            <div><FormString entity_name="Назва" :value="formStringValue" :callback="noop" /></div>
            <span class="font-mono text-xs text-brand-faint break-all">SingleFieldValueSelector.vue</span>
            <div><SingleFieldValueSelector field_name="rarity" label="Рідкість" :callback="noop" /></div>
            <span class="font-mono text-xs text-brand-faint break-all">HorizontalNumberPicker.vue</span>
            <div><HorizontalNumberPicker title="Шкала" :value="numberPickerValue" :min="0" :max="20" /></div>
            <span class="font-mono text-xs text-brand-faint break-all">VerticalNumberPicker.vue</span>
            <div><VerticalNumberPicker :max-num="20" :min-num="0" v-model="verticalPickerValue" /></div>
            <span class="font-mono text-xs text-brand-faint break-all">ProgressiveBar.vue</span>
            <div><ProgressiveBar :value="18" :value-max="25" text="Здоров'я" /></div>

            <div class="col-span-2"><Header2 label="Картки" /></div>
            <span class="font-mono text-xs text-brand-faint break-all">CharacterCard.vue</span>
            <div><CharacterCard :character="mockCharacter" :routing="false" /></div>
            <span class="font-mono text-xs text-brand-faint break-all">SessionCard.vue</span>
            <div><SessionCard id="test" name="Тестова сесія" image="" /></div>
            <span class="font-mono text-xs text-brand-faint break-all">ImageEditor.vue</span>
            <div><ImageEditor label="Зображення" v-model:image="favicon" /></div>
            <span class="font-mono text-xs text-brand-faint break-all">ImageEditorCompact.vue</span>
            <div><ImageEditorCompact label="Favicon" v-model:image="favicon2" /></div>

            <div class="col-span-2"><Header2 label="Завантаження" /></div>
            <span class="font-mono text-xs text-brand-faint break-all">Loaders/CardsLoader.vue</span>
            <div><CardsLoader /></div>
            <span class="font-mono text-xs text-brand-faint break-all">Loaders/DiceLoader.vue</span>
            <div><DiceLoader /></div>
            <span class="font-mono text-xs text-brand-faint break-all">Loaders/RevolverLoader.vue</span>
            <div><RevolverLoader /></div>

            <div class="col-span-2"><Header2 label="Інше" /></div>
            <span class="font-mono text-xs text-brand-faint break-all">UnsavedLabel.vue</span>
            <div><UnsavedLabel /></div>

        </div>
    </div>
</template>
