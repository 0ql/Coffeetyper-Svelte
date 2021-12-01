<script lang="ts">
  import { fade, fly } from "svelte/transition";
  import { fixBwithA, settings } from "../store";
  import type { Settings } from "../store";
  import Input from "./ui/input.svelte";
  import Select from "./ui/select.svelte";
  import Checkbox from "./ui/checkbox.svelte";
  import Button from "./ui/button.svelte";
  import { getFromLocalStorage, saveToLocalStorage } from "../util";
  import { get } from "svelte/store";

  let fonts: any[];

  (async () => {
    const res = await fetch(
      "https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyC5aKFZzHKdeM8BuDGs5gXotGo2XJ8JsWs"
    );
    fonts = (await res.json())["items"];
  })();

  const changeFont = () => {
    fonts.filter((font) => {
      if (font.family === $settings.family) {
        $settings.family = font.family;
      }
    });
  };

  let newName: string = "";
  const saveSettings = () => {
    if (newName.length < 1) {
      alert("Please enter a name");
      return;
    }

    let s = getFromLocalStorage("savedSettings");
    if (s === null) s = {};

    s[newName] = get(settings);
    saveToLocalStorage("savedSettings", s);
  };

  const getSavedSettings = () => {
    let s = getFromLocalStorage("savedSettings");
    if (s === null) s = {};

    return s;
  };

  const changeSettings = (name: string) => {
    $settings = getFromLocalStorage("savedSettings")[name];
  };

  const deleteSetting = (name: string) => {
    let s = getFromLocalStorage("savedSettings");
    console.log(s);
    delete s[name];
    saveToLocalStorage("savedSettings", s);
  };

  const exportRaw = (name: string) => {
    const s: Settings = getFromLocalStorage("savedSettings")[name];
    const data = JSON.stringify(s);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    window.open(url);
  };

  const exportCosmetics = (name: string) => {
    const s: Settings = getFromLocalStorage("savedSettings")[name];
    // remove irrelevant settings
    delete s.mode;
    delete s.modeName;
    delete s.opened;
    delete s.wordSet;
    delete s.textBox.infobar;
    delete s.theme.opened;

    const data = JSON.stringify(s);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    window.open(url);
  };

  let imported = "";

  const importSettings = () => {
    const data = JSON.parse(imported);
    $settings = fixBwithA($settings, data);
  };
</script>

{#if $settings.opened}
  <div
    transition:fade={{ duration: 400 }}
    style="direction: rtl;"
    class="fixed h-full z-2 overflow-x-hidden overflow-y-scroll scrollbar-thin scrollbar-thumb-current scrollbar-thumb-rounded scrollbar-track-transparent"
  >
    <div class="pl-5 py-5" style="direction: ltr;" transition:fly={{ x: -100 }}>
      <div class="text-primary font-bold text-xl">Settings</div>
      <div class="mt-5">Font Family</div>
      <Select class="mt-3" bind:value={$settings.family} on:change={changeFont}>
        {#if fonts}
          {#each fonts as font}
            <option value={font.family}>{font.family}</option>
          {/each}
        {/if}
      </Select><br />

      <div class="mt-5">Textbox</div>
      <div class="mt-2 flex gap-3">
        <div>
          <div class="text-xs">Width</div>
          <Input
            class="mt-2 w-15 text-center"
            bind:value={$settings.textBox.width}
          />
        </div>
        <div>
          <div class="text-xs">Lines</div>
          <Input
            class="mt-2 w-10 text-center"
            bind:value={$settings.textBox.lines}
          />
        </div>
        <div>
          <div class="text-xs">Line Height</div>
          <Input
            class="mt-2 w-20 text-center"
            bind:value={$settings.textBox.lineHeight}
          />
        </div>
        <div>
          <div class="text-xs">Words</div>
          <Input
            class="mt-2 w-10 text-center"
            bind:value={$settings.textBox.words}
          />
        </div>
        <div>
          <div class="text-xs">Letter Spacing</div>
          <Input
            class="mt-2 w-20 text-center"
            bind:value={$settings.textBox.letterSpacing}
          />
        </div>
      </div>
      <div class="flex gap-3 mt-2">
        <div>
          <div class="text-xs">Font Size</div>
          <Input
            class="mt-2 w-20 text-center"
            bind:value={$settings.textBox.fontSize}
          />
        </div>
        <div>
          <div class="text-xs">Space Width</div>
          <Input
            class="mt-2 w-20 text-center"
            bind:value={$settings.textBox.spaceWidth}
          />
        </div>
      </div>

      <div class="mt-5">Caret</div>
      <div class="flex gap-2 mt-2">
        <Checkbox bind:checked={$settings.textBox.caret.rounded} />
        <div class="text-xs">Rounded</div>
      </div>
      <div class="flex gap-4 mt-2">
        <div>
          <div class="text-xs">Speed</div>
          <Input
            class="mt-2 w-10 text-center"
            bind:value={$settings.textBox.caret.duration}
          />
        </div>
        <div>
          <div class="text-xs">Width</div>
          <Input
            class="mt-2 w-20 text-center"
            bind:value={$settings.textBox.caret.width}
          />
        </div>
      </div>

      <div class="mt-5">Infobar</div>
      <div class="flex gap-3">
        <div>
          <div class="flex gap-2 mt-2">
            <Checkbox bind:checked={$settings.textBox.infobar.liveAccuracy} />
            <div class="text-xs">Live Accuracy</div>
          </div>
          <div class="flex gap-2 mt-2">
            <Checkbox bind:checked={$settings.textBox.infobar.liveLpm} />
            <div class="text-xs">Live LPM</div>
          </div>
        </div>
        <div>
          <div class="flex gap-2 mt-2">
            <Checkbox bind:checked={$settings.textBox.infobar.liveWpm} />
            <div class="text-xs">Live WPM</div>
          </div>
          <div class="flex gap-2 mt-2">
            <Checkbox bind:checked={$settings.textBox.infobar.liveTime} />
            <div class="text-xs">Live Time</div>
          </div>
        </div>
      </div>

      <div class="mt-5">Wordset</div>
      <Select class="mt-3" bind:value={$settings.wordSet}>
        <option value="top 1k">Top 1k words english</option>
      </Select>

      <div class="flex gap-3">
        <div>
          <div class="mt-5">Mode</div>
          <Select class="mt-3" bind:value={$settings.modeName}>
            <option value="timed">Timed</option>
            <option value="countdown">Countdown</option>
            <option value="countup">Countup</option>
          </Select>
        </div>
        <div>
          <div class="mt-5">Time</div>
          <Input class="mt-3 w-30" bind:value={$settings.mode.time} />
        </div>
      </div>
      <div class="mt-5">Save Settings</div>
      <div class="mt-3 text-xs">Name</div>
      <div>
        <Input
          placeholder={$settings.theme.active}
          class="mt-3 mr-3"
          bind:value={newName}
        />
        <Button on:click={saveSettings}>Save</Button>
      </div>

      <div class="mt-5">Import Settings</div>
      <div class="mt-3 text-xs">Paste</div>
      <div>
        <Input
          placeholder="Paste settings here"
          class="mt-3 mr-3"
          bind:value={imported}
        />
        <Button on:click={importSettings}>Load</Button>
      </div>

      <div class="mt-5">Saved Settings</div>
      <div>
        {#each Object.keys(getSavedSettings()) as name}
          <div class="flex gap-4 mt-3">
            <div>
              <div class="text-sm">{name}</div>
              <div class="flex mt-3 gap-4">
                <Button on:click={() => changeSettings(name)}>Load</Button>
                <Button on:click={() => deleteSetting(name)}>Delete</Button>
              </div>
            </div>
            <div>
              <div class="text-xs mt-1">Export</div>
              <div class="flex mt-3 gap-4">
                <Button on:click={() => exportRaw(name)}>Full</Button>
                <Button on:click={() => exportCosmetics(name)}>Cosmetics</Button
                >
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
{/if}
