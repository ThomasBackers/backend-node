import { Sequelize, Dialect } from 'sequelize'

const dbName: string = process.env.DB_NAME
const dbUser: string = process.env.DB_USER
const dbPassword: string = process.env.DB_PASSWORD
const dialect: Dialect = process.env.DB_DIALECT as Dialect
const storage: string = dialect === 'sqlite' ? `${dbName}.sqlite` : undefined
const host: string = process.env.DB_HOST
const logging = (...msg: [sql: string, timing?: number]): void => {
  console.log(`💬 Sequelize: ${msg}`)
}

export const sequelize = new Sequelize(
  dbName,
  dbUser,
  dbPassword,
  {
    dialect,
    storage,
    host,
    logging
  }
)

// N.B.: the following line is needed to use postgreSQL for exemple
// export const databaseAuth = async (): Promise<any> => await sequelize.authenticate()

export const initDatabase = async (): Promise<boolean> => {
  try {
    await sequelize.sync()
    console.log('✅ database successfully synchronized')
    return true
  } catch (error: unknown) {
    const log = error instanceof Error ? error.message : error
    console.log(`⛔ failed to synchronize database: ${log}`)
    return false
  }
}
