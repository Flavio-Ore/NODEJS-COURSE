const fs = require('node:fs/promises')
const path = require('node:path')

async function ls (folder = '') {
  let files

  try {
    files = await fs.readdir(folder)
  } catch (error) {
    console.log(`The ${folder} folder has not been read correctly.`)
    process.exit(1)
  }

  const filePromises = files.map(async file => {
    let stats
    const filePath = path.join(folder, file)
    try {
      console.log('ANTES DE USAR TRYCATCH STAT')
      stats = await fs.stat(filePath)
      console.log('DESPUES DE USAR TRYCATCH STAT')
    } catch (error) {
      console.log(`The ${filePath} file has not been read correctly.`)
      process.exit(1)
    }
    const isDir = stats.isDirectory()
    const isFile = stats.isFile()
    const isSymLink = stats.isSymbolicLink()

    const fileType = isDir ? 'd--' : isFile ? '-f-' : isSymLink ? '--s' : '-'
    const size = stats.size
    const mDateTime = stats.mtime.toLocaleDateString().padStart(10)
    const mLocaleTime = stats.mtime.toLocaleTimeString() // modification time

    return `${fileType} ${mDateTime.padStart(12)} ${mLocaleTime.padStart(
      10
    )} ${size.toString().padStart(15)} ${file.padStart(file.length + 1)}`
  })

  const filesInfo = await Promise.all(filePromises)

  const directory = `Directory: ${__dirname}`

  console.log('\n')
  console.log(`        ${directory}\n`)

  // https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color
  console.log('\x1b[32m') //FgGreen

  console.log('Type   Date        Time                Size   Name')
  console.log(
    '----  ----------   --------  --------------  ----------',
    '\x1b[0m' //Reset console color (default)
  )

  filesInfo.forEach(fileInfo => console.log(fileInfo))
}

function main () {
  const folder = process.argv[2] ?? '.'
  ls(folder)
}

main()
