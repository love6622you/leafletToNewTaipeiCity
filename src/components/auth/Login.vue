<template>
  <div class="flex h-[100dvh] flex-col items-center justify-center bg-gray-200/70 px-20">
    <div class="w-full max-w-3xl bg-white p-5 text-center">
      <h2 class="text-xl">請登入 Google 與 Facebook 帳號</h2>

      <!-- Google -->
      <div class="mx-auto w-fit py-5">
        <!-- 未登入 -->
        <template v-if="!googleData.token">
          <div ref="googleBtnRef" />
        </template>
        <!-- 已登入 -->
        <div v-else class="flex">已登入 Google： {{ googleData.userInfo.name }}</div>
      </div>

      <!-- Facebook -->
      <div class="mx-auto w-fit py-5">
        <!-- 未登入 -->
        <img
          v-if="!facebookData.token"
          src="/facebook.svg"
          alt="Facebook Login"
          class="cursor-pointer"
          @click="onFBLogin"
        />
        <fb:login-button
          v-if="!facebookData.token"
          scope="public_profile,email"
          v-bind="{
            onlogin: checkLoginState(),
          }"
        >
        </fb:login-button>
        <!-- 已登入 -->
        <div v-else class="flex">已登入 Facebook： {{ facebookData.userInfo.name }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { jwtDecode } from 'jwt-decode';
import { useUserStore } from '../../stores/userStore';

const userStore = useUserStore();
const googleData = userStore.google;
const facebookData = userStore.facebook;

const googleBtnRef = ref(null);

//#region Google
const createGoogleScript = (callback) => {
  if (!window.google) {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      callback();
    };
    document.body.appendChild(script);
  } else {
    callback();
  }
};

const initGoogleSDK = () => {
  google.accounts.id.initialize({
    client_id: `${import.meta.env.VITE_APP_GOOGLE_ID}`,
    callback: handleGoogleResponse,
  });

  google.accounts.id.renderButton(googleBtnRef.value, {
    theme: 'outline',
    size: 'large',
    type: 'icon',
    shape: 'circle',
  });
};

const handleGoogleResponse = (response) => {
  let token = jwtDecode(response.credential);

  const userInfo = {
    name: token.name,
    picture: token.picture,
  };

  userStore.setUserToken('google', response.credential);
  userStore.setUserInfo('google', userInfo);
};
//#endregion

//#region Facebook

const createFacebookScript = (callback = () => {}) => {
  window.fbAsyncInit = function () {
    FB.init({
      appId: `${import.meta.env.VITE_APP_FACEBOOK_ID}`,
      cookie: true,
      xfbml: true,
      version: 'v18.0',
    });

    FB.getLoginStatus(function (response) {
      // Called after the JS SDK has been initialized.
      statusChangeCallback(response); // Returns the login status.
    });
  };
};

function statusChangeCallback(response) {
  // Called with the results from FB.getLoginStatus().
  console.log('statusChangeCallback');
  console.log(response); // The current login status of the person.
  if (response.status === 'connected') {
    // Logged into your webpage and Facebook.
    testAPI();
  } else {
    // Not logged into your webpage or we are unable to tell.
    // document.getElementById('status').innerHTML = 'Please log ' + 'into this webpage.';
  }
}

function checkLoginState() {
  // Called when a person is finished with the Login Button.
  FB.getLoginStatus(function (response) {
    // See the onlogin handler
    statusChangeCallback(response);
  });
}

function testAPI() {
  // Testing Graph API after login.  See statusChangeCallback() for when this call is made.
  console.log('Welcome!  Fetching your information.... ');
  FB.api('/me', function (response) {
    console.log('Successful login for: ' + response.name);
    // document.getElementById('status').innerHTML = 'Thanks for logging in, ' + response.name + '!';
  });
}

// const getFBProfile = (fields = ['name', 'id', 'picture']) => {
//   window.FB.api(`/me?fields=${fields.join(',')}`, (profile) => {
//     if (profile.error) {
//       alert('get profile Error');
//     } else {
//       userStore.setUserInfo('facebook', {
//         ...profile,
//         picture: profile.picture.data.url,
//       });
//     }
//   });
// };

// const onFBLogin = () => {
//   window.FB.login(
//     (response) => {
//       if (response.status === 'connected') {
//         const token = response.authResponse.accessToken;
//         userStore.setUserToken('facebook', token);

//         getFBProfile();
//       } else {
//         alert('facebook login error');
//       }
//     },
//     { scope: 'public_profile,email' },
//   );
// };

//#endregion

onMounted(() => {
  createGoogleScript(initGoogleSDK);
  createFacebookScript();
});
</script>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
