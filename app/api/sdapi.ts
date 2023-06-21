import { NextRequest, NextResponse } from "next/server";

// Define the base URL of the service
const BASE_URL = "http://sd.loee.vip:9999/sdapi/v1/";

// This function will handle the API call
async function handle(
  req: NextRequest,
  { params }: { params: { path: string[] } },
) {
  // Get the service path from the request parameters
  const servicePath = params.path.join("/");

  // Parse the request body
  const body = await req.json();

  // Send a POST request to the service
  const res = await fetch(`${BASE_URL}${servicePath}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  // Parse the response
  const data = await res.json();

  // Return the response to the client
  return NextResponse.json(data);
}

// Define the request methods this handler can handle
export const POST = handle;

// Set this to `edge` if you want to use Edge Functions,
// or `server` if you want to use Server Functions.
export const runtime = "server";
