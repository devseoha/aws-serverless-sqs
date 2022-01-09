import { initializeApp } from 'firebase-admin/app';
import { credential, messaging } from "firebase-admin";
import { driverServiceAccount } from './firebase.js';
import middy from '@middy/core'

initializeApp({
    credential: credential.cert(driverServiceAccount),
    databaseURL: ""
});

const sendPush = async (event, context) => {
    let { title, token, content, badgeCnt, targetId, pushId} = JSON.parse(event.Records[0].body);
    // let { title, token, content, badgeCnt, targetId, pushId } = event;

    const message = {
        apns: {
            payload: {
                aps: {
                    'mutable-content': 1,
                    badge: badgeCnt,
                    contentAvailable: true,
                    priority: 'high',
                },
            },
        },
        notification:{
            title: title,
            body: content
        },
        data:{
            title: title,
            badge: badgeCnt.toString(),
            pushId: pushId.toString()
        },
        token: token
    }

    return await messaging().send(message)
        .then(async function(response) {
            console.log('메세지 발송 성공', response);
            return true;
        })
        .catch(async function (err) {
            console.log('메세지 발송 에러', err);
            return true;
        })
}

const handler = middy(sendDriverPush);

module.exports = { handler }