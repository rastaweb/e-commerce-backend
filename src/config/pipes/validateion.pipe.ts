import { BadRequestException, ValidationPipe } from "@nestjs/common";

export const customizedValidationPipe = new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    exceptionFactory: (errors) => {
        const whiteListError = errors.find(item => {
            return item.constraints && item.constraints['whitelistValidation'];
        });
        if (whiteListError) {
            return new BadRequestException('اطلاعات ارسالی غیرمجاز است. لطفاً فقط فیلدهای معتبر را ارسال کنید.');
        }
        const formattedErrors = errors.reduce((acc, err) => {
            const field = err.property;
            const messages = Object.values(err.constraints);
            acc[field] = { messages };
            return acc;
        }, {});
        formattedErrors["statusCode"] = 400
        formattedErrors["error"] = "Bad Request"
        return new BadRequestException(formattedErrors);
    },
})