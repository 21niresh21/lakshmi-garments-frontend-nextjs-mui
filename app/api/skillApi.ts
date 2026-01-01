import { Skill } from "../_types/Skill";
import { SkillFormData } from "../components/shared/SkillFormModal";
import axiosInstance from "../config/axiosConfig";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
const baseUrl = API_BASE_URL + "/skills";

export const fetchSkills = async (search: string): Promise<Skill[]> => {
  try {
    const response = await axiosInstance.get(`${baseUrl}?search=${search}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching skills:", error);
    throw error;
  }
};

export const updateSkill = async (
  skillId: number,
  updatedData: SkillFormData
) => {
  try {
    const response = await axiosInstance.put(
      `${baseUrl}/${skillId}`,
      updatedData
    );

    return response.data; // return only data (best practice)
  } catch (error) {
    console.error("Error updating skill:", error);
    throw error;
  }
};

export const addSkill = async (skillData: SkillFormData): Promise<Skill> => {
  try {
    const response = await axiosInstance.post(baseUrl, skillData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
