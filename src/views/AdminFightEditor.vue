<script setup>
import { ref, computed, toRaw } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { useSessionStore } from '@/stores/sessionStore';
import { useFightStore } from '@/stores/fightStore';
import { notify } from '@utils/notification';
import { toNewFight, toNewFightEnemy, toObject } from '@utils/objects.dto';
import { buildTiles } from '@utils/tileGraph';
import useEntityEditor from '@utils/useEntityEditor';

import MasterPageNavigation from '@/components/navigations/MasterPageNavigation.vue';
import Header1 from '@/components/reusable/Titles/Header1.vue';
import Header2 from '@/components/reusable/Titles/Header2.vue';
import GraySelectorButton from '@/components/reusable/Buttons/GraySelectorButton.vue';
import AprroveButtonWithText from '@/components/reusable/Buttons/AprroveButtonWithText.vue';
import RejectButtonWithText from '@/components/reusable/Buttons/RejectButtonWithText.vue';
import UnsavedLabel from '@/components/reusable/UnsavedLabel.vue';
import InputTextReactive from '@/components/reusable/Inputs/InputTextReactive.vue';
import TextAreaReactive from '@/components/reusable/Inputs/TextAreaReactive.vue';
import ImageEditor from '@/components/reusable/ImageEditor.vue';
import DeleteButton from '@/components/reusable/Buttons/DeleteButton.vue';
import PlusButton from '@/components/reusable/Buttons/PlusButton.vue';
import HealthFieldsEditor from '@/components/admin-page components/HealthFieldsEditor.vue';
import FightTile from '@/components/admin-page components/Cards/FightTile.vue';
import BattleMap from '@/components/fight-page components/BattleMap.vue';
import SearchInputBlack from '@/components/reusable/SearchInputs/SearchInputBlack.vue';

const route = useRoute();
const router = useRouter();
const sessionId = route.params.sessionId;

const sessionStore = useSessionStore();
const fightStore = useFightStore();

const activeTab = ref('base');
const fights = ref([]);
const isLoading = ref(true);
const editingEnemyId = ref(null);
const editingTileId = ref(null);
const newCharacteristic = ref({ name: '', value: '' });
const perkSearch = ref('');
const entitySearch = ref('');

const tabs = [
    { id: 'base', label: 'Список боїв' },
    { id: 'edit', label: 'Налаштування бою' }
];

function buildNewFight() {
    return { session: sessionId, name: 'Новий бій' };
}

const {
    selected: selectedFight,
    unsavedChanges,
    markDirty,
    buildPatchOps,
    load: loadFight,
    select: selectFight,
    discardChanges
} = useEntityEditor({
    toNew: toNewFight,
    getSourceList: () => fights.value,
    buildNew: buildNewFight,
    afterSelect: (id) => {
        editingEnemyId.value = null;
        editingTileId.value = null;
        if (id !== 'new') activeTab.value = 'edit';
    }
});

async function fetchFights() {
    isLoading.value = true;
    const [res, err] = await fightStore.listFights();
    isLoading.value = false;
    if (err) return;
    fights.value = res.data;
}

fetchFights();

async function saveFight() {
    const fight = toRaw(selectedFight.value);

    if (fight.id === 'new') {
        // Reaching the edit tab doesn't strictly require having gone through
        // select('new')/buildNewFight() first (e.g. clicking the "Налаштування
        // бою" tab directly on first load just flips activeTab) - so `session`
        // isn't guaranteed to be populated on the draft. It's always correct
        // to stamp it here regardless of how the draft got built.
        fight.session = sessionId;
        const [res, err] = await fightStore.createFight(fight);
        if (err) return;
        await fetchFights();
        loadFight(res.data.id, res.data);
        activeTab.value = 'edit';
        return;
    }

    fightStore.adminUpdate(sessionId, fight.id, buildPatchOps());
    // The socket broadcast (fight:updateNotify) is the source of truth for
    // everyone else; locally we just trust the edit went through and clear
    // the dirty-field tracking so the "unsaved changes" banner goes away.
    notify({ message: 'Зміни надіслано', type: 'success' });
    loadFight(fight.id, fight);
    await fetchFights();
}

async function deleteFight() {
    const confirmDelete = confirm('Видалити цей бій?');
    if (!confirmDelete) return;

    const [, err] = await fightStore.deleteFightById(selectedFight.value.id);
    if (err) return;

    await fetchFights();
    loadFight('new');
    activeTab.value = 'base';
}

function toggleActive() {
    if (selectedFight.value.isActive) {
        fightStore.deactivate(sessionId, selectedFight.value.id);
    } else {
        fightStore.setActive(sessionId, selectedFight.value.id);
    }
    setTimeout(fetchFights, 300);
}

function openLiveView() {
    router.push(`/admin/${sessionId}/fight/${selectedFight.value.id}/live`);
}

// Overlay / tiles

function regenerateTiles() {
    selectedFight.value.tiles = buildTiles(toRaw(selectedFight.value.overlay), toRaw(selectedFight.value.tiles));
    markDirty('tiles');
    markDirty('overlay');
}

const editingTile = computed(() => selectedFight.value.tiles.find(t => t.id === editingTileId.value) ?? null);

function selectTile(tileId) {
    editingTileId.value = editingTileId.value === tileId ? null : tileId;
}

function applyTileWeight(value) {
    if (!editingTile.value) return;
    editingTile.value.weight = Math.max(0, Number(value) || 0);
    markDirty('tiles');
}

function toggleTileBlocked() {
    if (!editingTile.value) return;
    editingTile.value.blocked = !editingTile.value.blocked;
    markDirty('tiles');
}

// Enemies

function addEnemy() {
    const enemy = toNewFightEnemy();
    selectedFight.value.enemies.push(enemy);
    editingEnemyId.value = enemy.id;
    markDirty('enemies');
}

function removeEnemy(id) {
    const confirmRemove = confirm('Видалити ворога?');
    if (!confirmRemove) return;
    selectedFight.value.enemies = selectedFight.value.enemies.filter(e => e.id !== id);
    if (editingEnemyId.value === id) editingEnemyId.value = null;
    markDirty('enemies');
}

function toggleEnemyEditor(id) {
    editingEnemyId.value = editingEnemyId.value === id ? null : id;
}

const editingEnemy = computed(() => selectedFight.value.enemies.find(e => e.id === editingEnemyId.value) ?? null);

const filteredPerks = computed(() => {
    const query = perkSearch.value.trim().toLowerCase();
    const perks = sessionStore.session.perks ?? [];
    if (!query) return perks;
    return perks.filter(p => p.name?.toLowerCase().includes(query));
});

const filteredEntities = computed(() => {
    const query = entitySearch.value.trim().toLowerCase();
    const entities = sessionStore.session.entities ?? [];
    if (!query) return entities;
    return entities.filter(e => e.name?.toLowerCase().includes(query));
});

function addEnemyHealth(health) {
    if (!editingEnemy.value) return;
    const index = editingEnemy.value.health.findIndex(h => h.id === health.id);
    if (index !== -1) editingEnemy.value.health.splice(index, 1, health);
    else editingEnemy.value.health.push(health);
    markDirty('enemies');
}

function removeEnemyHealth(health) {
    if (!editingEnemy.value) return;
    editingEnemy.value.health = editingEnemy.value.health.filter(h => h.id !== health.id);
    markDirty('enemies');
}

function toggleEnemyPerk(id) {
    if (!editingEnemy.value) return;
    const list = editingEnemy.value.perks;
    const index = list.indexOf(id);
    if (index !== -1) list.splice(index, 1);
    else list.push(id);
    markDirty('enemies');
}

function toggleEnemyEntity(id) {
    if (!editingEnemy.value) return;
    const list = editingEnemy.value.entities;
    const index = list.indexOf(id);
    if (index !== -1) list.splice(index, 1);
    else list.push(id);
    markDirty('enemies');
}

function addEnemyStat() {
    if (!editingEnemy.value || !newCharacteristic.value.name) return;
    Object.assign(editingEnemy.value.stats, toObject(toRaw(newCharacteristic.value)));
    newCharacteristic.value = { name: '', value: '' };
    markDirty('enemies');
}

function removeEnemyStat(key) {
    if (!editingEnemy.value) return;
    delete editingEnemy.value.stats[key];
    markDirty('enemies');
}
</script>

<template>

    <MasterPageNavigation />

    <section v-if="!isLoading" class="p-2 grid grid-cols-[25%_1fr] gap-2 items-start justify-start overflow-hidden font-gothic">

        <section class="p-2 w-full h-full font-gothic overflow-y-auto space-y-2">

            <div class="w-full flex flex-col gap-2">
                <GraySelectorButton class="w-full" v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
                    :id="tab.id" :label="tab.label" :active="activeTab === tab.id" />
            </div>

            <div v-if="activeTab === 'edit'" class="w-full flex flex-col gap-2">
                <AprroveButtonWithText @click="saveFight" text="Зберегти зміни"
                    :class="[!unsavedChanges && 'pointer-events-none opacity-50']" class="w-full" />

                <RejectButtonWithText @click="discardChanges" text="Відмінити зміни"
                    :class="[!unsavedChanges && 'pointer-events-none opacity-50']" class="w-full" />

                <AprroveButtonWithText v-if="selectedFight.id !== 'new' && !selectedFight.isActive" @click="toggleActive"
                    text="Зробити активним" class="w-full" />
                <RejectButtonWithText v-if="selectedFight.id !== 'new' && selectedFight.isActive" @click="toggleActive"
                    text="Деактивувати" class="w-full" />

                <AprroveButtonWithText v-if="selectedFight.id !== 'new'" @click="openLiveView" text="Відкрити карту бою"
                    class="w-full" />

                <RejectButtonWithText v-if="selectedFight.id !== 'new'" @click="deleteFight" text="Видалити бій"
                    class="w-full" />

                <UnsavedLabel v-if="unsavedChanges" class="w-full" />
            </div>
        </section>

        <section v-if="activeTab === 'base'" class="space-y-2 h-full overflow-y-auto">

            <Header1 label="Бої сесії" class="text-center" />

            <div class="grid grid-cols-4 gap-4 p-2">
                <div @click="selectFight('new')"
                    :class="selectedFight.id === 'new' && 'outline outline-4 outline-offset-[-1px] outline-darkred-red'"
                    class="border-8 border-darkred-dark bg-darkred-dark rounded-2xl flex justify-center items-center hover:cursor-pointer">
                    <PlusButton class="w-20 text-darkred-light" />
                </div>

                <FightTile v-for="fight in fights" @click="selectFight(fight.id)" :key="fight.id"
                    :class="selectedFight.id === fight.id && 'outline outline-4 outline-offset-[-1px] outline-darkred-red'"
                    :fight="fight" />
            </div>
        </section>

        <section v-if="activeTab === 'edit'" class="h-full overflow-y-auto space-y-4">

            <section class="m-4 grid grid-cols-4 gap-2 items-start">

                <InputTextReactive class="col-span-3" placeholder="Назва бою" fieldName="FightName" type="text"
                    :important="true" v-model:inputValue="selectedFight.name" @update:inputValue="markDirty('name')" />

                <ImageEditor class="col-span-full" label="Фон карти" v-model:image="selectedFight.background.image"
                    @update:image="markDirty('background')" />
            </section>

            <section class="m-4 grid grid-cols-4 gap-2 items-start">
                <Header1 label="Оверлей руху" class="col-span-full" />

                <div class="col-span-full flex gap-2">
                    <GraySelectorButton id="grid" label="Квадрати" :active="selectedFight.overlay.type === 'grid'"
                        @click="selectedFight.overlay.type = 'grid'; markDirty('overlay')" />
                    <GraySelectorButton id="radial" label="Кругова зона" :active="selectedFight.overlay.type === 'radial'"
                        @click="selectedFight.overlay.type = 'radial'; markDirty('overlay')" />
                </div>

                <template v-if="selectedFight.overlay.type === 'grid'">
                    <InputTextReactive fieldName="GridCols" placeholder="Стовпці" type="number"
                        v-model:inputValue="selectedFight.overlay.grid.cols" @update:inputValue="markDirty('overlay')" />
                    <InputTextReactive fieldName="GridRows" placeholder="Рядки" type="number"
                        v-model:inputValue="selectedFight.overlay.grid.rows" @update:inputValue="markDirty('overlay')" />
                    <InputTextReactive fieldName="GridX" placeholder="Зсув X (%)" type="number"
                        v-model:inputValue="selectedFight.overlay.grid.x" @update:inputValue="markDirty('overlay')" />
                    <InputTextReactive fieldName="GridY" placeholder="Зсув Y (%)" type="number"
                        v-model:inputValue="selectedFight.overlay.grid.y" @update:inputValue="markDirty('overlay')" />
                    <InputTextReactive fieldName="GridW" placeholder="Ширина (%)" type="number"
                        v-model:inputValue="selectedFight.overlay.grid.w" @update:inputValue="markDirty('overlay')" />
                    <InputTextReactive fieldName="GridH" placeholder="Висота (%)" type="number"
                        v-model:inputValue="selectedFight.overlay.grid.h" @update:inputValue="markDirty('overlay')" />
                </template>

                <template v-else>
                    <InputTextReactive fieldName="RadialCx" placeholder="Центр X (%)" type="number"
                        v-model:inputValue="selectedFight.overlay.radial.cx" @update:inputValue="markDirty('overlay')" />
                    <InputTextReactive fieldName="RadialCy" placeholder="Центр Y (%)" type="number"
                        v-model:inputValue="selectedFight.overlay.radial.cy" @update:inputValue="markDirty('overlay')" />
                    <InputTextReactive fieldName="RadialRings" placeholder="Кільця" type="number"
                        v-model:inputValue="selectedFight.overlay.radial.rings" @update:inputValue="markDirty('overlay')" />
                    <InputTextReactive fieldName="RadialSectors" placeholder="Секторів у кільці" type="number"
                        v-model:inputValue="selectedFight.overlay.radial.sectorsPerRing" @update:inputValue="markDirty('overlay')" />
                    <InputTextReactive fieldName="RadialMaxRadius" placeholder="Радіус (%)" type="number"
                        v-model:inputValue="selectedFight.overlay.radial.maxRadius" @update:inputValue="markDirty('overlay')" />
                </template>

                <AprroveButtonWithText class="col-span-full" text="Згенерувати клітинки" @click="regenerateTiles" />

                <div class="col-span-full flex flex-wrap gap-1 p-2 rounded-xl border-2 border-darkred-light_gray max-h-64 overflow-y-auto auto-hide-scroll">
                    <button v-for="tile in selectedFight.tiles" :key="tile.id" @click="selectTile(tile.id)"
                        :class="[
                            tile.blocked ? 'bg-darkred-red text-darkred-light' : 'bg-darkred-dark_gray text-darkred-light',
                            editingTileId === tile.id && 'outline outline-2 outline-darkred-bright'
                        ]"
                        class="px-2 py-1 rounded text-xs md:hover:cursor-pointer">
                        {{ tile.id }} · {{ tile.weight }}
                    </button>
                    <div v-if="!selectedFight.tiles.length" class="text-sm text-darkred-light_gray">Клітинок ще немає - натисніть "Згенерувати клітинки"</div>
                </div>

                <div v-if="editingTile" class="col-span-full flex items-end gap-2 p-2 rounded-xl border-2 border-darkred-bright">
                    <InputTextReactive fieldName="TileWeight" placeholder="Вага клітинки" type="number"
                        :inputValue="editingTile.weight" @update:inputValue="applyTileWeight" />
                    <RejectButtonWithText :text="editingTile.blocked ? 'Розблокувати' : 'Заблокувати'" @click="toggleTileBlocked" class="h-12" />
                </div>

                <div class="col-span-full space-y-1">
                    <Header2 label="Попередній перегляд карти" />
                    <div class="text-xs text-darkred-light_gray">Клік по клітинці на карті = вибрати її нижче для редагування ваги</div>
                    <BattleMap :fight="selectedFight" :characters="sessionStore.session.characters"
                        :canMoveToken="() => false" :selectedTileId="editingTileId" @tile-click="selectTile" />
                </div>
            </section>

            <section class="m-4 grid grid-cols-3 gap-2 items-start">
                <Header1 label="Очки дій" class="col-span-full" />

                <div class="flex gap-2 col-span-full">
                    <GraySelectorButton id="ap-fixed" label="Фіксовано" :active="selectedFight.actionPoints.source === 'fixed'"
                        @click="selectedFight.actionPoints.source = 'fixed'; markDirty('actionPoints')" />
                    <GraySelectorButton id="ap-field" label="З характеристики персонажа" :active="selectedFight.actionPoints.source === 'characterField'"
                        @click="selectedFight.actionPoints.source = 'characterField'; markDirty('actionPoints')" />
                </div>

                <InputTextReactive fieldName="APFixed" placeholder="Кількість ОД" type="number"
                    v-model:inputValue="selectedFight.actionPoints.fixedAmount" @update:inputValue="markDirty('actionPoints')" />
                <InputTextReactive v-if="selectedFight.actionPoints.source === 'characterField'" fieldName="APField"
                    placeholder="Назва характеристики" type="text" v-model:inputValue="selectedFight.actionPoints.fieldName"
                    @update:inputValue="markDirty('actionPoints')" />

                <Header1 label="Вартість атаки" class="col-span-full" />

                <div class="flex gap-2 col-span-full">
                    <GraySelectorButton id="atk-fixed" label="Фіксовано" :active="selectedFight.attackCost.source === 'fixed'"
                        @click="selectedFight.attackCost.source = 'fixed'; markDirty('attackCost')" />
                    <GraySelectorButton id="atk-weapon" label="Зі зброї" :active="selectedFight.attackCost.source === 'activeWeapon'"
                        @click="selectedFight.attackCost.source = 'activeWeapon'; markDirty('attackCost')" />
                </div>

                <InputTextReactive fieldName="AttackFixed" placeholder="Вартість (ОД)" type="number"
                    v-model:inputValue="selectedFight.attackCost.fixedAmount" @update:inputValue="markDirty('attackCost')" />
                <InputTextReactive v-if="selectedFight.attackCost.source === 'activeWeapon'" fieldName="AttackField"
                    placeholder="Поле характеристики зброї (напр. apCost)" type="text"
                    v-model:inputValue="selectedFight.attackCost.fieldName" @update:inputValue="markDirty('attackCost')" />

                <InputTextReactive class="col-span-full" fieldName="DamageField" placeholder="Поле формули шкоди зброї (напр. damageDice)"
                    type="text" v-model:inputValue="selectedFight.weaponDamageFieldName" @update:inputValue="markDirty('weaponDamageFieldName')" />
            </section>

            <section class="m-4 space-y-2">
                <Header1 label="Вороги" />

                <div class="grid grid-cols-1 gap-2">
                    <div v-for="enemy in selectedFight.enemies" :key="enemy.id"
                        class="rounded-xl border-2 border-darkred-light_gray p-3 space-y-2">

                        <div class="flex items-center justify-between gap-2">
                            <span class="text-lg font-semibold md:hover:cursor-pointer" @click="toggleEnemyEditor(enemy.id)">
                                {{ enemy.name || 'Без імені' }}
                            </span>
                            <div class="flex items-center gap-2">
                                <label class="text-sm flex items-center gap-1">
                                    <input type="checkbox" v-model="enemy.visibleToPlayers" @change="markDirty('enemies')" />
                                    Видимий гравцям
                                </label>
                                <DeleteButton class="bg-darkred-red" @click="removeEnemy(enemy.id)" />
                            </div>
                        </div>

                        <template v-if="editingEnemyId === enemy.id">
                            <InputTextReactive fieldName="EnemyName" placeholder="Ім'я ворога" type="text"
                                v-model:inputValue="enemy.name" @update:inputValue="markDirty('enemies')" />

                            <ImageEditor label="Зображення ворога" v-model:image="enemy.image" @update:image="markDirty('enemies')" />

                            <TextAreaReactive label="Нотатки адміна (не бачать гравці)" v-model:value="enemy.notes"
                                @update:value="markDirty('enemies')" />

                            <div class="rounded-xl border-2 border-darkred-light_gray p-3 space-y-2">
                                <Header2 label="Характеристики" />
                                <div v-for="value, key in enemy.stats" :key="key"
                                    class="flex gap-3 items-center p-2 w-fit rounded-lg bg-darkred-dark text-darkred-light">
                                    <div>{{ key }}: {{ value }}</div>
                                    <DeleteButton class="bg-darkred-red" @click="removeEnemyStat(key)" />
                                </div>
                                <div class="grid grid-cols-2 gap-2">
                                    <InputTextReactive fieldName="EnemyStatName" placeholder="Назва" type="text"
                                        v-model:inputValue="newCharacteristic.name" />
                                    <InputTextReactive fieldName="EnemyStatValue" placeholder="Значення" type="text"
                                        v-model:inputValue="newCharacteristic.value" />
                                </div>
                                <AprroveButtonWithText text="Додати характеристику" @click="addEnemyStat" />
                            </div>

                            <div class="rounded-xl border-2 border-darkred-light_gray p-3 space-y-2">
                                <Header2 label="Здоров'я" />
                                <HealthFieldsEditor v-for="h in enemy.health" :key="h.id" :label="h.name"
                                    :health_field="h" :callback="addEnemyHealth" :callback_remove="removeEnemyHealth" />
                                <HealthFieldsEditor label="Нове поле здоров'я" :health_field="null" :callback="addEnemyHealth" />
                            </div>

                            <div class="grid grid-cols-2 gap-2">
                                <div class="rounded-xl border-2 border-darkred-light_gray p-3 space-y-1">
                                    <Header2 label="Перки" />
                                    <SearchInputBlack v-model:searchQuery="perkSearch" />
                                    <label v-for="perk in filteredPerks" :key="perk.id"
                                        class="flex items-center gap-2 text-sm">
                                        <input type="checkbox" :checked="enemy.perks.includes(perk.id)" @change="toggleEnemyPerk(perk.id)" />
                                        {{ perk.name }}
                                    </label>
                                    <div v-if="!filteredPerks.length" class="text-xs text-darkred-light_gray">Нічого не знайдено</div>
                                </div>
                                <div class="rounded-xl border-2 border-darkred-light_gray p-3 space-y-1">
                                    <Header2 label="Предмети (зброя тощо)" />
                                    <SearchInputBlack v-model:searchQuery="entitySearch" />
                                    <label v-for="entity in filteredEntities" :key="entity.id"
                                        class="flex items-center gap-2 text-sm">
                                        <input type="checkbox" :checked="enemy.entities.includes(entity.id)" @change="toggleEnemyEntity(entity.id)" />
                                        {{ entity.name }}
                                    </label>
                                    <div v-if="!filteredEntities.length" class="text-xs text-darkred-light_gray">Нічого не знайдено</div>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>

                <AprroveButtonWithText text="Додати ворога" @click="addEnemy" class="w-full" />
            </section>

        </section>
    </section>

    <div v-if="isLoading" class="text-center py-6">
        <Header1 label="Завантаження..." />
    </div>

</template>
