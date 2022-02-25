<script lang="ts">
  import { onMount } from 'svelte'
  import { sendNotification } from './ts/notifications'
  const el = document.getElementById('box')
  if (el) el.innerHTML = ''

  let map: Record<string, { letter: string; x: number; y: number }[]> = {}

  const randomizer = () => {
    let str: string = (Math.random() + 1).toString(36).substring(7)

    for (let char of str) {
      if (!map[char])
        map[char] = [
          {
            x: Math.random() * window.innerWidth,
            y: 0,
            letter: char,
          },
        ]
      else
        map[char].push({
          x: Math.random() * window.innerWidth,
          y: 0,
          letter: char,
        })
    }
  }

  let i1, i2

  onMount(() => {
    i1 = setInterval(() => {
      for (let key of Object.keys(map)) {
        for (let char of map[key]) {
          if (char.y > window.innerHeight) {
            sendNotification({
              type: 'info',
              content: 'Game Over',
            })
            clearInterval(i1)
            clearInterval(i2)
          }
          char.y += 2
        }
      }
      map = map
    }, 50)
    i2 = setInterval(() => {
      randomizer()
    }, 3000)
    window.addEventListener('keydown', (e) => {
      if (map[e.key]) {
        map[e.key].shift()
      }
    })
  })
</script>

<!--
<div class="w-full h-full flex gap-2 justify-center items-center">
	{#key map}
		{#each Object.keys(map) as key}
			<div class="block">
				{#each map[key] as letter}
					<div class="mt-2 p-2 bg-[var(--sub-color)] rounded-lg">{letter}</div>
				{/each}
			</div>
		{/each}
	{/key}
</div>
-->

<div class="w-full h-full relative overflow-hidden">
  {#each Object.keys(map) as key}
    {#each map[key] as letter}
      <div
        class="p-2 bg-[var(--sub-color)] rounded-lg absolute"
        style="top: {letter.y}px; left: {letter.x}px;"
      >
        {letter.letter}
      </div>
    {/each}
  {/each}
</div>
