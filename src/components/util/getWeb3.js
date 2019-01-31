import Web3 from 'web3';

const getWeb3 = MainframeSDKInstance =>
  new Promise((resolve, reject) => {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener('load', async () => {
      if (MainframeSDKInstance) {
        const web3 = new Web3(MainframeSDKInstance.blockchain.web3Provider);
        resolve(web3);
      }
    });
  });

export default getWeb3;
