import QRCode from 'qrcode';

export const generateQRCode = async (url, options = {}) => {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(url, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      ...options
    });
    return qrCodeDataURL;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
};

export const downloadQRCode = (dataURL, filename = 'menu-qr-code') => {
  const link = document.createElement('a');
  link.download = `${filename}.png`;
  link.href = dataURL;
  link.click();
};