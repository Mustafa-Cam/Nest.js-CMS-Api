import { Module } from "@nestjs/common";
import { AdminRolesModule } from "./admin/adminRoles.module";
import { FrontRolesModule } from "./front/frontroles.module";

@Module({
    imports: [AdminRolesModule,FrontRolesModule]
})
export class RolesModule {}