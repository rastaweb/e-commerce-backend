import * as fs from 'fs'
export function removeFile(fileName: string) {
    try {
        if (fs.existsSync(`${process.env.UPLOAD_DIR}/${fileName}`)) {
            fs.rmSync(`${process.env.UPLOAD_DIR}/${fileName}`)
        }
    } catch (e) {
        throw e
    }
}