import { HttpStatus, ParseFilePipeBuilder } from '@nestjs/common';

export const fileValidator = (args: {
  fileIsRequired: boolean;
  fileType: RegExp;
}) => {
  // args.fileIsRequired = true;
  // args.fileType = /^image\/(jpeg|jpg|png)$/;
  const { fileIsRequired, fileType } = args;
  return new ParseFilePipeBuilder()
    .addFileTypeValidator({
      fileType,
    })
    .build({
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      fileIsRequired,
    });
};
