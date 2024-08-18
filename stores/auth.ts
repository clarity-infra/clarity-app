export const useAuthStore = defineStore("auth", () => {
    const token = ref<string>();
    const credential = ref<any>();

    const isAuthenticated = computed(() => {
        return !!token.value;
    })

    const authenticate = (userCredential: any) => {
        credential.value = userCredential;
        token.value = "abc";
    }


    return {
        token,
        credential,
        isAuthenticated
    }
})