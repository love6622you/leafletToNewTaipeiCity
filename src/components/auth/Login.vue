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

const getFBProfile = (fields = ['name', 'id', 'picture']) => {
  window.FB.api(`/me?fields=${fields.join(',')}`, (profile) => {
    console.log(profile);
    if (profile.error) {
      alert('get profile Error');
    } else {
      userStore.setUserInfo('facebook', {
        ...profile,
        picture: profile.picture.data.url,
      });
    }
  });
};

const onFBLogin = () => {
  window.FB.login(
    (response) => {
      if (response.status === 'connected') {
        const token = response.authResponse.accessToken;
        userStore.setUserToken('facebook', token);

        getFBProfile();
      } else {
        alert('facebook login error');
      }
    },
    // { scope: 'public_profile,email' },
    { scope: 'user_photos' },
  );
};

//#endregion

onMounted(() => {
  createGoogleScript(initGoogleSDK);
});
</script>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
