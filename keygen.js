   openpgp.init()
   message='abcdefg';
   pass = 'abcde';
   genKey = null;
   encMsg = null;
   pubKey = null;
   privKey = null;

   function generateKeyPair(){
   	var keyPair = openpgp.generate_key_pair(1,1024,'pgptest', pass);
   	console.log(keyPair);
   	genKey = keyPair;
   	encrypt();
   }
   generateKeyPair();

   function encrypt(){
   	var publicKey = openpgp.read_publicKey(genKey.publicKeyArmored);
	//var privKey = openpgp.read_privateKey(genKey.privateKeyArmored);
	pubKey = publicKey;
	console.log(pubKey);
	var ciphertext = openpgp.write_encrypted_message(pubKey,message);
	console.log(ciphertext);
	encMsg = ciphertext;
	decrypt1();
}

function showMessages(text){
	console.log(text);
}

function decrypt1(){
	privKey = openpgp.read_privateKey(genKey.privateKeyArmored);
	// var msg = openpgp.read_message(encMsg)[0];
	// console.log(msg);
	var msg = openpgp.read_message(encMsg);
	var keymat = null;
	var sesskey = null;

	for (var i = 0; i< msg[0].sessionKeys.length; i++) {
		if (privKey[0].privateKeyPacket.publicKey.getKeyId() == msg[0].sessionKeys[i].keyId.bytes) {
			keymat = { key: privKey[0], keymaterial: privKey[0].privateKeyPacket};
			sesskey = msg[0].sessionKeys[i];
			break;
		}
		for (var j = 0; j < privKey[0].subKeys.length; j++) {
			if (privKey[0].subKeys[j].publicKey.getKeyId() == msg[0].sessionKeys[i].keyId.bytes) {
				keymat = { key: privKey[0], keymaterial: privKey[0].subKeys[j]};
				sesskey = msg[0].sessionKeys[i];
				break;
			}
		}
	}
	if (keymat != null) {
		if (!keymat.keymaterial.decryptSecretMPIs('abcde')) {//$('#decpassword').val()
			util.print_error("Password for secrect key was incorrect!");
			return;

		}
		console.log(msg[0].decrypt(keymat, sesskey));
	}
}