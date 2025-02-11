import { SetMetadata } from '@nestjs/common';

export const LOG_REQUEST_METADATA_KEY = 'logRequest';
export const LogRequest = () => SetMetadata(LOG_REQUEST_METADATA_KEY, true);