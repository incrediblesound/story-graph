export function addPeriod(text) {
  return text + '. '
}

export function capitalizeFirst(text) {
  const head = text[0].toUpperCase()
  const tail = text.substring(1)
  return head + tail
}
