const SibApiV3Sdk = require("sib-api-v3-sdk");

const client = SibApiV3Sdk.ApiClient.instance;
client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

const sendOTPEmail = async (toEmail, otp) => {
  const email = {
    sender: { email: "amberbagchi.work@gmail.com", name: "Expense AI" },
    to: [{ email: toEmail }],
    subject: "Password Reset OTP",
   htmlContent: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>

<body style="margin:0; padding:0; background:linear-gradient(135deg,#667eea,#764ba2); font-family:Segoe UI,Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
    <tr>
      <td align="center">

        <!-- Card Container -->
        <table width="420" cellpadding="0" cellspacing="0"
          style="background:rgba(255,255,255,0.15);
                 backdrop-filter:blur(12px);
                 border-radius:18px;
                 padding:32px;
                 color:white;
                 box-shadow:0 10px 35px rgba(0,0,0,0.25);">

          <!-- Logo / Title -->
          <tr>
            <td align="center" style="font-size:22px; font-weight:600; padding-bottom:10px;">
              💰 Expense Tracker
            </td>
          </tr>

          <!-- Heading -->
          <tr>
            <td align="center" style="font-size:18px; padding-bottom:18px;">
              Password Reset Request
            </td>
          </tr>

          <!-- Message -->
          <tr>
            <td align="center" style="font-size:14px; line-height:1.6; padding-bottom:20px;">
              We received a request to reset your password.  
              Use the OTP below to continue.
            </td>
          </tr>

          <!-- OTP Box -->
          <tr>
            <td align="center" style="padding-bottom:22px;">
              <div style="
                display:inline-block;
                background:white;
                color:#764ba2;
                font-size:28px;
                font-weight:bold;
                letter-spacing:4px;
                padding:14px 26px;
                border-radius:12px;
                box-shadow:0 6px 18px rgba(0,0,0,0.2);
              ">
                ${otp}
              </div>
            </td>
          </tr>

          <!-- Expiry -->
          <tr>
            <td align="center" style="font-size:13px; opacity:0.9; padding-bottom:20px;">
              This OTP will expire in
              <strong>${process.env.OTP_EXPIRE_MINUTES} minutes</strong>.
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="border-top:1px solid rgba(255,255,255,0.25); padding-top:16px;"></td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="font-size:12px; opacity:0.8; line-height:1.5;">
              If you didn’t request this, you can safely ignore this email.  
              <br/><br/>
              © ${new Date().getFullYear()} Expense Tracker
            </td>
          </tr>

        </table>
        <!-- End Card -->

      </td>
    </tr>
  </table>

</body>
</html>
`

  };

  await apiInstance.sendTransacEmail(email);
};

module.exports = { sendOTPEmail };
