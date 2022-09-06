import { Model, DataTypes } from 'sequelize'
import { sequelize } from '@/database/config'
import User from '@/models/user.model'

class Role extends Model {
  declare id: string
  declare name: string
}

Role.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'roles',
  sequelize,
  timestamps: true
})

Role.belongsToMany(User, { through: 'roles_users' })

export default Role
