import express, { Express, Router } from 'express'
import helmet from 'helmet'
import { initDatabase } from '@/database/config'
import authRouter from '@/routes/auth.router'
import usersRouter from '@/routes/users.router'

type Module = {
  func: { (...params: any): any }
  params: any[]
}

const api: Express = express()
const port: number = Number(process.env.PORT)
const modules: Module[] = [
  { func: express.json, params: [] },
  { func: express.urlencoded, params: [{ extended: true }] },
  { func: helmet, params: [] }
]
const routes: Router[] = [
  authRouter,
  usersRouter
]

const init = (what: string, how: { (): void }): boolean => {
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

const initApi = async (): Promise<boolean> => [
  init('modules', (): void =>
    modules.forEach((module: Module): void => {
      const { func, params } = module
      api.use(func(...params))
    })
  ),
  init('routes', (): void =>
    routes.forEach((router: Router): void => { api.use('/api', router) })
  ),
  await initDatabase()
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
