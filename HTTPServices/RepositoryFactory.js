import Repository from "./Repository";

const EXTENSIONS_BY_MIME = {
    'text/csv': 'csv',
    'application/vnd.ms-excel': 'xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx'
}

function extensionFromContentType(contentType) {
    if (!contentType) return null
    const mime = contentType.split(';')[0].trim().toLowerCase()
    return EXTENSIONS_BY_MIME[mime] || null
}

function extractFilename(contentDisposition, contentType, baseName) {
    if (contentDisposition) {
        const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i)
        if (utf8Match) return decodeURIComponent(utf8Match[1])

        const match = contentDisposition.match(/filename="?([^";]+)"?/i)
        if (match) return match[1]
    }

    const extension = extensionFromContentType(contentType) || 'csv'
    return `${baseName}.${extension}`
}

function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
}

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
    login(resource, id, data) {
        return Repository.post(`/${resource}/login/${id}`, data)
    },
    changepass(resource, id, data) {
        return Repository.post(`/${resource}/changepass/${id}`, data)
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
    },
    async exportEntity(sessionId, type) {
        const res = await Repository.get(`/io/${sessionId}/${type}/export`, {
            responseType: 'blob'
        })

        const filename = extractFilename(res.headers['content-disposition'], res.headers['content-type'], type)
        downloadBlob(res.data, filename)

        return res
    },
    importEntity(sessionId, type, file) {
        return Repository.post(`/io/${sessionId}/${type}/import`, file, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    }
}