// payout/slip-verification.service.ts

import { Injectable, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import FormData from 'form-data';
import { UploadedFileType } from 'src/product/interfaces/uploaded-file.interface';

@Injectable()
export class SlipVerificationService {
    constructor(private readonly httpService: HttpService) { }

    async verifyByImage(
        file: UploadedFileType,
        expectedAmount: number,
    ) {
        const formData = new FormData();

        formData.append('image', file.buffer, {
            filename: file.originalname,
            contentType: file.mimetype,
        });

        formData.append('matchAmount', expectedAmount);
        formData.append('checkDuplicate', 'true');

        try {
            const response = await firstValueFrom(
                this.httpService.post(
                    'https://api.thunder.in.th/v2/verify/bank',
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${process.env.THUNDER_API_KEY}`,
                            ...formData.getHeaders(),
                        },
                    },
                ),
            );

            return response.data;
        } catch (error) {
            throw new BadRequestException(
                error.response?.data?.error?.message ||
                'Slip verification failed',
            );
        }
    }

}
