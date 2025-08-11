import Repository from "./Repository";


export default {
    get(resource){
        return Repository.get(`/${resource}`)
    },
    getById(resource, id){
        return Repository.get(`/${resource}/${id}`)
    },
    create(resource, data){
        return Repository.post(`/${resource}`, data)
    },
    update(resource, id, data){
        return Repository.patch(`/${resource}/${id}`, data)
    }
}