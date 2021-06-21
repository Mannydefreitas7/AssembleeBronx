
import * as nodemailer from 'nodemailer';
import { MailOptions } from "nodemailer/lib/json-transport";


export const sendEmail = (message: MailOptions) => {
    return new Promise((resolve, reject) => {
    
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            port: 465,
            secure: true,
            logger: true,
            debug: true,
            auth: {
                user: 'assemblee.app@gmail.com',
                pass: 'lufamulhqpcimijt'
            },
            tls: {
                rejectUnauthorized: true
            }
        });

        transporter.verify((error, success) => {
            if (error) {
              console.log(error);
              reject(error)
            } else {
              return transporter.sendMail(message).then(() => resolve(success))
            }
            return error.message;
          });

    })
}
