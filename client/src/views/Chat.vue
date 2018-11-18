<template>
  <div>
    <h3>Chatting for authors</h3>
    <div id="user-container">
      <div hidden id="user-pic"></div>
      <div hidden id="user-name"></div>
      <button hidden id="sign-out" class="mdl-button mdl-js-button mdl-js-ripple-effect mdl-color-text--white">
        Sign-out
      </button>
      <button hidden id="sign-in" class="mdl-button mdl-js-button mdl-js-ripple-effect mdl-color-text--white">
        <i class="material-icons">account_circle</i>Sign-in with Google
      </button>
    </div>
    <main class="mdl-layout__content mdl-color--grey-100">
    <div id="messages-card-container" class="mdl-cell mdl-cell--12-col mdl-grid">

      <!-- Messages container -->
      <div id="messages-card" class="mdl-card mdl-shadow--2dp mdl-cell mdl-cell--12-col mdl-cell--6-col-tablet mdl-cell--6-col-desktop">
        <div class="mdl-card__supporting-text mdl-color-text--grey-600">
          <div id="messages">
            <span id="message-filler"></span>
          </div>
          <form id="message-form" action="#">
            <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
              <input class="mdl-textfield__input" type="text" id="message">
              <label class="mdl-textfield__label" for="message">Message...</label>
            </div>
            <button id="submit" disabled type="submit" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect">
              Send
            </button>
          </form>
          <form id="image-form" action="#">
            <input id="mediaCapture" type="file" accept="image/*" capture="camera">
            <button id="submitImage" title="Add an image" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-color--amber-400 mdl-color-text--white">
              <i class="material-icons">image</i>
            </button>
          </form>
        </div>
      </div>

      <div id="must-signin-snackbar" class="mdl-js-snackbar mdl-snackbar">
        <div class="mdl-snackbar__text"></div>
        <button class="mdl-snackbar__action" type="button"></button>
      </div>

    </div>
  </main>
  </div>
</template>

<script>
import firebase from '../assets/config.js'

export default {
  data() {
    return {
      messageListElement: document.getElementById('messages'),
      messageFormElement: document.getElementById('message-form'),
      messageInputElement: document.getElementById('message'),
      submitButtonElement: document.getElementById('submit'),
      imageButtonElement: document.getElementById('submitImage'),
      imageFormElement: document.getElementById('image-form'),
      mediaCaptureElement: document.getElementById('mediaCapture'),
      userPicElement: document.getElementById('user-pic'),
      userNameElement: document.getElementById('user-name'),
      signInButtonElement: document.getElementById('sign-in'),
      signOutButtonElement: document.getElementById('sign-out'),
      signInSnackbarElement: document.getElementById('must-signin-snackbar'),
    }
  },
  methods: {
    signIn() {
      var provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider);
    },
    signOut() {
      firebase.auth().signOut();
    },
    initFirebaseAuth() {
      firebase.auth().onAuthStateChanged(this.authStateObserver);
    },
    getProfilePicUrl() {
      return firebase.auth().currentUser.photoURL || '/images/profile_placeholder.png';
    },
    getUserName() {
      return firebase.auth().currentUser.displayName;
    },
    isUserSignedIn() {
      return !!firebase.auth().currentUser;
    },
    loadMessages() {
      var callback = function (snap) {
        var data = snap.val();
        console.log(snap.key, data.name, data.text, data.profilePicUrl, data.imageUrl)
        this.displayMessage(snap.key, data.name, data.text, data.profilePicUrl, data.imageUrl);
      };

      firebase.database().ref('/messages/').limitToLast(12).on('child_added', callback);
      firebase.database().ref('/messages/').limitToLast(12).on('child_changed', callback);
    },
    saveMessage(messageText) {
      return firebase.database().ref('/messages/').push({
        name: this.getUserName(),
        text: messageText,
        profilePicUrl: this.getProfilePicUrl()
      }).catch(function (error) {
        console.error('Error writing new message to Realtime Database:', error);
      });
    },
    saveImageMessage(file) {
      firebase.database().ref('/messages/').push({
        name: this.getUserName(),
        imageUrl: LOADING_IMAGE_URL,
        profilePicUrl: this.getProfilePicUrl()
      }).then(function (messageRef) {
        var filePath = firebase.auth().currentUser.uid + '/' + messageRef.key + '/' + file.name;
        return firebase.storage().ref(filePath).put(file).then(function (fileSnapshot) {
          return fileSnapshot.ref.getDownloadURL().then((url) => {
            return messageRef.update({
              imageUrl: url,
              storageUri: fileSnapshot.metadata.fullPath
            });
          });
        });
      }).catch(function (error) {
        console.error('There was an error uploading a file to Cloud Storage:', error);
      });
    },
    saveMessagingDeviceToken() {
      firebase.messaging().getToken().then(function (currentToken) {
        if (currentToken) {
          console.log('Got FCM device token:', currentToken);
          firebase.database().ref('/fcmTokens').child(currentToken)
            .set(firebase.auth().currentUser.uid);
        } else {
          this.requestNotificationsPermissions();
        }
      }).catch(function (error) {
        console.error('Unable to get messaging device token:', error);
      });
    },
    requestNotificationsPermissions() {
      console.log('Requesting notifications permission...');
      firebase.messaging().requestPermission().then(function () {
        this.saveMessagingDeviceToken();
      }).catch(function (error) {
        console.error('Unable to get permission to notify.', error);
      });
    },
    onMediaFileSelected(event) {
      event.preventDefault();
      var file = event.target.files[0];
      this.imageFormElement.reset();
      if (!file.type.match('image.*')) {
        var data = {
          message: 'You can only share images',
          timeout: 2000
        };
        this.signInSnackbarElement.MaterialSnackbar.showSnackbar(data);
        return;
      }
      if (checkSignedInWithMessage()) {
        this.saveImageMessage(file);
      }
    },
    onMessageFormSubmit(e) {
      e.preventDefault();
      if (this.messageInputElement.value && checkSignedInWithMessage()) {
        this.saveMessage(this.messageInputElement.value).then(function () {
          this.resetMaterialTextfield(this.messageInputElement);
          this.toggleButton();
        });
      }
    },
    authStateObserver(user) {
      if (user) { // User is signed in!
        var profilePicUrl = this.getProfilePicUrl();
        var userName = this.getUserName();
        this.userPicElement.style.backgroundImage = 'url(' + profilePicUrl + ')';
        this.userNameElement.textContent = userName;
        this.userNameElement.removeAttribute('hidden');
        this.userPicElement.removeAttribute('hidden');
        this.signOutButtonElement.removeAttribute('hidden');

        this.signInButtonElement.setAttribute('hidden', 'true');

        this.saveMessagingDeviceToken();
      } else { // User is signed out!
        this.userNameElement.setAttribute('hidden', 'true');
        this.userPicElement.setAttribute('hidden', 'true');
        this.signOutButtonElement.setAttribute('hidden', 'true');

        this.signInButtonElement.removeAttribute('hidden');
      }
    },
    checkSignedInWithMessage() {
      if (this.isUserSignedIn()) {
        return true;
      }
      var data = {
        message: 'You must sign-in first',
        timeout: 2000
      };
      this.signInSnackbarElement.MaterialSnackbar.showSnackbar(data);
      return false;
    },
    resetMaterialTextfield(element) {
      element.value = '';
      element.parentNode.MaterialTextfield.boundUpdateClassesHandler();
    },
    addSizeToGoogleProfilePic(url) {
      if (url.indexOf('googleusercontent.com') !== -1 && url.indexOf('?') === -1) {
        return url + '?sz=150';
      }
      return url;
    },
    displayMessage(key, name, text, picUrl, imageUrl) {
      var div = document.getElementById(key);
      // If an element for that message does not exists yet we create it.
      if (!div) {
        var container = document.createElement('div');
        container.innerHTML = MESSAGE_TEMPLATE;
        div = container.firstChild;
        div.setAttribute('id', key);
        this.messageListElement.appendChild(div);
      }
      if (picUrl) {
        div.querySelector('.pic').style.backgroundImage = 'url(' + this.addSizeToGoogleProfilePic(picUrl) + ')';
      }
      div.querySelector('.name').textContent = name;
      var messageElement = div.querySelector('.message');
      if (text) { // If the message is text.
        messageElement.textContent = text;
        // Replace all line breaks by <br>.
        messageElement.innerHTML = messageElement.innerHTML.replace(/\n/g, '<br>');
      } else if (imageUrl) { // If the message is an image.
        var image = document.createElement('img');
        image.addEventListener('load', function () {
          this.messageListElement.scrollTop = this.messageListElement.scrollHeight;
        });
        image.src = imageUrl + '&' + new Date().getTime();
        messageElement.innerHTML = '';
        messageElement.appendChild(image);
      }
      // Show the card fading-in and scroll to view the new message.
      setTimeout(function () {
        div.classList.add('visible')
      }, 1);
      this.messageListElement.scrollTop = this.messageListElement.scrollHeight;
      this.messageInputElement.focus();
    },
    toggleButton() {
      if (this.messageInputElement.value) {
        this.submitButtonElement.removeAttribute('disabled');
      } else {
        this.submitButtonElement.setAttribute('disabled', 'true');
      }
    },
    checkSetup() {
      if (!window.firebase || !(firebase.app instanceof Function) || !firebase.app().options) {
        window.alert('You have not configured and imported the Firebase SDK. ' +
          'Make sure you go through the codelab setup instructions and make ' +
          'sure you are running the codelab using `firebase serve`');
      } else {
        console.log('firebase configured')
      }
    }
  },
  mounted() {
    var MESSAGE_TEMPLATE =
      '<div class="message-container">' +
      '<div class="spacing"><div class="pic"></div></div>' +
      '<div class="message"></div>' +
      '<div class="name"></div>' +
      '</div>';

    // Adds a size to Google Profile pics URLs.
    // this.addSizeToGoogleProfilePic(url)

    // A loading image URL.
    var LOADING_IMAGE_URL = 'https://www.google.com/images/spin-32.gif?a';

    // Displays a Message in the UI.
    // this.displayMessage(key, name, text, picUrl, imageUrl)
    // this.toggleButton()

    // Checks that the Firebase SDK has been correctly setup and configured.

    // Checks that Firebase has been imported.
    this.checkSetup();

    // Shortcuts to DOM Elements.
    console.log('messageFormEl', this.messageFormElement)
    // var messageFormElement = document.getElementById('message-form');
    // var this.messageInputElement = document.getElementById('message');
    // var this.submitButtonElement = document.getElementById('submit');
    // var imageButtonElement = document.getElementById('submitImage');
    // var this.imageFormElement = document.getElementById('image-form');
    // var mediaCaptureElement = document.getElementById('mediaCapture');
    // var this.userPicElement = document.getElementById('user-pic');
    // var this.userNameElement = document.getElementById('user-name');
    // var this.signInButtonElement = document.getElementById('sign-in');
    // var this.signOutButtonElement = document.getElementById('sign-out');
    // var this.signInSnackbarElement = document.getElementById('must-signin-snackbar');

    // Saves message on form submit.
    this.messageFormElement.addEventListener('submit', this.onMessageFormSubmit);
    this.signOutButtonElement.addEventListener('click', this.signOut);
    this.signInButtonElement.addEventListener('click', this.signIn);

    // Toggle for the button.
    this.messageInputElement.addEventListener('keyup', this.toggleButton);
    this.messageInputElement.addEventListener('change', this.toggleButton);

    // Events for image upload.
    this.imageButtonElement.addEventListener('click', function (e) {
      e.preventDefault();
      this.mediaCaptureElement.click();
    });
    this.mediaCaptureElement.addEventListener('change', this.onMediaFileSelected);

    // initialize Firebase
    this.initFirebaseAuth();

    // We load currently existing chat messages and listen to new ones.
    this.loadMessages();
  }
}
</script>

<style scoped>
html, body {
  font-family: 'Roboto', 'Helvetica', sans-serif;
}
main, #messages-card {
  height: 100%;
  padding-bottom: 0;
}
#messages-card-container {
  height: calc(100% - 35px);
  padding-bottom: 0;
}
#messages-card {
  margin-top: 15px;
}
.mdl-layout__header-row span {
  margin-left: 15px;
  margin-top: 17px;
}
.mdl-grid {
  max-width: 1024px;
  margin: auto;
}
.material-icons {
  font-size: 36px;
  top: 8px;
  position: relative;
}
.mdl-layout__header-row {
  padding: 0;
  margin: 0 auto;
}
.mdl-card__supporting-text {
  width: auto;
  height: 100%;
  padding-top: 0;
  padding-bottom: 0;
}
#messages {
  overflow-y: auto;
  margin-bottom: 10px;
  height: calc(100% - 80px);
  display: flex;
  flex-direction: column;
}
#message-filler {
  flex-grow: 1;
}
.message-container:first-of-type {
  border-top-width: 0;
}
.message-container {
  display: block;
  margin-top: 10px;
  border-top: 1px solid #f3f3f3;
  padding-top: 10px;
  opacity: 0;
  transition: opacity 1s ease-in-out;
}
.message-container.visible {
  opacity: 1;
}
.message-container .pic {
  background-image: url('../assets/profile_placeholder.png');
  background-repeat: no-repeat;
  width: 30px;
  height: 30px;
  background-size: 30px;
  border-radius: 20px;
}
.message-container .spacing {
  display: table-cell;
  vertical-align: top;
}
.message-container .message {
  display: table-cell;
  width: calc(100% - 40px);
  padding: 5px 0 5px 10px;
}
.message-container .name {
  display: inline-block;
  width: 100%;
  padding-left: 40px;
  color: #bbb;
  font-style: italic;
  font-size: 12px;
  box-sizing: border-box;
}
#message-form {
  display: flex;
  flex-direction: row;
  width: calc(100% - 48px);
  float: left;
}
#image-form {
  display: flex;
  flex-direction: row;
  width: 48px;
  float: right;
}
#message-form .mdl-textfield {
  width: calc(100% - 100px);
}
#message-form button, #image-form button {
  width: 100px;
  margin: 15px 0 0 10px;
}
.mdl-card {
  min-height: 0;
}
.mdl-card {
  background: linear-gradient(white, #f9f9f9);
  justify-content: space-between;
}
#user-container {
  position: absolute;
  display: flex;
  flex-direction: row;
  top: 22px;
  width: 100%;
  right: 0;
  padding-left: 10px;
  justify-content: flex-end;
  padding-right: 10px;
}
#user-container #user-pic {
  top: -3px;
  position: relative;
  display: inline-block;
  background-image: url('../assets/profile_placeholder.png');
  background-repeat: no-repeat;
  width: 40px;
  height: 40px;
  background-size: 40px;
  border-radius: 20px;
}
#user-container #user-name {
  font-size: 16px;
  line-height: 36px;
  padding-right: 10px;
  padding-left: 20px;
}
#image-form #submitImage {
  width: auto;
  padding: 0 6px 0 1px;
  min-width: 0;
}
#image-form #submitImage .material-icons {
  top: -1px;
}
.message img {
  max-width: 300px;
  max-height: 200px;
}
#mediaCapture {
  display: none;
}
@media screen and (max-width: 610px) {
  header {
    height: 113px;
    padding-bottom: 80px !important;
  }
  #user-container {
    top: 72px;
    background-color: rgb(3,155,229);
    height: 38px;
    padding-top: 3px;
    padding-right: 2px;
  }
  #user-container #user-pic {
    top: 2px;
    width: 33px;
    height: 33px;
    background-size: 33px;
  }
}
.mdl-textfield__label:after {
  background-color: #0288D1;
}
.mdl-textfield--floating-label.is-focused .mdl-textfield__label {
  color: #0288D1;
}
.mdl-button .material-icons {
  top: -1px;
  margin-right: 5px;
}
</style>

