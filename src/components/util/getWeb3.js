import Web3 from 'web3'

const getWeb3 = MainframeSDKInstance =>
  new Promise(resolve => {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener('load', async () => {
      if (MainframeSDKInstance) {
        const web3 = new Web3(MainframeSDKInstance.ethereum.web3Provider)
        resolve(web3)
      }
    })
  })

export default getWeb3
