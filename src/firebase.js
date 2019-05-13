import firebase from 'firebase/app'
import 'firebase/database'
import FIREBASE_CONFIG from './firebaseConfig'

firebase.initializeApp(FIREBASE_CONFIG)

export const db = firebase.database()
export const getData = (account, network, cb) =>
  db
    .ref(`/account_transactions/${account.toLowerCase()}/${network}`)
    .on('value', snapshot => {
      if (snapshot) {
        cb(snapshot.val())
      } else {
        cb(null)
      }
    })

export const writeTransaction = (
  account,
  network,
  hash,
  transactionData,
  recipient,
) => {
  const timestamp = Date.now() / 1000

  const data = {
    ...transactionData,
    hash,
    timestamp,
  }

  const senderUrl = `/account_transactions/${account.toLowerCase()}/${network}/${hash}`
  const recipientUrl = `/account_transactions/${recipient.toLowerCase()}/${network}/${hash}`

  const updates = {
    [senderUrl]: data,
    [recipientUrl]: data,
  }
  return db.ref().update(updates)
}
