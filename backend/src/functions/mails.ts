const mails = {
    waitlist: (name:string, token:string) => {
      return {
              subject: `✅ You’re on the Memed.fun Waitlist – Verify to Secure Your Spot`,
              html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f7f9fc; padding: 40px 20px;">
                  <div style="max-width: 600px; margin: auto; background: white; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.05); overflow: hidden;">
                    <div style="background: linear-gradient(to right, #6c47ff, #9945ff); padding: 24px;">
                      <h1 style="margin: 0; color: #fff; font-size: 24px;">🎉 Welcome to Memed.fun</h1>
                    </div>
                    <div style="padding: 32px;">
                      <h2 style="margin-top: 0; color: #333;">Hey ${name} 👋</h2>
                      <p style="font-size: 16px; line-height: 1.6; color: #444;">
                        You're on the waitlist for <strong>Memed.fun</strong> – where memes meet the blockchain.
                      </p>
                      <p style="font-size: 16px; color: #444;">
                        To lock your spot and get early access, just verify your email below:
                      </p>
                      <div style="text-align: center; margin: 30px 0;">
                        <a href="${process.env.FRONTEND_URL}/verify?token=${token}" style="background: #6c47ff; color: white; font-size: 16px; padding: 14px 28px; border-radius: 8px; text-decoration: none; display: inline-block; font-weight: 600;">
                          ✅ Verify My Email
                        </a>
                      </div>
                      <p style="font-size: 14px; color: #888;">Or copy this link into your browser:</p>
                      <p style="font-size: 14px; word-break: break-all; color: #6c47ff;">${process.env.FRONTEND_URL}/verify?token=${token}</p>
                      <hr style="margin: 40px 0; border: none; border-top: 1px solid #eee;" />
                      <p style="font-size: 13px; color: #999; text-align: center;">
                        © 2025 Memed.fun • All Rights Reserved
                      </p>
                    </div>
                  </div>
                </div>
              `,
            }
          }
      }

export default mails;