import { writable } from 'svelte/store'
import type { Writable } from 'svelte/store'

export type Notification = {
	content: string
	type: 'warning' | 'info' | 'error'
}

export let notifications: Writable<Notification[]> = writable([])

export const sendNotification = (n: Notification) => {
	notifications.update((nt) => {
		nt.push(n)
		return nt
	})

	setTimeout(() => {
		notifications.update((n) => {
			n.pop()
			return n
		})
	}, 3000)
}
