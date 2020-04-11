/*
* Encryption - Criptografa e descriptografa uma string, responsavel por gerar as 
* hash das senhas dos users 
*
* @author Marc Reinan Gomes Dantas do Nascimento
*/

'use strict';
const crypto = require('crypto'); // Import Crypto
const ENCRYPTION_KEY = process.env.SECRET; //Pega a chave de encriptação

/*
* encrypt - Encripta uma string e retorna o hash correspondente
*
*/
function encrypt(text) {
  let iv = process.env.IV;
  let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text);

  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return iv.toString('hex') + '' + encrypted.toString('hex');
}
/*
function decrypt(text) {
  let textParts = text.split(':');
  let iv = Buffer.from(textParts.shift(), 'hex');
  let encryptedText = Buffer.from(textParts.join(':'), 'hex');
  let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let decrypted = decipher.update(encryptedText);

  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
}
*/

module.exports = { encrypt };