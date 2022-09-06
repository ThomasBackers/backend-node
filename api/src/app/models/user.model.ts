import { Model, DataTypes } from 'sequelize'
import { sequelize } from '@/database/config'
import Role from '@/models/role.model'

class User extends Model {
  declare id: string
  declare avatarPath: string
  declare username: string
  declare email: string
  declare passwordHash: string
}

User.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  avatarPath: {
    type: DataTypes.STRING
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'users',
  sequelize,
  timestamps: true
})

User.belongsToMany(Role, { through: 'roles_users' })

export default User
