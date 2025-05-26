// import {
//   Injectable,
//   BadRequestException,
//   Logger,
//   UnauthorizedException,
//   ForbiddenException,
// } from '@nestjs/common';
// import { TenantContextService } from '@kafaat-systems/tenant-context';
// import { getTenantDataSource } from '@kafaat-systems/database';
// import { TokenService } from './service/temp-token.service';
// import * as bcrypt from 'bcrypt';
// import { MobileDeviceEntity, UserEntity } from '@kafaat-systems/entities';
// import { SetPasswordDto } from './dto/set-password.dto';
// import { JwtService } from '@nestjs/jwt';
// import { jwtConstants } from './strategies/jwt.constants.strategy';
// import { EmailService } from './service/email.service';
// import { ResetPasswordDto } from './dto/reset-password.dto';
// import { RegisterDeviceDto } from './dto/register-device.dto';
// import { Request } from 'express';
// import * as base64 from 'base-64';
// @Injectable()
// export class AuthService {
//   constructor(
//     private readonly tenantContextService: TenantContextService,
//     private readonly tokenService: TokenService,
//     private jwtService: JwtService,
//     private readonly emailService: EmailService
//   ) {}

//   async setPassword(dto: SetPasswordDto) {
//     try {
//       const schema = this.tenantContextService.getSchema();
//       const tenantDS = await getTenantDataSource(schema);
//       Logger.log(schema);

//       const resetToken = await this.tokenService.validateToken(dto.token, tenantDS);
//       Logger.log(resetToken);

//       if (!resetToken) {
//         throw new BadRequestException('Invalid or expired token');
//       }

//       const userRepo = tenantDS.getRepository(UserEntity);

//       const admin = await userRepo.findOne({
//         where: { id: resetToken.adminId },
//       });

//       if (!admin) {
//         throw new BadRequestException('Admin not found');
//       }

//       const passwordHash = await bcrypt.hash(dto.password, 10);
//       admin.passwordHash = passwordHash;
//       admin.isActive = true;

//       await userRepo.save(admin);
//       await this.tokenService.deleteToken(dto.token, tenantDS);

//       return { message: 'Password set successfully' };
//     } catch (error) {
//       Logger.log(error);
//       throw new BadRequestException('something went wrong');
//     }
//   }
//   async validateToken(token: string) {
//     const schema = this.tenantContextService.getSchema();
//     const tenantDS = await getTenantDataSource(schema);
//     Logger.log(schema);

//     const resetToken = await this.tokenService.validateToken(token, tenantDS);
//     Logger.log(resetToken);

//     if (!resetToken) {
//       throw new BadRequestException('Invalid or expired token');
//     }
//     return true;
//   }
//   async resetPassword(dto: ResetPasswordDto) {
//     const userEmail = dto.email;
//     const durationPerMinutes = 15;
//     const TokenDuratuon = durationPerMinutes * 60 * 1000;

//     const domain = userEmail.split('@')[1].split('.')[0].toLowerCase();

//     const tenantDS = await getTenantDataSource(domain);
//     const userRepo = tenantDS.getRepository(UserEntity);

//     const user = await userRepo.findOne({
//       where: { email: userEmail },
//     });
//     if (!user) {
//       throw new BadRequestException('user not found');
//     }
//     if (!user.isActive) {
//       throw new BadRequestException('user is not activate');
//     }
//     const resetToken = await this.tokenService.createResetToken(user?.id, tenantDS, TokenDuratuon);

//     const expiresAt = new Date();
//     expiresAt.setTime(expiresAt.getTime() + TokenDuratuon);

//     await this.emailService.sendSetPasswordEmail({
//       to: user.email,

//       ClientName: `${user.firstName} ${user.lastName}`,
//       expiryDate: expiresAt.toString(),
//       url: `https://${domain}.${process.env.NEXT_PUBLIC_API_URL_HR}/set-password?token=${resetToken?.plainToken}`,
//       operating_system: 'Web',
//       browser_name: 'Any',
//       button_text: 'Set Password',
//       support_url: 'support.kbs.sa',
//       product_name: 'KAFAAT SYSTEMS',
//     });
//     return {
//       success: true,
//       message: `reset email sent to ${userEmail} .`,
//       tenant: {
//         email: userEmail,
//         // token: resetToken,
//         expiresAt: expiresAt,
//         datanow: new Date(),
//         // date: new Date().getDate() + TokenDuratuon,
//       },
//     };
//   }
//   async registeredDevice(userId: string, dto: RegisterDeviceDto) {
//     const schema = this.tenantContextService.getSchema();
//     const tenantDS = await getTenantDataSource(schema);

//     const userRepo = tenantDS.getRepository(UserEntity);
//     const deviceRepo = tenantDS.getRepository(MobileDeviceEntity);

//     const user = await userRepo.findOne({ where: { id: userId }, relations: ['device'] });
//     if (!user) throw new BadRequestException('User not found');

//     if (user.device) {
//       if (dto.forceUpdate) {
//         // update existing device
//         user.device.deviceId = dto.deviceId;
//         user.device.model = dto.model;

//         await deviceRepo.save(user.device);
//         return { message: 'Device updated' };
//       } else {
//         if (user.device.deviceId == dto.deviceId) {
//           return { message: 'Device already registered', skipped: true };
//         } else {
//           throw new ForbiddenException('Not trusted device');
//         }
//       }
//     }
//     // create new device
//     dto.registeredAt = new Date();
//     const newDevice = deviceRepo.create({ ...dto, user });

//     try {
//       await deviceRepo.save(newDevice);
//     } catch (error) {
//       Logger.log(error);
//     }

//     return { message: 'Device created' };
//   }

//   async validateUser(email: string, pass: string, req?: Request): Promise<UserEntity | null> {
//     if (!email || !pass) {
//       throw new BadRequestException('Invalid email or password');
//     }

//     const schema = this.tenantContextService.getSchema();

//     const tenantDS = await getTenantDataSource(schema);
//     const userRepo = tenantDS.getRepository(UserEntity);

//     const user = await userRepo.findOne({ where: { email } });
//     if (!user) {
//       throw new BadRequestException('User not found');
//     }

//     if (!user.isActive) {
//       throw new ForbiddenException('Account is not active');
//     }
//     if (req?.headers['x-device-info']) {
//       const raw = String(req.headers['x-device-info']);
//       const json = JSON.parse(base64.decode(raw));
//       Logger.log(json, 'json');

//       await this.registeredDevice(user.id, json);
//     }
//     const validatePassword = await bcrypt.compare(pass, user.passwordHash);
//     if (!validatePassword) {
//       throw new UnauthorizedException('Invalid password');
//     }
//     return user;
//   }

//   async login(user: UserEntity) {
//     const payload = { email: user.email, sub: user.id, role: user.role };
//     return {
//       access_token: this.jwtService.sign(payload),
//       refresh_token: this.jwtService.sign(payload, {
//         expiresIn: jwtConstants.refreshIn,
//       }),
//       user: {
//         id: user.id,
//         email: user.email,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         role: user.role,
//         subdomain: user.schemaName,
//       },
//     };
//   }

//   async refresh(token: string) {
//     if (!token) {
//       throw new BadRequestException('Refresh token is required');
//     }
//     try {
//       const decoded = this.jwtService.verify(token, {
//         secret: jwtConstants.secret,
//       });

//       const schema = this.tenantContextService.getSchema();

//       const tenantDS = await getTenantDataSource(schema);

//       const userRepo = tenantDS.getRepository(UserEntity);

//       const user = await userRepo.findOne({ where: { id: decoded.sub } });
//       if (!user) throw new BadRequestException('error in refresh token');

//       return this.login(user);
//     } catch (error: unknown) {
//       throw new BadRequestException(
//         'something went wrong in refresh token: ' +
//           (error instanceof Error ? error.message : 'Unknown error')
//       );
//     }
//   }
// }
