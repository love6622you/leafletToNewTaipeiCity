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
          @click="handleFacebookResponse"
        />
        <!-- 已登入 -->
        <div v-else class="flex">已登入 Facebook： {{ facebookData.userInfo.name }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { nextTick, onMounted, ref } from 'vue';
import { jwtDecode } from 'jwt-decode';
import { useUserStore } from '../../stores/userStore';

const userStore = useUserStore();
const googleData = userStore.google;
const facebookData = userStore.facebook;

const googleBtnRef = ref(null);

// Google
const initGoogleSDK = () => {
  if (google && google.accounts && google.accounts.id) {
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
  }
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

// Facebook
const initFacebookSDK = () => {
  window.fbAsyncInit = function () {
    FB.init({
      appId: `${import.meta.env.VITE_APP_FACEBOOK_ID}`,
      cookie: true,
      xfbml: true,
      version: 'v18.0',
    });

    FB.AppEvents.logPageView();
  };
};

const handleFacebookResponse = () => {
  userStore.setUserToken('facebook', 'testok');
  // FB.getLoginStatus(function (response) {
  //   statusChangeCallback(response);
  // });
};

onMounted(() => {
  console.log(window.google);
  nextTick(() => {
    initGoogleSDK();
    initFacebookSDK();
  });
});
</script>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
