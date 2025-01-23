import { config } from 'dotenv';
import { ConfirmedPhone } from '../model/login-user-vote';
import { UserVote } from '../model/user-vote';
import { createConfirmedLogin } from '../repository/login-user-vote';
import { AppError } from '../util/errorHandler';
config();
const { WHATSAPP_API_URL, WHATSAPP_X_APY_KEY, WHATSAPP_SESSION } = process.env;

export async function createCode(user: UserVote) {
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
}

export async function sendMessage(code: string, phone: string) {
  const codeEdit = `${code.substring(0, 3)}-${code.substring(3, 6)}`;
  const message = `Código de validação para a pesquisa Melhores do Ano 2024: ${codeEdit}`;
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
    const checkNumberIsWhatsappTwo = await fetch(
      `${WHATSAPP_API_URL}/api/contacts/check-exists?phone=${'55' + phone}&session=${WHATSAPP_SESSION}`,
      {
        headers: {
          'X-API-KEY': String(WHATSAPP_X_APY_KEY)
        }
      }
    );
    const data2 = await checkNumberIsWhatsappTwo.json();
    if (checkNumberIsWhatsappTwo.ok) {
      if (data2.numberExists) {
        await sendMessageWhatsapp(data2.chatId, message);
        return;
      }
    }
  }
  throw new AppError('Número de whastapp invalido!', 404);
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
