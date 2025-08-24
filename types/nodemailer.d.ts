declare module 'nodemailer' {
  export interface Transporter {
    sendMail(options: SendMailOptions): Promise<any>
  }
  export interface SendMailOptions {
    from?: string
    to: string
    subject: string
    text?: string
    html?: string
  }
  export function createTransport(options: any): Transporter
}
