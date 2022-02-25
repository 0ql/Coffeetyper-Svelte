<script lang="ts">
  import { runState, settings } from '../store'
</script>

<div
  class="w-full h-full flex items-center justify-center transition-opacity duration-400 {$settings.opened ||
  $settings.cosmetics.theme.opened
    ? ' opacity-30'
    : ''}"
>
  <div style="width: {$settings.cosmetics.textBox.width};">
    <div class="flex gap-5">
      <div>
        <div class="text-5xl font-bold">{$runState.aggWPM}</div>
        <div class="mt-4 text-xl">WPM</div>
      </div>
      <div>
        <div class="text-5xl font-bold">{$runState.aggSPM}</div>
        <div class="mt-4 text-xl">SPM</div>
      </div>
      <div>
        <div class="text-5xl font-bold">
          {$runState.accuracy}%
        </div>
        <div class="mt-4 text-xl">Accuracy</div>
      </div>
      <div>
        <div class="text-5xl font-bold">{$runState.timePassed}</div>
        <div class="mt-4 text-xl">Time</div>
      </div>
    </div>
    <div class="opacity-50 mt-4">
      press {$settings.keybindings.leader.key} + {$settings.keybindings.reset}
      to restart
    </div>
  </div>
</div>
