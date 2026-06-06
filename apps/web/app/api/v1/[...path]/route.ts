import { NextRequest } from "next/server"

const apiBaseUrl = process.env.API_BASE_URL ?? "http://127.0.0.1:8080"

export const dynamic = "force-dynamic"

async function proxy(request: NextRequest, method: string) {
  const url = new URL(request.url)
  const upstream = new URL(url.pathname.replace(/^\/api\/v1/, "/api/v1"), apiBaseUrl)
  upstream.search = url.search

  const headers = new Headers(request.headers)
  headers.delete("host")
  headers.delete("content-length")

  const body = method === "GET" || method === "HEAD" ? undefined : await request.arrayBuffer()

  const response = await fetch(upstream, {
    method,
    headers,
    body,
    redirect: "manual",
  })

  const forwardedHeaders = new Headers(response.headers)
  const setCookies = (response.headers as Headers & {
    getSetCookie?: () => string[]
  }).getSetCookie?.()

  forwardedHeaders.delete("content-encoding")
  forwardedHeaders.delete("transfer-encoding")
  forwardedHeaders.delete("content-length")
  forwardedHeaders.delete("set-cookie")

  const proxied = new Response(response.body, {
    status: response.status,
    headers: forwardedHeaders,
  })

  if (setCookies?.length) {
    for (const cookie of setCookies) {
      proxied.headers.append("set-cookie", cookie)
    }
  }

  return proxied
}

export async function GET(request: NextRequest) {
  return proxy(request, "GET")
}

export async function POST(request: NextRequest) {
  return proxy(request, "POST")
}

export async function PUT(request: NextRequest) {
  return proxy(request, "PUT")
}

export async function PATCH(request: NextRequest) {
  return proxy(request, "PATCH")
}

export async function DELETE(request: NextRequest) {
  return proxy(request, "DELETE")
}

export async function OPTIONS(request: NextRequest) {
  return proxy(request, "OPTIONS")
}
