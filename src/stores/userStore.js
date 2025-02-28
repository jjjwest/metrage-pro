import { defineStore } from 'pinia';

import { ref } from 'vue';



export const useUserStore = defineStore('user', () => {

  const user = ref(null);

  const role = ref('');



  const login = (userInfo, userRole) => {

    user.value = userInfo;

    role.value = userRole;

  };



  const logout = () => {

    user.value = null;

    role.value = '';

  };



  return { user, role, login, logout };

});