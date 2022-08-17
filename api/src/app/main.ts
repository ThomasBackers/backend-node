import express, { Express, Router } from 'express'

type Module = {
  func: { (...params: any): any }
  params: any[]
}

const api: Express = express()
const port: number = Number(process.env.PORT)
const modules: Module[] = [
  { func: express.json, params: [] }
]
const routes: Router[] = []

const initModules = (): boolean => {
  try {
    modules.forEach((module: Module): void => {
      const { func, params } = module
      api.use(func(...params))
    })
    console.log('✅ modules successfully initialized')
    return true
  } catch (error: unknown) {
    const log = error instanceof Error ? error.message : error
    console.log(`⛔ failed to initialize modules: ${log}`)
    return false
  }
}

const initRoutes = (): boolean => {
  try {
    routes.forEach((router: Router): void => { api.use('/api', router) })
    console.log('✅ routes successfully initialized')
    return true
  } catch (error: unknown) {
    const log = error instanceof Error ? error.message : error
    console.log(`⛔ failed to initialize modules: ${log}`)
    return false
  }
}

const start = (): void => {
  const isInit = [
    initModules(),
    initRoutes()
  ].every((value: boolean): boolean => value === true)
  if (isInit) {
    api.listen(port, (): void => {
      console.log(`⚡ API: is listening on port ${port}`)
    })
  } else {
    console.log('🔒 API: cannot start because initialization failed')
    process.exit(1)
  }
}

export default start
