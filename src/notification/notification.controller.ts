import { Controller, Get, Param, Patch, Query, Req } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) { }

    @Get('')
    async getUserNotifications(
        @Req() req: any,
        @Query('page') page = '1',
        @Query('limit') limit = '10',
    ) {
        const data = await this.notificationService.findByUser(req.user.sub, +page, +limit)
        return {
            success: true,
            message: "Notifications reterived successfully",
            data
        }
    }

    @Patch('/:id/read')
    async markAsRead(@Param('id') id: string, @Req() req: any) {
        const notification = await this.notificationService.markAsRead(req.user.sub, id)
        return {
            success: true,
            message: 'Notification marked as read',
            data: { notification },
        }
    }

    @Patch(':id/hide')
    async hide(@Param('id') id: string, @Req() req: any) {
        const notification = await this.notificationService.hideNotification(req.user.sub, id)
        return {
            success: true,
            message: 'Notification marked as read',
            data: { notification },
        }
    }

    @Patch('read-all')
    async markAllAsRead(@Req() req: any) {
        await this.notificationService.markAllAsRead(req.user.sub)
        return {
            success: true,
            message: 'All notifications marked as read',
        }
    }

    @Patch('hide-all')
    async hideAll(@Req() req: any) {
        await this.notificationService.hideAll(req.user.sub)
        return {
            success: true,
            message: 'All notifications marked as read',
        }
    }
}
