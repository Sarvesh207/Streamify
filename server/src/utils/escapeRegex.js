// Escapes characters with special meaning in RegExp so user input is matched literally
const escapeRegex = (value = "") =>
    String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export { escapeRegex };
