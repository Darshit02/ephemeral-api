import { useAuth } from './auth'
import { env } from './env'

interface ApiOptions extends RequestInit {
  token?: string | null
}

export class ApiError extends Error {
  code?: string
  status: number

  constructor(message: string, status: number, code?: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

async function request<T>(
  baseUrl: string,
  path: string,
  options: ApiOptions = {}
): Promise<T> {
  const token = options.token ?? useAuth.getState().token
  const headers = new Headers(options.headers)

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const url = `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`

  const response = await fetch(url, {
    ...options,
    headers,
  })

  let data: any
  try {
    const text = await response.text()
    data = text ? JSON.parse(text) : null
  } catch (err) {
    data = null
  }

  if (!response.ok) {
    if (response.status === 401) {
      useAuth.getState().logout()
      if (typeof window !== 'undefined') {
        document.cookie = 'ephemeral-token=; path=/; max-age=0; SameSite=Lax'
        const currentPath = window.location.pathname
        if (!currentPath.startsWith('/login') && !currentPath.startsWith('/register')) {
          const next = encodeURIComponent(window.location.pathname + window.location.search)
          window.location.href = `/login?expired=1&next=${next}`
        }
      }
    }

    const errorMsg =
      data?.error?.message ||
      data?.message ||
      `Request failed with status ${response.status}`
    const errorCode = data?.error?.code
    throw new ApiError(errorMsg, response.status, errorCode)
  }

  // Handle { data: ... } wrapped response or direct response
  if (data && typeof data === 'object' && 'data' in data) {
    return data.data as T
  }

  return data as T
}

export const api = {
  core: {
    get: <T>(path: string, options?: ApiOptions) =>
      request<T>(env.CORE_API_URL, path, { ...options, method: 'GET' }),
    post: <T>(path: string, body?: any, options?: ApiOptions) =>
      request<T>(env.CORE_API_URL, path, {
        ...options,
        method: 'POST',
        body: body ? JSON.stringify(body) : undefined,
      }),
    put: <T>(path: string, body?: any, options?: ApiOptions) =>
      request<T>(env.CORE_API_URL, path, {
        ...options,
        method: 'PUT',
        body: body ? JSON.stringify(body) : undefined,
      }),
    del: <T>(path: string, options?: ApiOptions) =>
      request<T>(env.CORE_API_URL, path, { ...options, method: 'DELETE' }),
  },
  admin: {
    get: <T>(path: string, options?: ApiOptions) =>
      request<T>(env.ADMIN_API_URL, path, { ...options, method: 'GET' }),
    post: <T>(path: string, body?: any, options?: ApiOptions) =>
      request<T>(env.ADMIN_API_URL, path, {
        ...options,
        method: 'POST',
        body: body ? JSON.stringify(body) : undefined,
      }),
    put: <T>(path: string, body?: any, options?: ApiOptions) =>
      request<T>(env.ADMIN_API_URL, path, {
        ...options,
        method: 'PUT',
        body: body ? JSON.stringify(body) : undefined,
      }),
    del: <T>(path: string, options?: ApiOptions) =>
      request<T>(env.ADMIN_API_URL, path, { ...options, method: 'DELETE' }),
  },
  gateway: {
    call: async (
      slug: string,
      subpath: string,
      apiKey: string,
      method: string = 'GET',
      headers: Record<string, string> = {},
      body?: any
    ) => {
      const cleanPath = subpath.startsWith('/') ? subpath.slice(1) : subpath
      const url = `${env.GATEWAY_URL}/v1/${slug}/${cleanPath}`

      const reqHeaders = new Headers(headers)
      reqHeaders.set('X-API-Key', apiKey)

      const startTime = performance.now()
      const res = await fetch(url, {
        method,
        headers: reqHeaders,
        body: body ? (typeof body === 'string' ? body : JSON.stringify(body)) : undefined,
      })
      const latencyMs = Math.round(performance.now() - startTime)

      let resData: any
      const rawText = await res.text()
      try {
        resData = JSON.parse(rawText)
      } catch {
        resData = rawText
      }

      return {
        status: res.status,
        statusText: res.statusText,
        latencyMs,
        headers: Object.fromEntries(res.headers.entries()),
        data: resData,
      }
    },
  },
}
