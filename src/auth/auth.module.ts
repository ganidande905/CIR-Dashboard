import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from 'src/database/database.module';
import { JwtStrategy } from './jwt.strategy';
import { EmployeesModule } from 'src/employees/employees.module';


if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined');
}

export const jwtSecret = process.env.JWT_SECRET;



@Module({
   imports: [
    DatabaseModule,
    PassportModule,
    JwtModule.register({
      secret: jwtSecret,
      signOptions: { expiresIn: '30m' }, // e.g. 30s, 7d, 24h
    }),
    EmployeesModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
