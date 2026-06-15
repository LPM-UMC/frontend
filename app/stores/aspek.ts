import { defineStore } from "pinia";
import { useAuthStore } from "./auth";
import { useRuntimeConfig, useNuxtApp } from "nuxt/app";

import type {
  AspekResponse,
  CreateAspekRequest,
  UpdateAspekRequest,
} from "#types/aspek";

export const useAspekStore = defineStore("aspek", {
  state: () => ({
    aspeks: [] as AspekResponse[],
    aspek: null as AspekResponse | null,
    meta: null as {
      total: number;
      page: number;
      size: number;
      total_pages: number;
    } | null,

    isLoading: false,
    error: null as string | null,
  }),

  actions: {
    // ================= GET LIST ASPEK PER MODUL =================
    async fetchAspeks(
      lang: string,
      baseURL: string,
      modulId: string,
      params?: {
        page?: number;
        size?: number;
        search?: string;
        order?: "asc" | "desc";
      }
    ) {
      const auth = useAuthStore();

      this.isLoading = true;
      this.error = null;

      try {
        const query = new URLSearchParams();

        if (params?.page) query.append("page", String(params.page));
        if (params?.size) query.append("size", String(params.size));
        if (params?.search) query.append("search", params.search);
        if (params?.order) query.append("order", params.order);

        const res = await $fetch<{
          data: AspekResponse[];
          meta: { total: number; page: number; size: number; total_pages: number };
        }>(
          `/api/modul/${modulId}/aspek?${query.toString()}`,
          {
            baseURL,
            headers: {
              "Accept-Language": lang,
              ...(auth.accessToken ? { Authorization: `Bearer ${auth.accessToken}` } : {}),
            },
          }
        );

        this.aspeks = res.data;
        this.meta = res.meta;

        return res;
      } catch (err: any) {
        this.error = err?.data?.errors || err?.data?.message || "Gagal mengambil daftar aspek";
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    // ================= GET DETAIL =================
    async fetchAspekById(lang: string, baseURL: string, aspekId: string) {
      const auth = useAuthStore();

      this.isLoading = true;
      this.error = null;

      try {
        const res = await $fetch<{ data: AspekResponse }>(
          `/api/aspek/${aspekId}`,
          {
            baseURL,
            headers: {
              "Accept-Language": lang,
              ...(auth.accessToken ? { Authorization: `Bearer ${auth.accessToken}` } : {}),
            },
          }
        );

        this.aspek = res.data;

        return res.data;
      } catch (err: any) {
        this.error = err?.data?.errors || err?.data?.message || "Gagal mengambil detail aspek";
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    // ================= CREATE =================
    async createAspek(
      lang: string,
      baseURL: string,
      modulId: string,
      payload: CreateAspekRequest
    ) {
      const auth = useAuthStore();

      this.isLoading = true;
      this.error = null;

      try {
        const res = await $fetch<{ data: AspekResponse }>(
          `/api/modul/${modulId}/aspek`,
          {
            method: "POST",
            baseURL,
            headers: {
              "Accept-Language": lang,
              ...(auth.accessToken ? { Authorization: `Bearer ${auth.accessToken}` } : {}),
            },
            body: payload,
          }
        );

        this.aspeks.unshift(res.data);

        return res.data;
      } catch (err: any) {
        this.error = err?.data?.errors || err?.data?.message || "Gagal membuat aspek";
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    // ================= UPDATE =================
    async updateAspek(
      lang: string,
      baseURL: string,
      aspekId: string,
      payload: UpdateAspekRequest
    ) {
      const auth = useAuthStore();

      this.isLoading = true;
      this.error = null;

      try {
        const res = await $fetch<{ data: AspekResponse }>(
          `/api/aspek/${aspekId}`,
          {
            method: "PUT",
            baseURL,
            headers: {
              "Accept-Language": lang,
              ...(auth.accessToken ? { Authorization: `Bearer ${auth.accessToken}` } : {}),
            },
            body: payload,
          }
        );

        // update list
        this.aspeks = this.aspeks.map((a) =>
          a.id === aspekId ? res.data : a
        );

        // update detail
        if (this.aspek?.id === aspekId) {
          this.aspek = res.data;
        }

        return res.data;
      } catch (err: any) {
        this.error = err?.data?.errors || err?.data?.message || "Gagal mengupdate aspek";
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    // ================= DELETE =================
    async deleteAspek(lang: string, baseURL: string, aspekId: string) {
      const auth = useAuthStore();

      this.isLoading = true;
      this.error = null;

      try {
        await $fetch(
          `/api/aspek/${aspekId}`,
          {
            method: "DELETE",
            baseURL,
            headers: {
              "Accept-Language": lang,
              ...(auth.accessToken ? { Authorization: `Bearer ${auth.accessToken}` } : {}),
            },
          }
        );

        // remove dari state list
        this.aspeks = this.aspeks.filter((a) => a.id !== aspekId);
        if (this.aspek?.id === aspekId) {
          this.aspek = null;
        }

      } catch (err: any) {
        this.error = err?.data?.errors || err?.data?.message || "Gagal menghapus aspek";
        throw err;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
