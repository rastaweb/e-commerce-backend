import { extname } from "path";
import * as fs from 'fs'
import { HttpException, HttpStatus } from "@nestjs/common";

export type UploadFileType = { fileName: string, upload: () => void }

export function uploadFile(file: Express.Multer.File, required = true) {
    if (required) {
        if (!file) throw new HttpException('error in uploadFile<FN>: file is required!', HttpStatus.BAD_REQUEST)
    }
    if (!file) return { fileName: null }
    const ext = extname(file.originalname);
    const fileName = `${Date.now()}-${Math.random()}${ext}`;
    const path = `${process.env.UPLOAD_DIR}/${fileName}`;
    return {
        fileName,
        upload: () => {
            try {
                fs.writeFileSync(path, file.buffer)
            } catch (e) {
                throw e
            }
        }
    }
}