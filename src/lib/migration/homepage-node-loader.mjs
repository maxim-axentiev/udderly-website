import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const repoRoot = fileURLToPath(new globalThis.URL('../../../', import.meta.url))

function moduleSource(relativePath) {
  return `export default ${JSON.stringify(relativePath)};\n`
}

export async function resolve(specifier, context, nextResolve) {
  if (specifier.endsWith('.webp')) {
    const relative = specifier.startsWith('@/')
      ? `src/${specifier.slice(2)}`
      : path
          .relative(
            repoRoot,
            path.resolve(path.dirname(fileURLToPath(context.parentURL)), specifier),
          )
          .replaceAll('\\', '/')
    return {
      url: `data:text/javascript;charset=utf-8,${encodeURIComponent(moduleSource(relative))}`,
      shortCircuit: true,
    }
  }

  if (specifier.startsWith('@/')) {
    const relative = `src/${specifier.slice(2)}`
    const file = relative.endsWith('.ts') || relative.endsWith('.tsx') ? relative : `${relative}.ts`
    const absolute = path.join(repoRoot, file)
    if (!fs.existsSync(absolute)) {
      throw new Error(`Cannot resolve ${specifier}`)
    }
    return nextResolve(pathToFileURL(absolute).href, context)
  }

  return nextResolve(specifier, context)
}
