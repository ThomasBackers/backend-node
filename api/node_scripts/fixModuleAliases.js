const [,, ...args] = process.argv

if (args.length !== 1) console.log('fixModuleAliases expected exactly 1 flag')
else {
  const flag = args[0]
  if (flag === '-D' || flag === '-P') {
    const fs = require('fs')
    const package = require('../package.json')

    if (flag === '-D') {
      for (const [key, value] of Object.entries(package._moduleAliases)) {
        package._moduleAliases[key] = value.replace('dist', 'src')
      }
    } else {
      for (const [key, value] of Object.entries(package._moduleAliases)) {
        package._moduleAliases[key] = value.replace('src', 'dist')
      }
    }

    const packageJsonContent = JSON.stringify(package, null, 2)
    fs.writeFileSync('package.json', packageJsonContent + '\n')
  } else console.log('invalid flag')
}
