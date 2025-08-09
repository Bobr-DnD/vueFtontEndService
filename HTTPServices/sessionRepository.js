import Repository from "./Repository";

const resource = '/session'

export default {
    get(){
        return Repository.get(`${resource}`)
    },
    getById(id){
        return Repository.get(`${resource}/${id}`)
    },
    create(data){
        return Repository.post(`${resource}`, data)
    },
    update(id, data){
        return Repository.patch(`${resource}/${id}`, data)
    }
}