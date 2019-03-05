## Payments Dapp

Payments is a Reference Dapp for [Mainframe OS](https://github.com/MainframeHQ/mainframe-os).
It showcases several aspects of Mainframe OS integration including:

- Current wallet and network context
- Connecting with other Mainframe OS users and accessing those contacts from the dapp
- Interacting directly with the integrated web3 provider
- Making permissioned external https requests to firebase
- Sending Payments through the payments `sdk.payments.payContact()` API

## Getting Started

Clone this repo, install dependencies, and build the project

    $ git clone git@github.com:MainframeHQ/payments.git
    $ cd payments
    $ npm install
    $ npm run build

## Install and Run Dapp in Mainframe OS

Follow [instructions](http://docs.mainframe.com) to install and run Mainframe OS (either from source or from binary installer)

- In Mainframe OS, navigate to `More > App Developer Tools`
- If you haven't already, create a new Developer Identity. Specify the name under which you want your dapps to appear after they are published (i.e. your company name).
- Click + to Add a new dapp.
- Give your dapp a name and version number, then navigate to the build folder generated above. Continue.
- Specify required and optional permissions for your dapp. For Payments, this includes
  - Make transactions to Ethereum blockchain (required)
  - Read data from users contacts (required)
  - Whitelisted HTTPS Requests to `mainframe-paymo.firebaseio.com` and `s-usc1c-nss-245.firebaseio.com`
- Next. Save.
- Your dapp should appear in your `My Apps` list with a generated blockies icon.
- Click icon to view details
- Click `Open` to run the dapp inside Mainframe OS. This loads the version from the referenced `build` folder.

## Debugging Dapp in Mainframe OS

- Serve the dapp locally using `$ npm run start`
- In Mainframe OS App window, change the Content Path to `http://localhost:3000`
- Make changes to App.js and see them reflected in App window
- Use built-in Chromium developer tools to view source and debug

## Mainframe SDK integration

See [Mainframe SDK Documentation](https://docs.mainframe.com/docs/sdk) for full description of available APIs.

Mainframe SDK is already included in `package.json`, and therefore was installed with `npm install` above.

#### Instantiate new MainframeSDK object

In App.js:

    const sdk = new MainframeSDK();
    this.setState({ web3: web3, mainframe: sdk });

#### Get current wallet address

In App.js:

    const account = this.state.mainframe.ethereum.selectedAccount;

#### Get current network

In App.js:

    const network = this.state.mainframe.ethereum.networkVersion;

#### Respond to events when user changes current wallet

Users can change the currently selected wallet address using the wallet drop-down at the top right corner of the trusted UI.

In app.js:

    // check for account updates
    sdk.ethereum.on('accountsChanged', accounts => {
        this.getBlockchainData();
    });

#### Respond to events when user changes current network

Users can change the Ethereum network through the access point at `Mainframe OS > More > Network`.
The currently selected network is displayed in the Trusted UI at the top of the App window.

In app.js:

    // check for network updates
    sdk.ethereum.on('networkChanged', network => {
        this.getBlockchainData();
    });

#### Select contact

In TransactionModal.js:

    const contact = await this.props.mainframe.contacts.selectContact();

This prompts the contact selector to open from the Trusted UI along the top of the window.
Once the user chooses a contact, the function returns with profile information for the selected contact.

#### Get Contact ID, Name and ETH address for selected contact

In TransactionModal.js:

    contact.id
    contact.data.profile.name
    contact.data.profile.ethAddress

#### Get and use integrated web3 provider

In getWeb3.js:

    const web3 = new Web3(MainframeSDKInstance.ethereum.web3Provider);

In TransactionModal.js:

    const balance = this.props.web3.utils.fromWei(resolved, 'ether');

#### Send Payment to a Contact

In App.js `sendPayment()`:

    const paymentParams = {
      contactID: contactID,
      currency: currency,
      value: amount,
    };

In App.js `handlePayment()`:

    const res = await this.state.mainframe.payments.payContact(paymentParams);

## External HTTP Requests to Firebase

- Setup firebase configuration (keys, url, project, etc) in firebaseConfig.js (see firebaseConfig-sample.js).
- database initialized and `base` class configured and setup in base.js.
- See App.js `writeToFirebase()` for firebase write transaction
- See Transactions.js `componentDidUpdate()` for firebase read/listenTo transaction

When you application makes external HTTPS requests, the user will be notified and have to give permission. This will happen
at the point of need, unless the URLs were already whitelisted and the permissions already granted when the app was installed.
See additional information regarding setting up install permissions above under `Install and Run Dapp in Mainframe OS`.

## Other Resources

This project was bootstrapaped with [Create React App](create-react-app.md).
