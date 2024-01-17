import { ApiProperty } from "@nestjs/swagger";

export class GetDeviceByMacResponseDto {
    @ApiProperty({ description: 'Status of the response', example: 'success' })
    status: string;

    @ApiProperty({
        description: 'Response message',
        example: 'Device has been fetched successfully!',
    })
    message: string;
}
