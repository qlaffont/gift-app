import { Sendim } from 'sendim';
import { SendimSendinblueProvider, SendimSendinblueProviderConfig } from 'sendim-sendinblue';

const sendim: Sendim = global.sendim || new Sendim();

if (!global.sendim) {
  sendim.addTransport<SendimSendinblueProviderConfig>(SendimSendinblueProvider, {
    apiKey: process.env.SENDINBLUE_APIKEY!,
  });
  global.sendim = sendim;
}

export default sendim;
