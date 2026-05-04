import { useAuthStore } from "../stores/auth";
import { defineNuxtPlugin } from "nuxt/app";

export default defineNuxtPlugin(async () => {
  const auth = useAuthStore();

  await auth.initAuth();
});
