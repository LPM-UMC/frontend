import { ref } from "vue";
import { useDokumenAmiApi, type DokumenAmi, type GetDokumenAmiParams } from "../services/dokumen-ami.api";

export const useDokumenAmi = () => {
  const isLoading = ref(false);
  const dataDokumen = ref<DokumenAmi[]>([]);
  const meta = ref({
    total: 0,
    page: 1,
    limit: 10,
    total_pages: 0,
  });

  const api = useDokumenAmiApi();

  const fetchDokumen = async (params: GetDokumenAmiParams) => {
    isLoading.value = true;
    try {
      const response = await api.getAll(params);
      if (!response) return;
      dataDokumen.value = response.data;
      meta.value = response.meta;
    } catch (error) {
      console.error("Error fetching dokumen ami:", error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const uploadDokumen = async (modulId: string, namaDokumen: string, file: File) => {
    isLoading.value = true;
    try {
      const response = await api.upload(modulId, namaDokumen, file);
      return response;
    } catch (error) {
      console.error("Error uploading dokumen ami:", error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const downloadDokumen = async (id: string) => {
    try {
      const response = await api.getDownloadUrl(id);
      if (!response || !response.url) return;
      const { url } = response;
      
      // Menggunakan window.open atau mengubah window.location untuk menghindari pop-up blocker
      const newWindow = window.open(url, '_blank');
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        // Jika pop-up diblokir, fallback ke tab saat ini
        window.location.href = url;
      }
    } catch (error) {
      console.error("Error downloading dokumen ami:", error);
      throw error;
    }
  };

  const deleteDokumen = async (id: string) => {
    isLoading.value = true;
    try {
      await api.delete(id);
    } catch (error) {
      console.error("Error deleting dokumen ami:", error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isLoading,
    dataDokumen,
    meta,
    fetchDokumen,
    uploadDokumen,
    downloadDokumen,
    deleteDokumen,
  };
};
