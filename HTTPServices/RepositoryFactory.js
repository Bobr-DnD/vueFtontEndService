import Repository from "./Repository";


export default {
    get(resource) {
        return Repository.get(`/${resource}`)
    },
    getById(resource, id) {
        return Repository.get(`/${resource}/${id}`)
    },
    create(resource, data) {
        return Repository.post(`/${resource}`, data)
    },
    update(resource, id, data) {
        return Repository.patch(`/${resource}/${id}`, data)
    },
    delete(resource, id) {
        return Repository.delete(`/${resource}/${id}`)
    },
    createFile(resource, file) {
        return Repository.post(`/${resource}`, file, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    },
    deleteFile(resource, fileName) {
        return Repository.delete(`/${resource}/${fileName}`)
    }
}