import api from "@/lib/axios"

const classPath = "/teacher/classes"

export const getAllClasses = async () => {
    return api.get(`${classPath}`)
}

export const getRecentClasses = async () => {
    return api.get(`${classPath}/recent`)
}