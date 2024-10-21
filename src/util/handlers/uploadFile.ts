import { extname } from "path";
import * as fs from 'fs'
import { HttpException, HttpStatus } from "@nestjs/common";

export type UploadFileType = { fileName: string, upload: () => void }

export function uploadFile(file: Express.Multer.File) {
    if (!file) throw new HttpException('error in uploadFile<FN>: file is required!', HttpStatus.BAD_REQUEST)
    const ext = extname(file.originalname);
    const fileName = `${Date.now()}${ext}`;
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