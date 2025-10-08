export async function asyncHandler(promise) {
  try {
    const data = await promise
    return [data, null]
  } catch (err) {
    if (err.response) {
      console.error('API Error:', err.response.status, err.response.data)
      return [null, { message: err.response.data?.error || 'Server error', status: err.response.status }]
    }
    if (err.request) {
      console.error('Network Error:', err.request)
      return [null, { message: 'No response from server', status: null }]
    }
    console.error('Client Error:', err.message)
    return [null, { message: err.message, status: null }]
  }
}
