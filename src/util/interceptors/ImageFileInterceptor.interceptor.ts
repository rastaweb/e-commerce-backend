import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import * as sharp from 'sharp';

@Injectable()
export class ImageValidationPipe implements PipeTransform {
  async transform(files: Array<Express.Multer.File>) {
    if (files || files.length !== 0) {
      const allowedFormats = ['jpeg', 'png', 'gif'];
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
    }
  }
}
