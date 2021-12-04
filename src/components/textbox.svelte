<script lang="ts">
  import { onMount } from "svelte/internal";
  import { crossfade } from "svelte/transition";
  import { box, cursor, runState, settings } from "../store";
  import { Timer, letterHighlighting, textArray, RunManager } from "./textbox";
  import { createText } from "./words";
  import { get } from "svelte/store";
  import { formatTime } from "../util";

  const [send, receive] = crossfade({
    duration: parseInt($settings.textBox.caret.duration),
  });

  let clientHeight = 0;
  let infobar: HTMLDivElement;
  let stats: boolean = false;
  let manager: RunManager;
  const results: {
    time: string;
    wpm: number;
    lpm: number;
    accuracy: number;
  } = {
    time: "",
    wpm: 0,
    lpm: 0,
    accuracy: 0,
  };

  const newText = async () => {
    let txt = await createText();
    textArray.set(
      txt.split(" ").map((word: string, i: number) => {
        const w = word.split("").map((letter, ii: number) => {
          return {
            letter: letter,
            correct: null,
            active: i === 0 && ii === 0 ? true : false,
          };
        });

        w.push({
          letter: " ",
          correct: null,
          active: false,
        });

        return {
          letters: w,
        };
      })
    );
  };

  cursor.subscribe((c) => {
    if (c) clientHeight = c.clientHeight;
  });

  let timeSpanInSeconds;
  let timer = new Timer();

  const displayStats = () => {
    timer.pause();
    stats = true;

    const state = get(runState);

    if ($settings.modeName === "timed") {
      timeSpanInSeconds = timer.progress;
    } else {
      timeSpanInSeconds = $settings.mode.time;
    }

    results.wpm = Math.floor((state.correctWordCount / timeSpanInSeconds) * 60);
    results.lpm = Math.floor(
      (state.correctLetterCount / timeSpanInSeconds) * 60
    );
    results.accuracy = Math.round(state.accuracy * 100);
    results.time = formatTime(timeSpanInSeconds);
  };

  const onRunStarted = () => {
    if (!timer.running) {
      timer.start($settings.modeName, $settings.mode.time, displayStats);
    }
  };

  const onRunEnded = () => {
    manager.removeEventListener();
    timer.pause();
    displayStats();
    timer.reset();
  };

  document.addEventListener("keydown", async (e) => {
    if (e.key === "R") {
      manager.removeEventListener();
      stats = false;
      await newText();
      timer.reset();
      manager.reset();
      runState.set({
        accuracy: 0,
        correctLetterCount: 0,
        correctWordCount: 0,
        progress: 0,
        timeString: "0:00",
        wpm: 0,
        lpm: 0,
        timePassed: 0,
      });
      manager.startEventListener();
    }
  });

  onMount(async () => {
    newText();
    manager = new RunManager(infobar, onRunStarted, onRunEnded);
    manager.startEventListener();
  });
</script>

{#if stats === false}
  <div
    class="h-full w-full flex items-center justify-center absolute text-2xl transition-opacity duration-400 {$settings.opened ||
    $settings.theme.opened
      ? ' opacity-30'
      : ''}"
  >
    <div class="flex-col" style="width: {$settings.textBox.width};">
      <div
        bind:this={infobar}
        class="flex gap-4"
        style="padding-left: {$settings.textBox.caret.width}"
      >
        <div>
          {$settings.textBox.infobar.liveTime ? $runState.timeString : ""}
        </div>
        <div>
          {$settings.textBox.infobar.liveAccuracy
            ? Math.round($runState.accuracy * 100) + "%"
            : ""}
        </div>
        {#if $settings.textBox.infobar.liveWpm}
          <div class="flex items-end">
            {$runState.wpm}<span class="text-xs mb-1">WPM</span>
          </div>
        {/if}
        {#if $settings.textBox.infobar.liveLpm}
          <div class="flex items-end">
            {$runState.lpm}<span class="text-xs mb-1">LPM</span>
          </div>
        {/if}
      </div>
      <div
        bind:this={$box}
        class="overflow-hidden w-full z-1"
        style="height: {clientHeight
          ? clientHeight * parseInt($settings.textBox.lines)
          : 0}px; padding-left: {$settings.textBox.caret
          .width}; font-size: {$settings.textBox.fontSize};"
      >
        <div
          class="inline-flex flex-wrap letter"
          style="letter-spacing: {$settings.textBox
            .letterSpacing}; line-height: {$settings.textBox.lineHeight};"
        >
          <!-- Word -->
          {#each $textArray as word}
            <div class="inline-block inline-flex text-[var(--sub-color)] word">
              {#each word.letters as letterObj}
                <!-- Caret -->
                {#if letterObj.active}
                  <div
                    out:send={{ key: 1 }}
                    in:receive={{ key: 1 }}
                    bind:this={$cursor}
                    style="width: {$settings.textBox.caret
                      .width}; margin-right: -{$settings.textBox.caret
                      .width};ttransform: translateX(-{$settings.textBox.caret
                      .width}); background-color: {$settings.textBox.caret
                      .colored
                      ? 'var(--caret-color)'
                      : ''};"
                    class="bg-white {$settings.textBox.caret.rounded
                      ? 'rounded-full'
                      : ''} "
                  />
                {/if}
                <!-- Letter -->
                <div
                  style={letterHighlighting(letterObj)}
                  class="letter {letterObj.correct ? 'correct' : ''}"
                >
                  {#if letterObj.letter === " "}
                    <div style="width: {$settings.textBox.spaceWidth};" />
                  {:else}
                    {letterObj.letter}
                  {/if}
                </div>
              {/each}
            </div>
          {/each}
        </div>
      </div>
    </div>
  </div>
{:else}
  <div
    class="w-full h-full flex items-center justify-center transition-opacity duration-400 {$settings.opened ||
    $settings.theme.opened
      ? ' opacity-30'
      : ''}"
  >
    <div style="width: {$settings.textBox.width};">
      <div class="flex gap-5">
        <div>
          <div class="text-5xl font-bold">{results.wpm}</div>
          <div class="mt-4 text-xl">WPM</div>
        </div>
        <div>
          <div class="text-5xl font-bold">{results.lpm}</div>
          <div class="mt-4 text-xl">LPM</div>
        </div>
        <div>
          <div class="text-5xl font-bold">
            {results.accuracy}%
          </div>
          <div class="mt-4 text-xl">Accuracy</div>
        </div>
        <div>
          <div class="text-5xl font-bold">{results.time}</div>
          <div class="mt-4 text-xl">Time</div>
        </div>
      </div>
      <div class="opacity-50 mt-4">press R to restart</div>
    </div>
  </div>
{/if}
