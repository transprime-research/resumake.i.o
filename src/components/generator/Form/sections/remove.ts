export function confirmRemove(label: string, remove: () => void) {
  if (window.confirm(`Remove this ${label}? This cannot be undone.`)) {
    remove()
  }
}
