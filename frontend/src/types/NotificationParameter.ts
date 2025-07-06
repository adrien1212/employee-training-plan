import { NotificationType } from "./NotificationType";

export interface NotificationParameter {
    id: number;
    name: string;
    notificationType: NotificationType;
    period: number;
    enabled: boolean
}