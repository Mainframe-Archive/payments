import Web3 from 'web3';
import MainframeSDK from '@mainframe/sdk';

const getWeb3 = () =>
  new Promise((resolve, reject) => {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener('load', async () => {
      console.log(window);
      // Metamask

      const sdk = new MainframeSDK();
      if (sdk) {
        console.log(sdk);
        const provider = sdk.blockchain.getWeb3Provider();
        console.log(provider);
        const web3 = new Web3(provider);
        resolve(web3);
      }
    });
  });

export default getWeb3;
