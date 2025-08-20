import { Controller, Get, Param, Req } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) { }

    @Get('')
    async getUserNotifications(@Req() req: any) {
        const notifications = await this.notificationService.findByUser(req.user.sub)
        return {
            success: true,
            message: "Notifications reterived successfully",
            data: {
                notifications
            }
        }
    }
}
