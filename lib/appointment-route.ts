import type { AppointmentApiResponse } from "../types/appointment";
import type { BookingServiceDeps } from "./bookings";
import { processAppointmentSubmission } from "./bookings";

export function createAppointmentHandler(deps: BookingServiceDeps) {
  return async function POST(request: Request): Promise<Response> {
    try {
      const payload = await request.json();
      const result: AppointmentApiResponse = await processAppointmentSubmission(payload, deps);
      return Response.json(result.body, { status: result.status });
    } catch {
      return Response.json(
        {
          success: false,
          code: "VALIDATION_ERROR",
          errors: [
            {
              path: "form",
              message: "Request body must be valid JSON."
            }
          ]
        },
        { status: 400 }
      );
    }
  };
}
