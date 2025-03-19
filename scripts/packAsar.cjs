const asar = require('asar')
const fs = require('fs')
const path = require('path')
const { rm } = require('fs/promises')

const packageJsonPath = path.resolve(__dirname, `..${path.sep}package.json`)

const packageJsonString = fs.readFileSync(packageJsonPath, 'utf8')
const packageJson = JSON.parse(packageJsonString)

const asarUnpackDir = path.join(
  __dirname,
  `..${path.sep}release${path.sep}${packageJson.version}${path.sep}win-unpacked${path.sep}resources${path.sep}renderer`
)

const packAsar = async () => {
  await asar.createPackage(
    asarUnpackDir,
    path.join(
      __dirname,
      `..${path.sep}release${path.sep}${packageJson.version}${path.sep}win-unpacked${path.sep}resources${path.sep}renderer.asar`
    )
  )
  console.log('文件夹已成功压缩成 .asar 文件')
}

async function deleteFolder() {
  try {
    await rm(asarUnpackDir, { recursive: true, force: true })
    console.log('文件夹已删除')
  } catch (err) {
    console.error('删除失败:', err)
  }
}

exports.default = async () => {
  await packAsar()
  await deleteFolder()
}
