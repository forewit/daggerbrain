<!-- src/lib/DaggerSheet.svelte -->
<script lang="ts">
    import type { Character, TraitKey, Weapon, Gold } from "./types";
  
    // Props
    type Props = {
      char?: Character;
      name?: string;
    };
  
    // bindable props (runes-style)
    let {
      char = $bindable(),
      name = $bindable()
    }: Props = $props();
  
    // local state
    let localVariable = $state("");
    let editMode = $state(false);
  
    const traitKeys: TraitKey[] = ["agility", "strength", "finesse", "instinct", "presence", "knowledge"];
  
    function clamp(v: number, min = 0, max = 10) {
      return Math.max(min, Math.min(max, v));
    }
  
    function changeTrait(key: TraitKey, delta = 1) {
      if (!char) return;
      char.traits[key].value = clamp((char.traits[key].value ?? 0) + delta, 0, 10);
    }
  
    function adjustHP(delta: number) {
      if (!char) return;
      char.hp.current = clamp((char.hp.current ?? 0) + delta, 0, char.hp.max ?? 0);
    }
  
    function toggleHope(index: number) {
      if (!char) return;
      const cur = char.hope.current ?? 0;
      // toggle single hex behavior: clicking sets to that index+1 or decrease
      if (cur === index + 1) {
        char.hope.current = index;
      } else {
        char.hope.current = index + 1;
      }
    }
  
    function toggleProficiency(n: number) {
      if (!char) return;
      char.proficiency.circles = n;
    }
  
    function toggleEquip(weapon: Weapon | undefined) {
      if (!weapon) return;
      weapon.equipped = !weapon.equipped;
    }
  
    function incGold(part: keyof Gold, delta = 1) {
      if (!char) return;
      char.gold = char.gold ?? {};
      char.gold[part] = (char.gold[part] ?? 0) + delta;
      // simple total calculation — tweak to match your conversion rates
      char.gold.total = (char.gold.handfuls ?? 0) + (char.gold.bags ?? 0) * 10 + (char.gold.chest ?? 0) * 100;
    }
  
    // fallback default character so template can render even if parent doesn't pass one
    if (!char) {
      char = {
        name: name ?? "Unnamed",
        heritage: "",
        pronouns: "",
        className: "",
        subclass: "",
        level: 1,
        traits: {
          agility: { value: 2 }, strength: { value: 2 }, finesse: { value: 2 },
          instinct: { value: 2 }, presence: { value: 2 }, knowledge: { value: 2 }
        },
        hp: { max: 10, current: 10, minor: [false, false, false], major: [false, false], severe: [false] },
        hope: { max: 3, current: 0 },
        proficiency: { die: "d6", circles: 1 },
        weapons: { primary: { name: "", feature: "", trait: "", range: "", damage: "" }, inventory: [] },
        armor: { name: "", feature: "", baseThresholds: "", baseScore: 0 },
        gold: { handfuls: 0, bags: 0, chest: 0, total: 0 },
        experience: [],
        classFeature: ""
      };
    }
  </script>
  
  <!-- Tailwind-based layout -->
  <div class="max-w-5xl mx-auto p-4 bg-white rounded-lg shadow-md">
    <!-- header -->
    <header class="flex items-start justify-between gap-4 mb-4">
      <div class="flex-1">
        <input
          class="text-2xl font-extrabold w-full outline-none"
          placeholder="Character name"
          bind:value={char.name}
          aria-label="Character name"
        />
  
        <div class="flex items-center gap-3 text-sm text-slate-500 mt-1">
          <input class="border rounded px-2 py-1 text-sm" placeholder="Heritage" bind:value={char.heritage} />
          <input class="border rounded px-2 py-1 text-sm w-28" placeholder="Pronouns" bind:value={char.pronouns} />
          <div class="ml-2">
            <input class="border rounded px-2 py-1 text-sm w-36" placeholder="Class" bind:value={char.className} />
            <input class="border rounded px-2 py-1 text-sm w-28 mt-1" placeholder="Subclass" bind:value={char.subclass} />
          </div>
        </div>
  
        <div class="text-sm text-slate-400 mt-2">Level
          <input type="number" min="1" class="w-16 ml-2 border rounded px-2 py-1 inline" bind:value={char.level} />
        </div>
      </div>
  
      <div class="w-20 text-center bg-slate-50 rounded-md p-2 border">
        <div class="text-xs text-slate-500">Level</div>
        <div class="text-xl font-bold">{char.level}</div>
      </div>
    </header>
  
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <!-- left big column -->
      <div class="lg:col-span-2 space-y-4">
        <!-- traits -->
        <section class="bg-slate-50 p-4 rounded border">
          <div class="flex justify-between items-center mb-3">
            <div>
              <h3 class="font-semibold">Core Traits</h3>
              <p class="text-xs text-slate-500">Primary ability scores</p>
            </div>
            <button class="text-sm px-3 py-1 border rounded" onclick={() => editMode = !editMode}>{editMode ? "Done" : "Edit"}</button>
          </div>
  
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {#each traitKeys as tk}
              <div class="bg-white p-3 rounded border flex items-center justify-between">
                <div>
                  <div class="font-medium">{tk[0].toUpperCase() + tk.slice(1)}</div>
                  <div class="text-xs text-slate-400">{char.traits[tk].notes ?? ""}</div>
                </div>
  
                <div class="flex items-center gap-2">
                  <button class="px-2 py-1 border rounded" onclick={() => changeTrait(tk, -1)} aria-label={`decrease ${tk}`}>-</button>
                  <div class="w-8 text-center font-semibold">{char.traits[tk].value}</div>
                  <button class="px-2 py-1 border rounded" onclick={() => changeTrait(tk, +1)} aria-label={`increase ${tk}`}>+</button>
                </div>
              </div>
            {/each}
          </div>
        </section>
  
        <!-- health -->
        <section class="bg-white p-4 rounded border flex items-start justify-between">
          <div>
            <h4 class="font-semibold">Health & Damage</h4>
            <div class="text-sm text-slate-500">HP: <span class="font-bold">{char.hp.current}</span> / {char.hp.max}</div>
  
            <div class="mt-3 flex items-center gap-2">
              <button class="px-3 py-1 border rounded" onclick={() => adjustHP(-1)}>-1</button>
              <button class="px-3 py-1 border rounded" onclick={() => adjustHP(1)}>+1</button>
              <button class="px-3 py-1 border rounded" onclick={() => (char.hp.current = char.hp.max)}>Full</button>
            </div>
  
            <div class="mt-3 text-sm text-slate-500">Stress: <span class="font-medium text-slate-700">{char.hp.stress ?? 0}</span></div>
  
            <div class="mt-3 space-y-1">
              <div class="text-xs text-slate-500">Minor</div>
              <div class="flex gap-3">
                {#each char.hp.minor ?? [] as m, i}
                  <label class="inline-flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={m} onchange={(e) => char.hp.minor![i] = (e.currentTarget as HTMLInputElement).checked} />
                    <span>#{i + 1}</span>
                  </label>
                {/each}
              </div>
            </div>
          </div>
  
          <div class="text-right">
            <div class="text-xs text-slate-400">Damage markers</div>
            <div class="mt-3 text-sm">
              {#each char.hp.major ?? [] as mj, j}
                <label class="inline-flex items-center gap-2">
                  <input type="checkbox" checked={mj} onchange={(e) => char.hp.major![j] = (e.currentTarget as HTMLInputElement).checked} />
                  <span class="text-sm">Major {j + 1}</span>
                </label>
              {/each}
              <div class="mt-2">
                {#each char.hp.severe ?? [] as sv, k}
                  <label class="inline-flex items-center gap-2">
                    <input type="checkbox" checked={sv} onchange={(e) => char.hp.severe![k] = (e.currentTarget as HTMLInputElement).checked} />
                    <span class="text-sm">Severe {k + 1}</span>
                  </label>
                {/each}
              </div>
            </div>
          </div>
        </section>
  
        <!-- hope and class feature -->
        <section class="bg-slate-50 p-4 rounded border space-y-3">
          <div class="flex justify-between items-center">
            <div>
              <h4 class="font-semibold">Hope</h4>
              <p class="text-xs text-slate-500">Spendable resource</p>
            </div>
            <input class="border rounded px-2 py-1 text-sm" placeholder="Hope feature" bind:value={char.hope.feature} />
          </div>
  
          <div class="flex items-center gap-2">
            {#each Array(char.hope.max ?? 0) as _, i}
              <div
                class="w-6 h-6 rounded-sm flex items-center justify-center cursor-pointer border"
                class:on={(char.hope.current ?? 0) > i}
                onclick={() => toggleHope(i)}
                title={`Hope ${i+1}`}
                style={(char.hope.current ?? 0) > i ? "background-color: rgb(99 102 241); color: white;" : ""}
              >
                <!-- decorative -->
              </div>
            {/each}
            <div class="text-sm text-slate-500 ml-2">{char.hope.current}/{char.hope.max}</div>
          </div>
  
          <div>
            <h4 class="font-semibold">Class Feature</h4>
            <textarea class="w-full mt-2 p-2 border rounded" placeholder="Class feature..." bind:value={char.classFeature}></textarea>
          </div>
        </section>
      </div>
  
      <!-- right column -->
      <aside class="space-y-4">
        <!-- weapons -->
        <section class="bg-white p-4 rounded border space-y-3">
          <div class="flex justify-between items-center">
            <div>
              <h4 class="font-semibold">Weapons</h4>
              <p class="text-xs text-slate-500">Equipped & primary</p>
            </div>
          </div>
  
          {#if char.weapons?.primary}
            <div class="border rounded p-3 bg-slate-50 flex items-start justify-between">
              <div class="flex-1">
                <input class="font-medium w-full bg-transparent outline-none" placeholder="Primary weapon name" bind:value={char.weapons.primary.name} />
                <div class="text-xs text-slate-500">{char.weapons.primary.feature}</div>
                <div class="text-xs text-slate-400">{char.weapons.primary.trait} • {char.weapons.primary.range} • {char.weapons.primary.damage}</div>
              </div>
  
              <div class="flex flex-col gap-2 items-end">
                <button class="px-2 py-1 border rounded" onclick={() => toggleEquip(char.weapons!.primary)}>{char.weapons.primary.equipped ? "Unequip" : "Equip"}</button>
              </div>
            </div>
          {/if}
  
          {#if char.weapons?.secondary}
            <div class="border rounded p-3 bg-slate-50 flex items-start justify-between">
              <div class="flex-1">
                <input class="font-medium w-full bg-transparent outline-none" placeholder="Secondary weapon name" bind:value={char.weapons.secondary.name} />
                <div class="text-xs text-slate-500">{char.weapons.secondary.feature}</div>
              </div>
  
              <div>
                <button class="px-2 py-1 border rounded" onclick={() => toggleEquip(char.weapons!.secondary)}>{char.weapons.secondary.equipped ? "Unequip" : "Equip"}</button>
              </div>
            </div>
          {/if}
        </section>
  
        <!-- armor -->
        <section class="bg-white p-4 rounded border">
          <div>
            <h4 class="font-semibold">Armor</h4>
            <p class="text-xs text-slate-500">Active armor & thresholds</p>
          </div>
  
          <div class="mt-3">
            <input class="w-full border rounded px-2 py-1" placeholder="Armor name" bind:value={char.armor!.name} />
            <input class="w-full border rounded px-2 py-1 mt-2" placeholder="Armor feature" bind:value={char.armor!.feature} />
          </div>
        </section>
  
        <!-- inventory & resources -->
        <section class="bg-slate-50 p-4 rounded border space-y-3">
          <div class="flex justify-between items-center">
            <div>
              <h4 class="font-semibold">Inventory</h4>
              <p class="text-xs text-slate-500">Carry & extra gear</p>
            </div>
            <button class="text-sm px-2 py-1 border rounded" onclick={() => (char.weapons!.inventory = char.weapons!.inventory ?? [], char.weapons!.inventory.push({ name: "New Item" }))}>+ Add</button>
          </div>
  
          <div class="space-y-2">
            {#each char.weapons?.inventory ?? [] as it, i}
              <div class="flex items-center justify-between bg-white p-2 border rounded">
                <input class="flex-1 mr-2 border rounded px-2 py-1" bind:value={it.name} />
                <div class="flex flex-col items-end gap-2">
                  <label class="text-xs inline-flex items-center gap-1">
                    <input type="checkbox" checked={it.equipped} onchange={(e) => char.weapons!.inventory![i].equipped = (e.currentTarget as HTMLInputElement).checked} />
                    Equipped
                  </label>
                  <button class="text-sm px-2 py-1 border rounded" onclick={() => char.weapons!.inventory!.splice(i, 1)}>Remove</button>
                </div>
              </div>
            {/each}
          </div>
  
          <div class="pt-2 border-t mt-2">
            <div class="text-sm text-slate-500">Resources</div>
  
            <div class="mt-2 flex items-center gap-2">
              <label class="text-xs w-20">Handfuls</label>
              <input type="number" class="w-20 border rounded px-2 py-1" min="0" bind:value={char.gold!.handfuls} />
              <label class="text-xs w-14">Bags</label>
              <input type="number" class="w-20 border rounded px-2 py-1" min="0" bind:value={char.gold!.bags} />
            </div>
  
            <div class="mt-3">
              <div class="text-xs text-slate-500">Proficiency</div>
              <div class="flex items-center gap-2 mt-2">
                {#each Array(5) as _, i}
                  <div
                    class="w-5 h-5 rounded-full border flex items-center justify-center cursor-pointer"
                    class:on={(char.proficiency.circles ?? 0) > i}
                    onclick={() => toggleProficiency(i + 1)}
                    style={(char.proficiency.circles ?? 0) > i ? "background-color: rgb(99 102 241); color: white;" : ""}
                  ></div>
                {/each}
                <div class="text-xs text-slate-500 ml-2">{char.proficiency.die}</div>
              </div>
            </div>
  
            <div class="mt-3">
              <div class="text-xs text-slate-500">Experience</div>
              <div class="space-y-2 mt-2">
                {#each char.experience ?? [] as xp, idx}
                  <div class="flex gap-2">
                    <input class="flex-1 border rounded px-2 py-1" bind:value={char.experience![idx]} />
                    <button class="px-2 py-1 border rounded" onclick={() => char.experience!.splice(idx, 1)}>x</button>
                  </div>
                {/each}
                <button class="text-sm px-2 py-1 border rounded" onclick={() => (char.experience = char.experience ?? [], char.experience.push(""))}>+ add</button>
              </div>
            </div>
          </div>
        </section>
      </aside>
    </div>
  
    <!-- bottom -->
    <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="bg-white p-4 rounded border">
        <h4 class="font-semibold mb-2">Notes</h4>
        <textarea class="w-full h-36 p-2 border rounded" bind:value={localVariable} placeholder="Local notes..."></textarea>
      </div>
  
      <div class="bg-white p-4 rounded border">
        <h4 class="font-semibold mb-2">Quick Summary</h4>
        <div class="text-sm text-slate-500">Name</div>
        <div class="font-semibold">{char.name}</div>
  
        <div class="text-sm text-slate-500 mt-3">HP</div>
        <div class="font-semibold">{char.hp.current}/{char.hp.max}</div>
  
        <div class="text-sm text-slate-500 mt-3">Hope</div>
        <div class="font-semibold">{char.hope.current}/{char.hope.max}</div>
  
        <div class="text-sm text-slate-500 mt-3">Top Traits</div>
        <div class="flex gap-2 mt-2 flex-wrap">
          {#each traitKeys.slice(0,3) as t}
            <div class="px-2 py-1 border rounded text-sm">{t}: {char.traits[t].value}</div>
          {/each}
        </div>
      </div>
    </div>
  </div>
  