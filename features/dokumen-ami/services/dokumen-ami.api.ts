import { useApiRequest } from '#features/shared/api/http'

export interface DokumenAmi {
  id: string;
  modul_id: string;
  nama_dokumen: string;
  file_key: string;
  file_size: number;
  created_at: string;
  updated_at: string;
}

export interface GetDokumenAmiParams {
  modul_id: string;
  page?: number;
  limit?: number;
  search?: string;
}

export interface DokumenAmiResponse {
  data: DokumenAmi[];
  meta: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}

export function useDokumenAmiApi() {
  const { request } = useApiRequest()

  return {
    upload: (modulId: string, namaDokumen: string, file: File) => {
      const formData = new FormData();
      formData.append("modul_id", modulId);
      formData.append("nama_dokumen", namaDokumen);
      formData.append("file", file);

      return request<any>("/api/dokumen-ami", {
        method: 'POST',
        body: formData,
        // useApiRequest akan handle fetch logic
      });
    },

    getAll: (params: GetDokumenAmiParams) => {
      return request<DokumenAmiResponse>("/api/dokumen-ami", { query: params as any });
    },

    getDownloadUrl: (id: string) => {
      return request<any>(`/api/dokumen-ami/${id}/download`);
    },

    delete: (id: string) => {
      return request<any>(`/api/dokumen-ami/${id}`, { method: 'DELETE' });
    },
  }
}
