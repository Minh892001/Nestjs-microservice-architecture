import { MailerService } from '@nestjs-modules/mailer';
import { Body, Controller, Post, Query } from '@nestjs/common';
import { EmailInputDto } from '../dtos/email-input.dto';

@Controller('email')
export class EmailController {
  constructor(private mailService: MailerService) {}

  @Post('send-email')
  async sendEmail(
    @Query('toEmail') toEmail: string,
    @Query('fromEmail') fromEmail: string,
    @Body() emailInputDto: EmailInputDto,
  ): Promise<void> {
    await this.mailService.sendMail({
      to: toEmail,
      from: fromEmail,
      subject: emailInputDto.subject,
      html:
        `<p>Welcome, ${emailInputDto.name} !!!<p>` +
        'We have received your request to reset your password.</p><p>Click or copy and paste the following URL and follow the instructions to reset your password. If you do not reset your password within 24 hours, this URL will no longer be valid and you will need to request to reset your password again.</p>' +
        `<p>${emailInputDto.content}</p>` +
        '<p>If you have any questions regarding your account sign-in and username, please contact our Support.</p><br/>',
    });
  }
}
