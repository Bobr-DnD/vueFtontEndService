import { notify } from "./notification"

export async function asyncHandler(promise) {
  try {
    const data = await promise
    return [data, null]
  } catch (err) {
    if (err.response) {
      notify({message: `${err.response.data?.error || 'Server error'}`, type: 'error'})
      
      console.error('API Error:', err.response.status, err.response.data)
      return [null, { message: err.response.data?.error || 'Server error', status: err.response.status }]
    }
    if (err.request) {
      notify({message: `No response from server`, type: 'error'})
      
      console.error('Network Error:', err.request)
      return [null, { message: 'No response from server', status: null }]
    }
    
    notify({message: `Client Error: ${err.message}`, type: 'error'})
    
    console.error('Client Error:', err.message)
    return [null, { message: err.message, status: null }]
  }
}
