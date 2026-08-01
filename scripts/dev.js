// Dev orchestrator — starts both the Vite frontend and the Express
// backend together so the upload/parsing API is always reachable.
// Usage: npm run dev:all

import { spawn } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = join(__dirname, '..')

const children = []

function start(name, command, args, cwd) {
  const child = spawn(command, args, {
    cwd,
    shell: process.platform === 'win32',
    stdio: ['ignore', 'inherit', 'inherit'],
  })
  console.log(`\n[dev:all] started ${name} (${command} ${args.join(' ')})`)
  children.push(child)
  return child
}

const backend = start('backend', 'npm', ['run', 'dev'], join(rootDir, 'backend'))
const frontend = start('frontend', 'npm', ['run', 'dev'], rootDir)

function shutdown(signal) {
  console.log(`\n[dev:all] received ${signal}, shutting down...`)
  for (const child of children) {
    if (!child.killed) child.kill()
  }
}

process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))

for (const child of children) {
  child.on('error', (err) => console.error(`[dev:all] child error: ${err.message}`))
}

// Exit when either server dies so the user notices immediately.
function handleExit(name) {
  return () => {
    console.error(`\n[dev:all] ${name} stopped. Shutting down both servers.`)
    for (const c of children) {
      if (!c.killed) c.kill()
    }
    process.exit(1)
  }
}

backend.on('exit', handleExit('backend'))
frontend.on('exit', handleExit('frontend'))
