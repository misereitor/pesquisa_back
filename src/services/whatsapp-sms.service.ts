import { config } from 'dotenv';
import { ConfirmedPhone } from '../model/login-user-vote';
import { UserVote } from '../model/user-vote';
import { createConfirmedLogin } from '../repository/login-user-vote';
config();
const { WHATSAPP_API_URL, WHATSAPP_X_APY_KEY, WHATSAPP_SESSION } = process.env;

export async function createCode(user: UserVote) {
  try {
    const date = new Date();
    const expiration_date = new Date(date.setHours(date.getHours() + 24));
    const code = Math.random().toString().substring(2, 8);
    const confirmedLogin: ConfirmedPhone = {
      id: 0,
      phone: user.phone,
      id_user_vote: user.id,
      expiration_date,
      code
    };
    await createConfirmedLogin(confirmedLogin);
    return code;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function sendMessage(code: string, phone: string) {
  const codeEdit = `${code.substring(0, 3)}-${code.substring(3, 6)}`;
  const message = `Seu código de confirmação é para os melhores do ano é: ${codeEdit}`;
  try {
    const checkNumberIsWhatsapp = await fetch(
      `${WHATSAPP_API_URL}/api/contacts/check-exists?phone=${phone}&session=${WHATSAPP_SESSION}`,
      {
        headers: {
          'X-API-KEY': String(WHATSAPP_X_APY_KEY)
        }
      }
    );
    if (checkNumberIsWhatsapp.ok) {
      const data = await checkNumberIsWhatsapp.json();
      if (data.numberExists) {
        await sendMessageWhatsapp(data.chatId, message);
        return;
      }
    }
    throw new Error('Número de whastapp invalido!');
  } catch (error: any) {
    throw new Error(error.message);
  }
}

async function sendMessageWhatsapp(phone: string, message: string) {
  const input = {
    chatId: phone,
    text: message,
    session: WHATSAPP_SESSION
  };
  await fetch(`${WHATSAPP_API_URL}/api/sendText`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': String(WHATSAPP_X_APY_KEY)
    },
    body: JSON.stringify(input)
  });
}
