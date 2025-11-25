import api from './api';

class BiometricService {
  // Check if biometric authentication is available
  isBiometricAvailable() {
    return (
      window.PublicKeyCredential &&
      navigator.credentials &&
      typeof navigator.credentials.create === 'function'
    );
  }

  // Register biometric credentials
  async registerBiometric(userId) {
    try {
      if (!this.isBiometricAvailable()) {
        throw new Error('Biometric authentication is not supported on this device');
      }

      // Get challenge from server
      const challengeResponse = await api.post('/biometric/register/challenge', {
        userId,
      });

      const { challenge, userId: userIdFromServer } = challengeResponse.data;

      // Create credentials
      const credential = await navigator.credentials.create({
        publicKey: {
          challenge: this.base64ToArrayBuffer(challenge),
          rp: {
            name: 'Attendance System',
            id: window.location.hostname,
          },
          user: {
            id: this.base64ToArrayBuffer(userIdFromServer),
            name: userId,
            displayName: userId,
          },
          pubKeyCredParams: [
            { alg: -7, type: 'public-key' },
            { alg: -257, type: 'public-key' },
          ],
          authenticatorSelection: {
            authenticatorAttachment: 'platform',
            requireResidentKey: false,
            userVerification: 'required',
          },
          timeout: 60000,
          attestation: 'direct',
        },
      });

      // Send credential to server
      const response = await api.post('/biometric/register', {
        userId,
        credential: {
          id: credential.id,
          rawId: this.arrayBufferToBase64(credential.rawId),
          response: {
            attestationObject: this.arrayBufferToBase64(
              credential.response.attestationObject
            ),
            clientDataJSON: this.arrayBufferToBase64(
              credential.response.clientDataJSON
            ),
          },
          type: credential.type,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error registering biometric:', error);
      throw error;
    }
  }

  // Authenticate with biometric
  async authenticateBiometric(userId) {
    try {
      if (!this.isBiometricAvailable()) {
        throw new Error('Biometric authentication is not supported on this device');
      }

      // Get challenge from server
      const challengeResponse = await api.post('/biometric/authenticate/challenge', {
        userId,
      });

      const { challenge, allowCredentials } = challengeResponse.data;

      // Get assertion
      const assertion = await navigator.credentials.get({
        publicKey: {
          challenge: this.base64ToArrayBuffer(challenge),
          allowCredentials: allowCredentials.map((cred) => ({
            id: this.base64ToArrayBuffer(cred.id),
            type: 'public-key',
          })),
          timeout: 60000,
          userVerification: 'required',
        },
      });

      // Verify with server
      const response = await api.post('/biometric/authenticate', {
        userId,
        assertion: {
          id: assertion.id,
          rawId: this.arrayBufferToBase64(assertion.rawId),
          response: {
            authenticatorData: this.arrayBufferToBase64(
              assertion.response.authenticatorData
            ),
            clientDataJSON: this.arrayBufferToBase64(
              assertion.response.clientDataJSON
            ),
            signature: this.arrayBufferToBase64(assertion.response.signature),
            userHandle: assertion.response.userHandle
              ? this.arrayBufferToBase64(assertion.response.userHandle)
              : null,
          },
          type: assertion.type,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error authenticating with biometric:', error);
      throw error;
    }
  }

  // Clock in with biometric
  async clockInWithBiometric(userId) {
    try {
      const authResult = await this.authenticateBiometric(userId);
      if (authResult.verified) {
        const response = await api.post('/attendance/clock-in-biometric', {
          userId,
        });
        return response.data;
      }
      throw new Error('Biometric verification failed');
    } catch (error) {
      console.error('Error clocking in with biometric:', error);
      throw error;
    }
  }

  // Clock out with biometric
  async clockOutWithBiometric(userId) {
    try {
      const authResult = await this.authenticateBiometric(userId);
      if (authResult.verified) {
        const response = await api.post('/attendance/clock-out-biometric', {
          userId,
        });
        return response.data;
      }
      throw new Error('Biometric verification failed');
    } catch (error) {
      console.error('Error clocking out with biometric:', error);
      throw error;
    }
  }

  // Remove biometric credentials
  async removeBiometric(userId, credentialId) {
    try {
      const response = await api.delete(`/biometric/${userId}/credentials/${credentialId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing biometric:', error);
      throw error;
    }
  }

  // Get registered biometric devices
  async getRegisteredDevices(userId) {
    try {
      const response = await api.get(`/biometric/${userId}/devices`);
      return response.data;
    } catch (error) {
      console.error('Error fetching registered devices:', error);
      throw error;
    }
  }

  // Helper: Convert base64 to ArrayBuffer
  base64ToArrayBuffer(base64) {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  // Helper: Convert ArrayBuffer to base64
  arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }
}

export default new BiometricService();
