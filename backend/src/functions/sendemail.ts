import resend from '../clients/resend';
import mails from './mails';

async function sendMail(email: string, name: string, token: string) {
    const mail = mails.waitlist(name, token);

    const response = await resend.emails.send({
        from: `Memed.Fun <${process.env.EMAIL}>`,
        to: [email],
        subject: mail.subject,
        html: mail.html,    
    });
    return response;
}

export default sendMail;