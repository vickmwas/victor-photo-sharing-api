import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';

export const configureAWS = (configService: ConfigService) => {
  AWS.config.update({
    accessKeyId: configService.get<string>('AWS_ACCESS_KEY_ID'),
    secretAccessKey: configService.get<string>('AWS_SECRET_ACCESS_KEY'),
    region: configService.get<string>('AWS_REGION'),
  });
};
