import { axiosInstanceWithAuth } from '@/lib/axiosConfig';
import URL_API from '../../urls';
import { TPlan, TCreatePlan, TUpdatePlan } from './type';

/**
 * Get all plans
 */
const getList = async () => {
  const response = await axiosInstanceWithAuth.get<{
    success: boolean;
    data: TPlan[];
    message: string;
  }>(URL_API.ADMIN.PLANS.V1.GET_LIST);
  return response.data;
};

/**
 * Create new plan
 */
const create = async (payload: TCreatePlan) => {
  const response = await axiosInstanceWithAuth.post<{
    success: boolean;
    data: TPlan;
    message: string;
  }>(URL_API.ADMIN.PLANS.V1.CREATE, payload);
  return response.data;
};

/**
 * Update plan
 */
const update = async (id: string, payload: TUpdatePlan) => {
  const response = await axiosInstanceWithAuth.put<{
    success: boolean;
    data: TPlan;
    message: string;
  }>(`${URL_API.ADMIN.PLANS.V1.UPDATE}/${id}`, payload);
  return response.data;
};

/**
 * Delete plan
 */
const deletePlan = async (id: string) => {
  const response = await axiosInstanceWithAuth.delete<{
    success: boolean;
    data: TPlan;
    message: string;
  }>(`${URL_API.ADMIN.PLANS.V1.DELETE}/${id}`);
  return response.data;
};

/**
 * Get plan detail
 */
const getDetail = async (id: string) => {
  const response = await axiosInstanceWithAuth.get<{
    success: boolean;
    data: TPlan;
    message: string;
  }>(`${URL_API.ADMIN.PLANS.V1.DETAIL}/${id}`);
  return response.data;
};

const AdminPlansAPI = {
  getList,
  create,
  update,
  delete: deletePlan,
  getDetail,
};

export default AdminPlansAPI;
