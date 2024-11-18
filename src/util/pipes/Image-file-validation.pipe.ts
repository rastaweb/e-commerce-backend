import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import * as sharp from 'sharp';

@Injectable()
export class ImageValidationPipe implements PipeTransform {
  async transform(files: Express.Multer.File | Array<Express.Multer.File>) {

    const allowedFormats = ['jpeg', 'png', 'gif'];
    if (files && Array.isArray(files) && files?.length !== 0) {
      for (const file of files) {
        if (!file.buffer) {
          throw new BadRequestException('فایل ورودی به صورت معتبر نیست.');
        }
        try {
          const image = sharp(file.buffer);
          const metadata = await image.metadata();

          if (!metadata || !allowedFormats.includes(metadata.format)) {
            throw new BadRequestException(`فرمت فایل ${file.originalname} غیرمجاز است.`);
          }

          // امکان تغییر اندازه برای اطمینان بیشتر از اینکه فایل یک تصویر معتبر است
          await image.resize(100, 100).toBuffer();
        } catch (error) {
          console.log(error);
          throw new BadRequestException(`فایل ${file.originalname} غیرمجاز یا خراب است.`);
        }
      }
      return files;
    } else {
      if (files && !Array.isArray(files)) {
        if (!files.buffer) {
          throw new BadRequestException('فایل ورودی به صورت معتبر نیست.');
        }
        const image = sharp(files.buffer);
        const metadata = await image.metadata();

        if (!metadata || !allowedFormats.includes(metadata.format)) {
          throw new BadRequestException(`فرمت فایل ${files.originalname} غیرمجاز است.`);
        }
      }
      return files
    }
  }
}
