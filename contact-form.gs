function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const { name, email, message } = data;

    // Professional Green Theme - Fully Responsive Template
    const htmlTemplate = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Message</title>
  <style>
    @media only screen and (max-width: 600px) {
      .container {
        margin: 20px auto !important;
        max-width: 95% !important;
      }
      .content-padding {
        padding: 30px 25px !important;
      }
      .header-title {
        font-size: 24px !important;
      }
      .sender-info {
        flex-direction: column !important;
        align-items: flex-start !important;
      }
      .sender-divider {
        display: none !important;
      }
      .sender-email {
        margin-top: 8px !important;
      }
      .action-button {
        padding: 16px 28px !important;
        font-size: 14px !important;
      }
      .footer-padding {
        padding: 25px 20px !important;
      }
    }
    
    @media only screen and (max-width: 480px) {
      .container {
        margin: 15px auto !important;
        border-radius: 16px !important;
      }
      .content-padding {
        padding: 25px 20px !important;
      }
      .header-title {
        font-size: 22px !important;
      }
      .message-content {
        padding: 20px !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6;">
  <div class="container" style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 40px -12px rgba(156, 189, 9, 0.15);">
    
    <!-- Accent Line -->
    <div style="height: 4px; background: linear-gradient(90deg, #9cbd09 0%, #b8d42e 100%);"></div>
    
    <div class="content-padding" style="padding: 50px 40px;">
      <!-- Header -->
      <div style="margin-bottom: 40px; text-align: left;">
        <span style="background: rgba(156, 189, 9, 0.1); color: #7a9a07; padding: 8px 16px; border-radius: 99px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; display: inline-block;">
          Message Received
        </span>
        <h1 class="header-title" style="color: #111111; font-size: 32px; font-weight: 800; margin: 20px 0 0; letter-spacing: -0.5px;">
          New Connection.
        </h1>
      </div>

      <!-- Sender Info -->
      <div style="margin-bottom: 40px; padding-bottom: 30px; border-bottom: 1px solid #f3f4f6;">
        <p style="color: #6b7280; font-size: 13px; margin: 0 0 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
          From
        </p>
        <div class="sender-info" style="display: flex; align-items: center; flex-wrap: wrap;">
          <p style="color: #111111; font-size: 18px; font-weight: 600; margin: 0;">
            ${name}
          </p>
          <span class="sender-divider" style="color: #9ca3af; margin: 0 12px; font-weight: 300;">•</span>
          <a href="mailto:${email}" class="sender-email" style="color: #9cbd09; text-decoration: none; font-size: 15px; font-weight: 500; word-break: break-all;">
            ${email}
          </a>
        </div>
      </div>

      <!-- Message -->
      <div style="margin-bottom: 40px;">
        <p style="color: #6b7280; font-size: 13px; margin: 0 0 15px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
          The Message
        </p>
        <div class="message-content" style="background: #f9fafb; border-left: 4px solid #9cbd09; padding: 25px; border-radius: 4px 16px 16px 4px; border: 1px solid #f3f4f6;">
          <p style="color: #374151; font-size: 16px; line-height: 1.7; margin: 0; word-wrap: break-word;">
            ${message}
          </p>
        </div>
      </div>

      <!-- Action Button -->
      <div style="text-align: center; margin-bottom: 20px;">
        <a href="mailto:${email}" class="action-button" style="display: inline-block; background: #9cbd09; color: #ffffff; padding: 18px 35px; border-radius: 14px; text-decoration: none; font-weight: 700; font-size: 15px; box-shadow: 0 10px 20px -5px rgba(156, 189, 9, 0.3); transition: all 0.3s ease;">
          Reply Instantly
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer-padding" style="padding: 30px 40px; background-color: #f9fafb; text-align: center; border-top: 1px solid #f3f4f6;">
      <p style="color: #6b7280; font-size: 12px; margin: 0; line-height: 1.5;">
        Sent via your Professional Portfolio System • ${new Date().getFullYear()}
      </p>
      <p style="color: #9ca3af; font-size: 11px; margin: 8px 0 0;">
        This message was sent from your contact form at ${new Date().toLocaleString()}
      </p>
    </div>
  </div>

  <!-- Fallback for very old email clients -->
  <!--[if mso]>
  <style>
    .container { width: 600px !important; }
    .content-padding { padding: 40px !important; }
  </style>
  <![endif]-->
</body>
</html>`;

    // Send email with the responsive template
    GmailApp.sendEmail(
      'jezermantilla263026@gmail.com',
      `🌟 New Portfolio Message: ${name}`,
      `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      {
        htmlBody: htmlTemplate,
        name: 'Portfolio Contact System'
      }
    );

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: false, 
        error: error.toString() 
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return HtmlService.createHtmlOutput(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          background: #f5f5f5;
          color: #9cbd09;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          margin: 0;
          padding: 20px;
          box-sizing: border-box;
        }
        .status-container {
          background: white;
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(156, 189, 9, 0.1);
          border: 1px solid #e5e7eb;
          max-width: 400px;
          width: 100%;
        }
        .status-icon {
          font-size: 48px;
          margin-bottom: 20px;
          display: block;
        }
        .status-title {
          color: #111111;
          font-size: 24px;
          font-weight: 600;
          margin: 0;
        }
        .status-subtitle {
          color: #6b7280;
          font-size: 14px;
          margin: 10px 0 0;
        }
        @media (max-width: 480px) {
          .status-container {
            padding: 30px 20px;
          }
          .status-icon {
            font-size: 40px;
          }
          .status-title {
            font-size: 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="status-container">
        <span class="status-icon">🌟</span>
        <h1 class="status-title">Contact System Active</h1>
        <p class="status-subtitle">Ready to receive messages</p>
      </div>
    </body>
    </html>
  `);
}