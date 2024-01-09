<template>
  <div class="flex h-[100dvh] flex-col items-center justify-center bg-gray-200/70 px-20">
    <div class="w-full max-w-3xl bg-white p-5 text-center">
      <h2 class="text-xl">請登入 Google 與 Facebook 帳號</h2>

      <!-- Google -->
      <div class="mx-auto w-fit py-5">
        <!-- 未登入 -->
        <div v-if="!googleData.token" class="cursor-pointer">
          <img src="/google.svg" alt="Google Login" @click="handleGoogleSignIn" />
        </div>
        <!-- 已登入 -->
        <div v-else class="flex">已登入 Google： {{ googleData.userInfo.name }}</div>
      </div>

      <!-- Facebook -->
      <div class="mx-auto w-fit py-5">
        <!-- 未登入 -->
        <div v-if="!facebookData.token" @click="handleFacebookResponse">
          <img src="/facebook.svg" alt="Facebook Login" class="cursor-pointer" />
        </div>
        <!-- 已登入 -->
        <div v-else class="flex">已登入 Facebook： {{ facebookData.userInfo.name }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { jwtDecode } from 'jwt-decode';
import { useUserStore } from '../../stores/userStore';

const userStore = useUserStore();
const googleData = userStore.google;
const facebookData = userStore.facebook;

// Google
const initGoogleSDK = () => {
  google.accounts.id.initialize({
    client_id: '1086078305871-iup5d2qsg8gnaugrh6mg28spg58a3gcf.apps.googleusercontent.com',
    callback: handleGoogleResponse,
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

const handleGoogleSignIn = () => {
  google.accounts.id.prompt();
};

// Facebook
const handleFacebookResponse = () => {
  userStore.setUserToken('facebook', 'testok');
  // FB.getLoginStatus(function (response) {
  //   statusChangeCallback(response);
  // });
};

const initFacebookSDK = () => {
  window.fbAsyncInit = function () {
    FB.init({
      appId: '1086542409456727',
      cookie: true,
      xfbml: true,
      version: 'v18.0',
    });

    FB.AppEvents.logPageView();
  };
};

onMounted(() => {
  initGoogleSDK();
  initFacebookSDK();
});
</script>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
