export function initApp() {
  loadConfig()
}

async function loadConfig() {
  const config = (await import('../config/index.js')).default
  global.config = config
}
