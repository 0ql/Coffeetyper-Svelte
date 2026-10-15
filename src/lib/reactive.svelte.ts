// Wraps a value in a deep $state proxy, so in-place mutations (e.g. letter.correct = true)
// are picked up by components that render it.
export const reactive = <T>(value: T): T => {
	const state = $state(value)
	return state
}
