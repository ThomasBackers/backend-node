import express, { Express, Router } from 'express'
import helmet from 'helmet'
import { syncModels } from '@/database/orm'

type Module = {
  func: { (...params: any): any }
  params: any[]
}

const api: Express = express()
const port: number = Number(process.env.PORT)
const modules: Module[] = [
  { func: express.json, params: [] },
  { func: helmet, params: [] }
]
const routes: Router[] = []

const init = (what: string, how: { (): void }) => {
  try {
    how()
    console.log(`✅ ${what} successfully initialized`)
    return true
  } catch (error: unknown) {
    const log = error instanceof Error ? error.message : error
    console.log(`⛔ failed to initialize ${what}: ${log}`)
    return false
  }
}

const initModules = (): boolean =>
  init('modules', (): void =>
    modules.forEach((module: Module): void => {
      const { func, params } = module
      api.use(func(...params))
    })
  )

const initRoutes = (): boolean =>
  init('routes', (): void =>
    routes.forEach((router: Router): void => { api.use('/api', router) })
  )

const initApi = async (): Promise<boolean> => [
  initModules(),
  initRoutes(),
  await syncModels()
].every((value: boolean): boolean => value)

const start = async (): Promise<void> => {
  if (await initApi()) {
    api.listen(port, (): void => {
      console.log(`⚡ API: is listening on port ${port}`)
    })
  } else {
    console.log('🔒 API: cannot start because initialization failed')
    process.exit(1)
  }
}

export default start
