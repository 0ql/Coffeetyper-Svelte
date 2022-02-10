self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) return response
      return fetch(event.request)
        .then((res) => res)
        .catch(async (err) => {
          const client = await clients.get(event.clientId)
          if (!client) return

          const domain = event.request.url.match(
            /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/gim
          )[0]
          if ('https://fonts.googleapis.com' === domain) {
            client.postMessage({
              type: 'FONT FETCH FAILED',
            })
          } else if (
            event.request.url.includes('theme') &&
            (event.request.url.includes('coffeetyper.com') ||
              event.request.url.includes('localhost:3000')) // for dev purposes
          ) {
						client.postMessage({
							type: 'THEME FETCH FAILED',
						})
          } else {
						console.log('SW Error:', err)
						client.postMessage({
							type: 'FETCH FAILED',
							msg: `Request to ${event.request.url} failed.`,
						})
					}

          return new Response(null)
        })
    })
  )
})
