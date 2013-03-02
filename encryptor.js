var encrpytor = (function() {

	var pubKey = null,
		privKey = null,
		sesskey = null,
		keyMat = null;

	var encrpytor = function(){
		openpgp.init();
	};

	encrpytor.prototype = {
		constructor: encrpytor,
		generateKeys: function(strength, password) {
			var keyPair = openpgp.generate_key_pair(1, strength, 'openpgp-test', password);
			pubKey = openpgp.read_publicKey(keyPair.publicKeyArmored);
			privKey = openpgp.read_privateKey(keyPair.privateKeyArmored);
			console.log(keyPair);
		},
		encryptMsg: function(message) {
			var ciphertext = openpgp.write_encrypted_message(pubKey, message);
			return ciphertext;
		},
		decryptMsg: function(encMsg, password) {
			var msg = openpgp.read_message(encMsg);
			
			for (var i = 0; i< msg[0].sessionKeys.length; i++) {
				if (privKey[0].privateKeyPacket.publicKey.getKeyId() == msg[0].sessionKeys[i].keyId.bytes) {
					keyMat = { key: privKey[0], keymaterial: privKey[0].privateKeyPacket};
					sesskey = msg[0].sessionKeys[i];
					break;
				}
				for (var j = 0; j < privKey[0].subKeys.length; j++) {
					if (privKey[0].subKeys[j].publicKey.getKeyId() == msg[0].sessionKeys[i].keyId.bytes) {
						keyMat = { key: privKey[0], keymaterial: privKey[0].subKeys[j]};
						sesskey = msg[0].sessionKeys[i];
						break;
					}
				}
			}

			if (keyMat != null) {
				if (!keyMat.keymaterial.decryptSecretMPIs(password)) {
					//util.print_error("Password for secrect key was incorrect!");
					return;
				}
			}
			
			var decryptMsg = msg[0].decrypt(keyMat, sesskey);
			return decryptMsg;
		}
	};

	return encrpytor;
})();